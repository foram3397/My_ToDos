'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTodo = sequelize.define('UserTodo', {
    taskName: DataTypes.STRING,
    taskContent: DataTypes.STRING
  }, {});
  UserTodo.associate = function (models) {
    // associations can be defined here
    models.UserTodo.hasMany(models.comments);
    models.UserTodo.belongsTo(models.UserData, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return UserTodo;
};