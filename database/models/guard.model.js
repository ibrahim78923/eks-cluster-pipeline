const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define(
    "guards",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
        clientId: { type: DataTypes.BIGINT },
      name: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.TEXT,
      },
      phoneNo: {
        type: DataTypes.TEXT,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      lang: {type: DataTypes.TEXT,},
      nationalId: {type: DataTypes.TEXT,},
      deviceToken: { type: DataTypes.TEXT },
      deviceType: { type: DataTypes.TEXT },
      credentialSentAt: {type: DataTypes.TEXT},
      forgetAt: {type: DataTypes.TEXT},
      forget: { type: DataTypes.BOOLEAN,defaultValue: true,},
      status: { type: DataTypes.BOOLEAN,defaultValue: true,},
      lastLogin: { type: DataTypes.TEXT },
    },
    {
      initialAutoIncrement: 1000000,
    }
  );
};
