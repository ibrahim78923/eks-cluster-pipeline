// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Campuses.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Campuses.findByPk(id, {
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Campuses.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["schoolId", "clientId"],
        },
        include: [
          { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result) return { result };
      else throw new Error();
    });
  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Campuses.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Campuses.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Campuses.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
