'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  Project.associate = function (models) {
    // associations can be defined here
    models.Project.belongsToMany(models.User, { as: 'Workers', through: 'worker_tasks', foreignKey: 'projectId', otherKey: 'userId' })
  };
  return Project;
};