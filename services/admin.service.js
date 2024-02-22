// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Admins.findAll({
        order: [["createdAt", "DESC"]],
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Admins.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
      });
      if (result.length === 0) throw new Error("Email not found")
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Admins.findByPk(id);
      if (result) return { result };
      else throw new Error();
    });

  static findByEmail = async (email = "") =>
    await catchError(async () => {
      const result = await db.Admins.findOne({ where: { email } });
      if (result) return { result };
      else throw new Error();
    });

  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Admins.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Admins.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Admins.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
