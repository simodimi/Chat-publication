const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

class Friendship extends Model {}

Friendship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id_utilisateur",
      },
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id_utilisateur",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Friendship",
    tableName: "friendships",
    indexes: [
      {
        unique: true,
        fields: ["userId", "friendId"],
      },
    ],
  }
);

// Définir les associations
Friendship.belongsTo(User, { as: "user", foreignKey: "userId" });
Friendship.belongsTo(User, { as: "friend", foreignKey: "friendId" });

module.exports = Friendship;
