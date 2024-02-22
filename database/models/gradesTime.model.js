const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("gradesTime", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    gradeId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    day: { type: DataTypes.TEXT },
    offTime: { type: DataTypes.TEXT },
    startTime: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN,
      defaultValue: true,},
  });
};
