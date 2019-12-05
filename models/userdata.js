'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserData = sequelize.define('UserData', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNo: DataTypes.STRING
  }, {});
  UserData.associate = function (models) {
    // associations can be defined here
    models.UserData.hasMany(models.UserTodo)
  };
  return UserData;
};