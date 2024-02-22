const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("notifications", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: { type: DataTypes.BIGINT },
    title: { type: DataTypes.TEXT },
    message: { type: DataTypes.TEXT },
    parentId: { type: DataTypes.BIGINT },
    teacherId: { type: DataTypes.BIGINT },
    actionId: { type: DataTypes.BIGINT },
    actionCategory: { type: DataTypes.TEXT},
    imageUrl: { type: DataTypes.TEXT },
    dateTime: { type: DataTypes.DATE},
  });
};
