const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Status = sequelize.define(
  "Status",
  {
    id_status: {
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["image", "video", "audio", "texte"]],
      },
    },
    content: {
      type: DataTypes.TEXT("LONG"),
      allowNull: true,
    },
    texte: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    styles: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    date_expiration: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        // Les statuts expirent après 24 heures
        const date = new Date();
        date.setHours(date.getHours() + 24);
        return date;
      },
    },
  },
  {
    timestamps: true,
    tableName: "status",
  }
);

// Définir la relation avec le modèle User
Status.belongsTo(User, {
  foreignKey: "id_utilisateur",
  as: "user",
});

User.hasMany(Status, {
  foreignKey: "id_utilisateur",
  as: "statuses",
});

module.exports = Status;
