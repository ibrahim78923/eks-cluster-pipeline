// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
var moment = require("moment"); // require
const { sequelize } = require('../database');

module.exports = class {
  // Get All
  static getAllByParents = async () =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        order: [["createdAt", "DESC"]],
          include: {model: db.Parents}
      });
      if (result) return { result };
      else throw new Error();
    });
    static getAllByTeachers = async () =>
        await catchError(async () => {
            const result = await db.Notifications.findAll({
                order: [["createdAt", "DESC"]],
                include: {model: db.Teachers}
            });
            if (result) return { result };
            else throw new Error();
        });

  static getTodayNotificationsByParent = async (parentId) =>
    await catchError(async () => {
      const dateFrom = new Date().setHours(0, 0, 0);
      const dateTo = new Date().setHours(23, 59, 59);

      const result = await db.Notifications.findAll({
        where: {
          parentId,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      if (result) return { result };
      else throw new Error();
    });

  static getTodayNotificationsByTeacher = async (teacherId) =>
    await catchError(async () => {
      const grades = await db.Grades.findAll({
        where: { teacherId },
        order: [["createdAt", "DESC"]],
        attributes: ["id"],
        raw: true,
      });

      if (!grades) return { result: [] };

      const gradeIds = grades.map((g) => g.id);

      const dateFrom = new Date().setHours(0, 0, 0);
      const dateTo = new Date().setHours(23, 59, 59);

      const result = await db.Notifications.findAll({
        where: {
          gradeId: { [Op.in]: gradeIds },
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
        raw: true,
      });

      if (result) return { result };
      else throw new Error();
    });

  static getTodayNotificationByParentAndStudent = async (parentId, studentId) =>
    await catchError(async () => {
      const dateFrom = new Date().setHours(0, 0, 0);
      const dateTo = new Date().setHours(23, 59, 59);

      const result = await db.Notifications.findAll({
        where: {
          parentId,
          studentId,
          createdAt: { [Op.between]: [dateFrom, dateTo] },
        },
        order: [["createdAt", "DESC"]],
      });

      if (result) return { result: result[0] };
      else throw new Error();
    });

  static getAllWithGrades = async () =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        order: [["createdAt", "DESC"]],
        include: db.Grades,
      });
      if (result) return { result };
      else throw new Error();
    });

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
      const result = await db.Notifications.findByPk(id, {
          include: [
              { model: db.Teachers },
              { model: db.Parents },
          ],
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        include: { model: db.Parents },
      });
      if (result) return { result };
      else throw new Error();
    });
    static getByColumnsgroupBy = async (columnNames, columnValues) =>
        await catchError(async () => {
            const result = await db.Notifications.findAll({
                where: { [columnNames]: columnValues },
                order: [["createdAt", "DESC"]],
                include: { model: db.Parents },
                group: ['imageUrl', 'message', 'title'],
            });
            if (result) return { result };
            else throw new Error();
        });

  static getByColumnWithGrades = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        include: { model: db.Grades, include: db.Teachers },
      });
      if (result) return { result };
      else throw new Error();
    });

  static getByParentAndDates = async (parentId, dateFrom, dateTo) =>
    await catchError(async () => {
      const startDate = new Date(dateFrom);
      startDate.setHours(0, 0, 0);
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59);

      const result = await db.Notifications.findAll({
        where: {
          parentId,
          status: 2,
          createdAt: { [Op.between]: [startDate, endDate] },
        },
        order: [["createdAt", "DESC"]],
        include: { model: db.Students },
      });
      if (result) return { result };
      else throw new Error();
    });

  static getAllByGrades = async (gradeId) =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        where: { gradeId, status: 0 },
        order: [["createdAt", "DESC"]],
        include: { model: db.Students },
      });
      if (result) return { result };
      else throw new Error();
    });



  static getByColumnWithTeachers = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        include: [{ model: db.Teachers }],
      });
      if (result) return { result };
      else throw new Error();
    });
  static getByColumnWithParents = async (columnName, columnValue) =>
    await catchError(async () => {
      const result = await db.Notifications.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
        include: [{ model: db.Parents }],
      });
      if (result) return { result };
      else throw new Error();
    });

  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.Notifications.create(data);
      return { result };
    });

  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.Notifications.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Notifications.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
