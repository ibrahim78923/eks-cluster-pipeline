// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Grades.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.GradesTime },
            { model: db.Teachers },
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
            { model: db.Students },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });
  // Get All Now
  static getAllNow = async () =>
    await catchError(async () => {
        const date = new Date();
        const twoDigitMinutes = date.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit',hour12: false});
      const result = await db.Grades.findAll({
          where: { offTime: { [Op.eq]: twoDigitMinutes } },
          order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.Teachers },
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
            { model: db.Students },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Grades.findByPk(id, {
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.GradesTime },
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
            { model: db.Students },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });
// Get By Id
  static getByIdWeb = async (id) =>
    await catchError(async () => {
      const result = await db.Grades.findByPk(id, {
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.GradesTime },
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (args) =>
    await catchError(async () => {
      if (!args) throw new Error();

      const result = await db.Grades.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.GradesTime },
          { model: db.Teachers },
          { model: db.Schools },
          { model: db.Students },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });
  static getStudentByTeachersGrades = async (args) =>
    await catchError(async () => {
      if (!args) throw new Error();

      const result = await db.Grades.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
          include: {model: db.Students, include: {model: db.Grades, include: db.Schools}},
          plain:true,
      });
      if (result) return { result };
      else throw new Error();
    });
  static getByClient = async (args) =>
    await catchError(async () => {
      if (!args) throw new Error();

      const result = await db.Grades.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
            { model: db.GradesTime },
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
          { model: db.Teachers,attributes: ["id", ["name", "teacher"]] },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });
  static getByClientWeb = async (args) =>
    await catchError(async () => {
      if (!args) throw new Error();

      const result = await db.Grades.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
          attributes: ["id", "name"],
          include: [
              { model: db.Schools, attributes: [ ["name", "school"]] },
          ],
      });
      if (result) return { result };
      else throw new Error();
    });
  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Grades.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Grades.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Grades.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
