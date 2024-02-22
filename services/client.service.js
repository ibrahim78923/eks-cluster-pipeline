// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

module.exports = class {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Clients.findAll({
        order: [["createdAt", "DESC"]],
          include: [
              { model: db.plans },
          ]
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Clients.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          include: [
              { model: db.plans },
          ]
      });
      if (result.length === 0) throw new Error("Email not found")
      if (result) return { result };
      else throw new Error();
    });

  static getByEmail = async (email) =>
    await catchError(async () => {
        const result = await db.Clients.findOne({
            where: {
                email: email,
            },
            order: [["createdAt", "DESC"]]
        });
        if (result) return { result };
        else throw new Error();
    });

  static getByEmailAndOtp = async (email,otp) =>
    await catchError(async () => {
        const result = await db.Clients.findOne({
            where: {
                email: email,
                otp: otp,
            },
            order: [["createdAt", "DESC"]]
        });
        if (result) return { result };
        else throw new Error();
    });
    static getByColumnForClient = async (args) =>
        await catchError(async () => {
            const result = await db.Clients.findAll({
                where: { ...args },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: [ "schoolId", "clientId"],
                },
            });
            if (result.length === 0) throw new Error();
            if (result) return { result };
            else throw new Error();
        });
  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
        const result = await db.Clients.findByPk(id, {
            include: [
                { model: db.plans },
            ],
        });
      if (result) return { result };
      else throw new Error();
    });

  static findByEmail = async (email = "") =>
    await catchError(async () => {
      const result = await db.Clients.findOne({ where: { email } });
      if (result) return { result };
      else throw new Error();
    });

  // Create
  static create = async (data) =>
    await catchError(async () => {
      const client = await db.Clients.create(data);
      if(client){
          const result = await db.Clients.findByPk(client.id)
          return { result };
      }else throw new Error();

    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Clients.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Clients.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
