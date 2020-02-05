//const SLL = require('./SLL');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getNextWord(db, head) {
    return db.from('word').select(
      'original',
      'correct_count',
      'incorrect_count'
      )
      .where({id: head++})
      .then(res =>{
        let ret = {
          wordCorrectCount: res[0].correct_count,
          nextWord: res[0].original,
          wordIncorrectCount: res[0].incorrect_count
        }
        return ret;
      })

      
  },

  createSLL(db, SLL, head){
    return db.from('word')
      .then(res =>{
        return res; 
      })
    
  },

  updateLang(db, id, score, head){
    return db('language').where('id', id).update({
      total_score: score,
      head: head
    })
  },

  updateMoved(db, id, nextNode, correct_count, incorrect_count, memory_value){
    //return db.from('word').select('*')
    let next = null;
    if(nextNode !== null){
      next = nextNode.value.id
    }

    return db('word').where({id: id}).update({
      correct_count: correct_count,
      incorrect_count: incorrect_count,
      memory_value: memory_value,
      next: next
    }, ['correct_count', 'incorrect_count', 'translation']);
  },

  updatePrev(db, id, next){
    return db('word').where('id', id).update({
      next: next
    })
  }
}

module.exports = LanguageService
