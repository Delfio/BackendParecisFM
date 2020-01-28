require('dotenv/config');


module.exports = {
  dialect: process.env.DIALECT,
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: process.env.timestamps,
    underscored: process.env.underscored,
    underscoredAll: process.env.underscoredAll,
  }
};