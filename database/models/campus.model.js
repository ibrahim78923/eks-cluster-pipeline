const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("campuses", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      allowNull: false,
      type: DataTypes.BIGINT,

    },
    schoolId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    name: { type: DataTypes.TEXT },
  });
};
