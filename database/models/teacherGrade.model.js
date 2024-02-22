const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("teachersGrade", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    teacherId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    gradeId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
  });
};
