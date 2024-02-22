const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("pushNotifications", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    deviceToken: { type: DataTypes.TEXT },
    deviceType: { type: DataTypes.TEXT },
    userId: { type: DataTypes.BIGINT },
  });
};
