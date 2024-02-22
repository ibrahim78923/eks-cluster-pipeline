const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("schools", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    profileUrl: { type: DataTypes.TEXT },
    name: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    lat: { type: DataTypes.FLOAT },
    long: { type: DataTypes.FLOAT },
    radius: { type: DataTypes.FLOAT },
  });
};
