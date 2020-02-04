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

      
  }
}

module.exports = LanguageService
