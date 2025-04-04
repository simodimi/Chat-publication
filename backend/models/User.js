const sequelize = require("../config/database"); //importer la configuration de la bdd
const { DataTypes } = require("sequelize"); //importer les types de donnees

const User = sequelize.define("User", {
  id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_utilisateur: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false, //obligatoire
  },
  email_utilisateur: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false, //obligatoire
  },
  password_utilisateur: {
    type: DataTypes.STRING(100),
    allowNull: false, //obligatoire
  },
  photo_profil: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  date_inscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Date d'inscription par défaut
  },
  statut: {
    type: DataTypes.ENUM("en ligne", "hors ligne"),
    defaultValue: "hors ligne", // Statut par défaut
  },
});
module.exports = User;
