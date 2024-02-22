// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.GradesTime.findAll({ order: [["createdAt", "DESC"]] });
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.GradesTime.findByPk(id);
      if (result) return { result };
      else throw new Error();
    });

    static getByColumn = async (args) =>
        await catchError(async () => {
            const result = await db.GradesTime.findAll({
                where: { ...args },
                order: [["createdAt", "DESC"]],
            });
            if (result) return { result };
            else throw new Error();
    });
  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.GradesTime.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.GradesTime.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.GradesTime.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
