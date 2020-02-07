module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgresql://dunder-mifflin@localhost/spaced-repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'spaced-repetition-jwt-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}


//Angel's postgres link 'postgresql://postgres@localhost/spaced-reps' 