const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("admins", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    password: { type: DataTypes.TEXT },
  });
};
