const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("teachers", {
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
    profileUrl: { type: DataTypes.TEXT },
    name: { type: DataTypes.TEXT },
    nameAr: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    userName: { type: DataTypes.TEXT },
    password: { type: DataTypes.TEXT },
    gender: { type: DataTypes.TEXT },
    deviceToken: { type: DataTypes.TEXT },
    deviceType: { type: DataTypes.TEXT },
    status: { type: DataTypes.BOOLEAN,defaultValue: true,},
    forgetAt: {type: DataTypes.TEXT},
    forget: { type: DataTypes.BOOLEAN,defaultValue: true,},
    lastLogin: { type: DataTypes.TEXT },
    selectedGrades: { type: DataTypes.TEXT },
    },
  {
    initialAutoIncrement: 1000000,
  });
};
