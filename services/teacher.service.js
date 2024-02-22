// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");

class TeacherService {
    static getByGrade = async (args) =>

        await catchError(async () => {
            const result = await db.Teachers.findAll({
                where: { ...args },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["schoolId", "clientId"],
                },
                include: [
                    {
                        model: db.Grades,
                        include: [
                            { model: db.Schools},
                            { model: db.Students },
                        ],
                        plain:true
                    },
                ],
                plain:true
            });
            if (result){
                // let students = result.grades[0].students;
                let students = result.grades[0];
                return {students};
            }
        else throw new Error();
        });

  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Teachers.findAll({
          order: [["createdAt", "DESC"]],
          attributes: {
              exclude: ["schoolId", "clientId"],
          },
          include: [
              {
                  model: db.Grades,
                  include: [
                      { model: db.Schools},
                      { model: db.Students },
                  ],
              },
          ],
      });
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Teachers.findByPk(id, {
          order: [["createdAt", "DESC"]],
          include: [
              {
                  model: db.Grades,
                  include: [
                      { model: db.Schools},
                      { model: db.Students },
                  ],
              },
          ],
      });
      if (result) return { result };
      else throw new Error();
    });
  // Get By getByIdWeb
  static getByIdWeb = async (id) =>
    await catchError(async () => {
      const result = await db.Teachers.findByPk(id, {
          order: [["createdAt", "DESC"]],
          include: [
              {
                  model: db.Grades,
                  attributes: ["id","name"],
              },
          ],
      });
      if (result) return { result };
      else throw new Error();
    });
    static getByColumnForLogin = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Teachers.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
            });
            if (result.length === 0) throw new Error();
            if (result) return { result };
            else throw new Error();
        });
  static getByColumn = async (args) =>
    await catchError(async () => {
      const result = await db.Teachers.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: [ "schoolId"],
        },
        include: [
          {
            model: db.Grades,
              include: [
                  { model: db.Schools },
                  // { model: db.Students },
              ],
          },
        ],
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static getByclient = async (args) =>
    await catchError(async () => {
      const result = await db.Teachers.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: [ "schoolId", "clientId"],
        },
        include: [
          {
            model: db.Grades,
            attributes: ["id", ["name", "grade"]],
          },
            { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
static getByClientWeb = async (args) =>
    await catchError(async () => {
      const result = await db.Teachers.findAll({
        where: { ...args },
        order: [["createdAt", "DESC"]],
          attributes: ["id","userName","profileUrl","name","nameAr","email","password","lastLogin"],
        include: [
            { model: db.Schools, attributes: ["id", ["name", "school"]] },
        ],
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
// checkUser
    static checkUser = async (clientId, email) =>
        await catchError(async () => {
            const result = await db.Teachers.findOne({
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
  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Teachers.create(data);
        await TeacherService.update(result.id, { userName: result.id })
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Teachers.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
  // Update
  static updateStatus = async (id, data) =>
    await catchError(async () => {
      const [affectedRows] = await db.Teachers.update(data, { where: { clientId:id } });
      if (affectedRows > 0) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Teachers.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
module.exports = TeacherService
