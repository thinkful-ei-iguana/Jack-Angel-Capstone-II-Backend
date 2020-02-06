const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth');
const SLL = require('./SLL');
const bodyParser = express.json();

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getNextWord(
        req.app.get('db'),
        req.language.head
      )
      res.status(200).json({
        totalScore: req.language.total_score,
        ...nextWord
      })
      next();
    }
    catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', bodyParser, async (req, res, next) => {
    const { guess } = req.body;
    if (!guess) {
      return res.status(400).send({ error: "Missing 'guess' in request body" });
    }
    let LL = new SLL;
    try {

      let tempArr = await LanguageService.createSLL(req.app.get('db'), LL, req.language.head)
      let val = req.language.head;
      for(let i =0; i < tempArr.length; i++){
        for(let j =0; j < tempArr.length; j++){
          if(tempArr[j].id === val){
            LL.insert(tempArr[j]);
            val = tempArr[j].next;
          }
        }
      }
      
      if (LL.head.value === null) {
        LL.head = LL.head.next;
      }

      //check the guess to the correct answer
      let correct = false;
      //if correct

      if (LL.head.value.translation.toLowerCase() === guess.toLowerCase()) {
        //double memory value and add one to correct count and total score
        LL.head.value.memory_value *= 2;
        LL.head.value.correct_count = LL.head.value.correct_count + 1;
        req.language.total_score += 1;
        correct = true;

        //if incorrect
      } else {
        //set memory to 1, increase incorrect count by one and subtract total score by one
        LL.head.value.memory_value = 1;
        LL.head.value.incorrect_count = LL.head.value.incorrect_count + 1;
        req.language.total_score -= 1;
      }

      if(req.language.total_score < 0){
        req.language.total_score = 0;
      }

      //then move the node back an amount of spaces 
      //or move it to the end of the list if too big

      let temp = LL.head;

      const prevValue = LL.moveBack(LL.head.value.memory_value);

      //in the database, update total score and head in language
      await LanguageService.updateLang(req.app.get('db'), req.language.id, req.language.total_score, LL.head.value.id);

      //then in the database, update the correct and incorrect count, the memory_value, and next for the item
      let moved = await LanguageService.updateMoved(req.app.get('db'), prevValue.next.value.id, prevValue.next.next,
        temp.value.correct_count, temp.value.incorrect_count, temp.value.memory_value);


      //then in the database, update the next for the prev item

      await LanguageService.updatePrev(req.app.get('db'), prevValue.value.id, prevValue.next.value.id);


      //then return things in the proper formatting
      let result = {
        answer: moved[0].translation,
        isCorrect: correct,
        nextWord: LL.head.value.original,
        totalScore: req.language.total_score,
        wordCorrectCount: moved[0].correct_count,
        wordIncorrectCount: moved[0].incorrect_count,
      }

      res.json(result);

    } catch (error) {
      //next(error);
    }
  })

module.exports = languageRouter
