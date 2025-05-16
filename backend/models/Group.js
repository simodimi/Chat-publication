const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Group = sequelize.define(
  "Group",
  {
    id_groupe: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_groupe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_groupe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id_utilisateur",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Association avec le créateur
Group.belongsTo(User, {
  foreignKey: "createur_id",
  as: "createur",
});

// Association many-to-many avec les membres
Group.belongsToMany(User, {
  through: "GroupMembers",
  foreignKey: "groupe_id",
  otherKey: "utilisateur_id",
  as: "membres",
});

User.belongsToMany(Group, {
  through: "GroupMembers",
  foreignKey: "utilisateur_id",
  otherKey: "groupe_id",
  as: "groupes",
});

module.exports = Group;
