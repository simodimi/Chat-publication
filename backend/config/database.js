const { Sequelize } = require("sequelize");
require("dotenv").config();

//variable d'environnement
const DB_HOST = process.env.HOST;
const DB_USER = process.env.USER;
const DB_PASSWORD = process.env.PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.NAME;
//const DB_DIALECT = process.env.DIALECT;

//creer une nouvelle instance de sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

// Test de la connexion
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données établie avec succès.");
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données:", err);
  });

module.exports = sequelize;
