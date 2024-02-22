// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Schools.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["clientId"],
        },
      });
      if (result) return { result };
      else throw new Error();
    });

    static getAllWithGrades = async () =>
        await catchError(async () => {
            const result = await db.Schools.findAll({
                order: [["createdAt", "DESC"]],
                include: db.Grades
            });
            if (result) return { result };
            else throw new Error();
        });


  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Schools.findByPk(id, {
        attributes: {
          exclude: ["clientId"],
        },
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Schools.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["clientId"],
        },
      });
      if (result) return { result };
      else throw new Error();
    });

    static getByColumnWithGrades = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Schools.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                include: {model: db.Grades, include: db.Teachers}
            });
            if (result) return { result };
            else throw new Error();
        });
    static webByClient = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Schools.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["clientId","createdAt","updatedAt"],
                },
            });
            if (result) return { result };
            else throw new Error();
        });
    static getByColumnWithTeachers = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Schools.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                include: [
                    { model: db.Teachers, include: db.Grades },
                ],
            });
            if (result) return { result };
            else throw new Error();
        });

  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Schools.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Schools.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Schools.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
