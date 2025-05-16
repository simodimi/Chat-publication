const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Publication = sequelize.define(
  "Publication",
  {
    id_publication: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_utilisateur",
      },
    },
    texte: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    audio: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    date_publication: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

// Définir la relation avec User
Publication.belongsTo(User, {
  foreignKey: "id_utilisateur",
  as: "user",
});
User.hasMany(Publication, {
  foreignKey: "id_utilisateur",
  as: "publications",
});

module.exports = Publication;
