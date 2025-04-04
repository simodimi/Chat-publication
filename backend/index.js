const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const Port = process.env.PORT || 3000;
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const sequelize = require("../backend/config/database");
//routes
const userRoute = require("./routes/UserRoute");
//importation des modéles
const User = require("./models/User");

//middleware
//permet de traiter les requetes en json
app.use(express.json());

app.use("/users", userRoute); //prefixe route utilisateur
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true })); // Pour gérer les données envoyées par formulaire
app.use(express.static(path.join(__dirname, "public"))); // Sert les fichiers statiques depuis le dossier "public"

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("connection ok.");

    // Synchronisation des modèles avec la base de données
    await sequelize.sync(); // Crée les tables si elles n'existent pas

    app.listen(Port, () => {
      console.log("server started");
    });
  } catch (error) {
    console.error("erreur connection:", error);
  }
}
startServer();
