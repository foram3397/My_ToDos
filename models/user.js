'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    age: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    models.User.belongsToMany(models.Project, { as: 'Tasks', through: 'worker_tasks', foreignKey: 'userId', otherKey: 'projectId' })
  };
  return User;
};