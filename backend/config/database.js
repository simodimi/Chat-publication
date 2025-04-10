const { Sequelize } = require("sequelize");
require("dotenv").config();

//variable d'environnement
const DB_HOST = process.env.HOST;
const DB_USER = process.env.USER;
const DB_PASSWORD = process.env.PASSWORD;
const DB_PORT = process.env.DB_PORT; //convertir en nombre
const DB_NAME = process.env.NAME;
//const DB_DIALECT = process.env.DIALECT;

//creer une nouvelle instance de sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: console.log, //afficher les requetes sql dans la console
});
//connexion à la bdd
async function testconnection() {
  try {
    await sequelize.authenticate();
    console.log("connexion à la bdd réussie");
  } catch (error) {
    console.error("impossible de se connecter", error);
    process.exit(1); //quitter le processus en cas d'erreur
  }
}
testconnection();
module.exports = sequelize;
