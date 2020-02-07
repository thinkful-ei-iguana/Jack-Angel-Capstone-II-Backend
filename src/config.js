module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgres://opycoywlifnajg:be34ae643ea89e34560678827bb92dae962eab184ac1e2a003169dccf5eb6d2f@ec2-3-213-192-58.compute-1.amazonaws.com:5432/d55jhq0uq0da4s',
  JWT_SECRET: process.env.JWT_SECRET || 'spaced-repetition-jwt-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}


//Angel's postgres link 'postgresql://postgres@localhost/spaced-reps' 