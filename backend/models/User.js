const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_utilisateur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_utilisateur: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_utilisateur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_profil: {
      type: DataTypes.STRING,
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
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_utilisateur) {
          const salt = await bcrypt.genSalt(10);
          user.password_utilisateur = await bcrypt.hash(
            user.password_utilisateur,
            salt
          );
        }
      },
    },
  }
);

// Méthode pour vérifier le mot de passe
User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password_utilisateur);
};

module.exports = User;
