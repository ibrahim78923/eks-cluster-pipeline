const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("grades", {
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
    teacherId: {
      allowNull: true,
      type: DataTypes.BIGINT,

    },
    name: { type: DataTypes.TEXT },
    offTime: { type: DataTypes.TEXT },
    startTime: { type: DataTypes.TEXT },
  });
};
