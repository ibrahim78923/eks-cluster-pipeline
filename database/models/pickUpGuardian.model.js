const {DataTypes} = require("sequelize");

module.exports = (db) => {
    return db.define(
        "pickUpGuardians",
        {
            id: {
                type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true
            },
            userName: {
                type: DataTypes.TEXT
            },
            clientId: {
                type: DataTypes.BIGINT
            },
            name: {
                type: DataTypes.TEXT
            },
            phoneNo: {
                type: DataTypes.TEXT
            },
            password: {
                type: DataTypes.TEXT
            },
            deviceToken: {
                type: DataTypes.TEXT
            },
            deviceType: {
                type: DataTypes.TEXT
            },
            credentialSentAt: {
                type: DataTypes.TEXT
            },
            status: {
                type: DataTypes.BOOLEAN
            }

        }
    );
};
