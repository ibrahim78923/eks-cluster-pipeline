const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("students", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    profileUrl: { type: DataTypes.TEXT },
    name: { type: DataTypes.TEXT },
    nameAr: { type: DataTypes.TEXT },
    gender: { type: DataTypes.TEXT },
    parentId: { type: DataTypes.BIGINT },
    teacherId: { type: DataTypes.BIGINT },
    clientId: { type: DataTypes.BIGINT },
    schoolId: { type: DataTypes.BIGINT },
    gradeId: { type: DataTypes.BIGINT },
  });
};
