const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("cmsFeature", {
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
    description: { type: DataTypes.TEXT },
    imageUrl: { type: DataTypes.TEXT },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    lang: { allowNull: false,type: DataTypes.TEXT },
  });
};
