// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
var moment = require("moment"); // require
const { sequelize } = require('../database');

module.exports = class {
    // Get All
    static getAll = async () =>
        await catchError(async () => {
            const result = await db.contacts.findAll({
                order: [["createdAt", "DESC"]],
            });
            if (result) return { result };
            else throw new Error();
        });
  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.contacts.findByPk(id, {
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.contacts.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
      });
      if (result) return { result };
      else throw new Error();
    });


  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.contacts.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.contacts.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.contacts.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
