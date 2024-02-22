const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define("requests", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: { type: DataTypes.BIGINT },
    studentId: { type: DataTypes.BIGINT },
    parentId: { type: DataTypes.BIGINT },
    gradeId: { type: DataTypes.BIGINT },
    guardId: { type: DataTypes.BIGINT },
    pickUpGuardian : { type: DataTypes.TEXT },
    status: { type: DataTypes.INTEGER,
      defaultValue: 0,
      comment:"sent = 0   " +
        "approve = 1 " +
        "confirm = 2 "
    },
    requestTime: { type: DataTypes.DATE},
    approveTime: { type: DataTypes.DATE },
    confirmTime: { type: DataTypes.DATE },
  });
};
