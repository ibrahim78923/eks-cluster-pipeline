// Package Imports

// Local Imports
const { db } = require("../database");
const { Op } = require("sequelize");
const { catchError } = require("../utils");
const { hash } = require("../utils/bcrypt");
const { sendEmail } = require("../utils/sendEmail");

class GuardService {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Guards.findAll( {
          order: [["createdAt", "DESC"]],
      });
      if (result) return { result };
      else throw new Error();
    });


  // Get By getByGuardIdAndDates
    static getByGuardIdAndDates = async (id, dateFrom, dateTo) =>
        await catchError(async () => {
            const whereClause = {};

            if (dateFrom && dateTo) {
                const startDate = new Date(dateFrom);
                startDate.setHours(0, 0, 0);
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59);

                whereClause.createdAt = {
                    [Op.between]: [startDate, endDate],
                };
            } else {
                // If dateFrom and dateTo are not provided, use today's date
                const today = new Date();
                today.setHours(0, 0, 0);

                whereClause.createdAt = {
                    [Op.between]: [today, new Date()],
                };
            }

            const result = await db.Guards.findByPk(id, {
                order: [["createdAt", "DESC"]],
                include: {
                    model: db.Requests,
                    where: whereClause,
                    include: [
                        {
                            model: db.Students,
                        },
                    ],
                    required: false,
                },
            });

            if (result) return { result };
            else throw new Error();
        });


    static getById = async (id) =>
    await catchError(async () => {
        const dateFrom = new Date().setHours(0, 0, 0);
        const dateTo = new Date().setHours(23, 59, 59);
      const result = await db.Guards.findByPk(id, {
          order: [["createdAt", "DESC"]],
          include: {
              model: db.Requests,
              where: {
                  createdAt: { [Op.between]: [dateFrom, dateTo] }
              },
              include: [
                  {
                      model: db.Students,
                  },
              ],
              required: false,
          }
      });
      if (result) return { result };
      else throw new Error();
    });


  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Guards.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static getByNationalId = async (nationalId,clientId) =>
    await catchError(async () => {
      const result = await db.Guards.findAll({
        where: { nationalId,clientId },
        order: [["createdAt", "DESC"]],
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static checkEmail = async (clientId,email) =>
    await catchError(async () => {
      const result = await db.Guards.findAll({
        where: {
            clientId,
            email
        },
        order: [["createdAt", "DESC"]],

      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static checkEmail = async (clientId,email) =>
    await catchError(async () => {
      const result = await db.Guards.findAll({
        where: {
            clientId,
            email
        },
        order: [["createdAt", "DESC"]],

      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  //checkUser
    static checkUser = async (clientId, email) =>
        await catchError(async () => {
            const result = await db.Guards.findOne({
                where: {
                    clientId,
                    email
                }
            });
            if (!result) {
                throw new Error();
            } else {
                return { result };
            }
        });
  static getByColumnForLogin = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Guards.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
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
      const result = await db.Guards.create({ password, ...data });
        if(result){
            try {
                await sendEmail(result.email, 'ezpick credentials',result.name,result.id,result.password);
            }
            catch (error){
                console.error('Error while sending email:', error);
                // You can choose to return a specific error message or status code, or perform any other necessary actions here.
            }
            return { result }
        }else
        {
            throw error
        }
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
        const [affectedRows] = await db.Guards.update(data, { where: { id } });
        if (affectedRows) {
            const updatedParent = await db.Guards.findByPk(id);
            return { result: true, data: updatedParent };
        } else {
            throw new Error();
        }
    });
  static updateStatus = async (id, data) =>
    await catchError(async () => {
        const [affectedRows] = await db.Guards.update(data, { where: { clientId: id } });
        if (affectedRows > 0) return { result: true };
        else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Guards.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

};

module.exports = GuardService