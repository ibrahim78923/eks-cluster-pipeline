const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("pickUpGuardianStudent", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    parentId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    studentId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
  });
};
