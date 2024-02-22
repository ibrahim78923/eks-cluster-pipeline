const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("contacts", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.TEXT },
    schoolName: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    phone: { type: DataTypes.TEXT},
    message: { type: DataTypes.TEXT },
    comment: { type: DataTypes.TEXT },
  });
};
