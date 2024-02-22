// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");

module.exports = class {

  // dashboard Api

  static dashboard = async (
    columnName,
    columnValue,
    startDate,
    endDate,
    args
  ) =>
    await catchError(async () => {
        const dateFrom = new Date(startDate);
        dateFrom.setUTCHours(0, 0, 0);
        const dateTo = new Date(endDate);
        dateTo.setUTCHours(23, 59, 59);
      //total-Schools
      const result = await db.Schools.count({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["clientId", "createdAt", "updatedAt"],
        },
      });
        console.log('dateFrom',dateFrom)
        console.log('dateTo',dateTo)
      //total Grades
      const result1 = await db.Grades.count({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: ["id", "name"],
      });

      // total-Teachers
      const result2 = await db.Teachers.count({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "userName",
          "profileUrl",
          "name",
          "nameAr",
          "email",
          "password",
        ],
      });

      // total-Students
      const result3 = await db.Students.count({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["parentId", "teacherId", "gradeId", "schoolId", "clientId"],
        },
      });

      // total parents count
      const result4 = await db.Parents.count({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["clientId", "createdAt", "updatedAt"],
        },
      });

      //total android devices
      const result5 = await db.Parents.count({
        where: { [columnName]: columnValue,deviceType: "android" },
        order: [["createdAt", "DESC"]],
      });

      //total iphone devices
      const result6 = await db.Parents.count({

        where: { [columnName]: columnValue, deviceType: "iphone" },
        order: [["createdAt", "DESC"]],
      });

      //total null devices
      const result7 = await db.Parents.count({
        where: { [columnName]: columnValue, deviceType: null },
        order: [["createdAt", "DESC"]],
      });

      // total Requests


      const result8 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });


      //total sentRequests
      const result9 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 0,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      // // total approveRequests
      const result10 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 1,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      // total confirmRequests
      const result11 = await db.Requests.count({
        where: {
          [columnName]: columnValue,
          status: 2,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      // request perDay

      const result12 = await db.Requests.findAll({
        where: {
          [columnName]: columnValue,
            createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
      });

      function getDayName(date) {
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        return days[date.getDay()];
      }

      // Filter and count the objects created on each day
      let per_day = result12.reduce(function (acc, obj) {
        var day = getDayName(new Date(obj.requestTime));

        // Check if the day exists in the accumulator object, otherwise initialize it with 0
        if (!acc[day]) {
          acc[day] = 0;
        }

        // Increment the count for the respective day
        acc[day]++;

        return acc;
      }, {});

      if (result)
        return {
          result,
          result1,
          result2,
          result3,
          result4,
          result5,
          result6,
          result7,
          result8,
          result9,
          result10,
          result11,
          per_day,
        };
      else throw new Error();
    });
};
