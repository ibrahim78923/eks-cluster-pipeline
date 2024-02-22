// Package Imports

// Local Imports
const { db } = require("../database");
const { Op } = require("sequelize");
const { catchError } = require("../utils");
const { hash } = require("../utils/bcrypt");

class GuardianService {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.pickUpGuardians.findAll( {
          order: [["createdAt", "DESC"]],
          // include: {model: db.Students, include: {model: db.Grades, include: db.Schools}}
      });
      if (result) return { result };
      else throw new Error();
    });
    static getAllByTime = async (dayName, startTime, endTime) => {
        try {
            const query = `
                            SELECT *
                            FROM parents AS p
                            JOIN students AS s ON p.id = s.parentId
                            JOIN grades AS g ON s.gradeId = g.id
                            JOIN gradesTimes AS gt ON g.id = gt.gradeId
                            JOIN schools AS sc ON g.schoolId = sc.id
                            WHERE p.deviceToken IS NOT NULL
                              AND gt.day = :dayName
                              AND gt.offTime BETWEEN :startTime AND :endTime
                            ORDER BY p.createdAt DESC;
                        `;

            const result = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { dayName, startTime, endTime },
            });

            return { result };
        } catch (error) {
            throw error;
        }
    };

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.pickUpGuardians.findByPk(id, {
          order: [["createdAt", "DESC"]],
          // include: {model: db.Students,
          //     include: [
          //         {
          //             model: db.Grades,
          //             include: [
          //                 {
          //                     model: db.GradesTime , where: { day: weekday },
          //
          //                 },
          //                 { model: db.Schools }
          //             ],
          //         },
          //     ],
          // }
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.pickUpGuardians.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          // include: {model: db.Students,
          //     include: [
          //         {
          //             model: db.Grades,
          //             include: [
          //                 {
          //                     model: db.GradesTime , where: { day: weekday },
          //
          //                 },
          //                 { model: db.Schools }
          //             ],
          //         },
          //     ],
          // }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static checkEmail = async (clientId,email) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.pickUpGuardians.findAll({
        where: {
            clientId,
            email
        },
        order: [["createdAt", "DESC"]],
          // include: {model: db.Students,
          //     include: [
          //         {
          //             model: db.Grades,
          //             include: [
          //                 {
          //                     model: db.GradesTime , where: { day: weekday },
          //
          //                 },
          //                 { model: db.Schools }
          //             ],
          //         },
          //     ],
          // }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static getByColumnForLogin = async (columnName, columnValue) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.pickUpGuardians.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          // include: {model: db.Students,
          //     include: [
          //         {
          //             model: db.Grades,
          //             include: [
          //                 {
          //                     model: db.GradesTime , where: { day: weekday },
          //
          //                 },
          //                 { model: db.Schools }
          //             ],
          //         },
          //     ],
          // }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  // Create
  static create = async (data) =>
    await catchError(async () => {
        var length = 7,
            charset = "0123456789",
            password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
      // const password = await hash(defaultPassword);
      const result = await db.pickUpGuardians.create({ password, ...data });
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.pickUpGuardians.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.pickUpGuardians.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};

module.exports = GuardianService