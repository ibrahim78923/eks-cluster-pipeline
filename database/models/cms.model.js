const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("cms", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    heroTitleBold: { type: DataTypes.TEXT },
    heroText1: { type: DataTypes.TEXT },
    heroText2: { type: DataTypes.TEXT },
    heroButtonText: { type: DataTypes.TEXT },
    heroVideoUrl: { type: DataTypes.TEXT },
    securityAuthorizedSmallText: { type: DataTypes.TEXT },
    securityAuthorizedBoldText: { type: DataTypes.TEXT },
    securityAuthorizedDescription: { type: DataTypes.TEXT },
    securityAuthorizedPoint1: { type: DataTypes.TEXT },
    securityAuthorizedPoint2: { type: DataTypes.TEXT },
    securityAuthorizedPoint3: { type: DataTypes.TEXT },
    securityAuthorizedPoint4: { type: DataTypes.TEXT },
    securityAuthorizedPoint5: { type: DataTypes.TEXT },
    securityAuthorizedPoint6: { type: DataTypes.TEXT },
    securityAuthorizedPoint7: { type: DataTypes.TEXT },
    securityAuthorizedImageUrl: { type: DataTypes.TEXT },
    RealTimeUpdatesSmallText: { type: DataTypes.TEXT },
    RealTimeUpdatesBoldText: { type: DataTypes.TEXT },
    RealTimeUpdatesDescription: { type: DataTypes.TEXT },
    RealTimeUpdatesTextLineOne: { type: DataTypes.TEXT },
    RealTimeUpdatesTextLineTwo: { type: DataTypes.TEXT },
    RealTimeUpdatesImageUrl: { type: DataTypes.TEXT },
    mobileAppHeading: { type: DataTypes.TEXT },
    mobileAppDetail: { type: DataTypes.TEXT },
    mobileAppImageUrl: { type: DataTypes.TEXT },
    lang: { allowNull: false,type: DataTypes.TEXT },
  });
};
