'use strict';
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    content: DataTypes.STRING,
    commenter_username: DataTypes.STRING,
    commenter_email: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  comments.associate = function (models) {
    // associations can be defined here
    models.comments.belongsTo(models.UserTodo, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    })
  };
  return comments;
};