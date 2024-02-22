const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("plans", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cmId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    title: { type: DataTypes.TEXT },
    point1: { type: DataTypes.TEXT },
    point2: { type: DataTypes.TEXT },
    point3: { type: DataTypes.TEXT },
    point4: { type: DataTypes.TEXT },
    point5: { type: DataTypes.TEXT },
    point6: { type: DataTypes.TEXT },
    point7: { type: DataTypes.TEXT },
    point8: { type: DataTypes.TEXT },
    durationType: { type: DataTypes.TEXT },
    price: { type: DataTypes.TEXT },
    priceId: { type: DataTypes.TEXT },
    percentage: { type: DataTypes.TEXT },
    noOfStudent : { type: DataTypes.TEXT },
    noOfSchool : { type: DataTypes.TEXT },
    lang: { allowNull: false,type: DataTypes.TEXT },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  });
};
