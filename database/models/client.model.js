const { DataTypes } = require("sequelize");

module.exports = (db) => {
  return db.define(
    "clients",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.TEXT },
      email: { type: DataTypes.TEXT },
      password: { type: DataTypes.TEXT },
      status: { type: DataTypes.BOOLEAN, defaultValue: true },
      schoolName: { type: DataTypes.TEXT },
      mobile: { type: DataTypes.TEXT },
      landline: { type: DataTypes.TEXT },
      perUserPrice: { type: DataTypes.TEXT },
      startDate: { type: DataTypes.TEXT },
      duration: { type: DataTypes.TEXT },
      expiryDate: { type: DataTypes.TEXT },
      country: { type: DataTypes.TEXT },
      city: { type: DataTypes.TEXT },
      selectedGrades: { type: DataTypes.TEXT },
      planId: {allowNull: false,type: DataTypes.BIGINT},
      address: { type: DataTypes.TEXT },
      zipCode: { type: DataTypes.TEXT },
      otp: { type: DataTypes.TEXT },
      customerId: { type: DataTypes.TEXT },
      subscriptionId: { type: DataTypes.TEXT },
      totalPrice: { type: DataTypes.TEXT },
      noOfStudent : { type: DataTypes.TEXT },
      noOfSchool : { type: DataTypes.TEXT },
      cancelSubscription : { type: DataTypes.BOOLEAN, defaultValue: true },
      deactivate : { type: DataTypes.BOOLEAN, defaultValue: true },
      cancelSubscriptionDate : { type: DataTypes.TEXT },
      cancelSubscriptionReason : { type: DataTypes.TEXT },
      forgetAt: {type: DataTypes.TEXT},
      forget: { type: DataTypes.BOOLEAN,defaultValue: true,},
    },
    {
      initialAutoIncrement: 1000000,
    }
  );
};

