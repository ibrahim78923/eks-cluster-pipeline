// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
var moment = require("moment"); // require

module.exports = class {
    // Get All
    static getAll = async () =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });

    static getTodayRequestsByParent = async (id) =>
        await catchError(async () => {
            const dateObj = new Date();
            const weekday = dateObj.toLocaleString("default", { weekday: "long" });
            const students = await db.Parents.findByPk(id, {
                attributes: ["id"],
                order: [["createdAt", "DESC"]],
                include: { model: db.Students, attributes: ["id"] }
            });

            if (students && students.students && students.students.length > 0) {
                const studentIds = students.students.map((student) => student.id);
                console.log(studentIds);

                const dateFrom = new Date().setHours(0, 0, 0);
                const dateTo = new Date().setHours(23, 59, 59);

                const result = await db.Requests.findAll({
                    where: {
                        studentId: { [Op.in]: studentIds },
                        createdAt: { [Op.between]: [dateFrom, dateTo] },
                    },
                    order: [["createdAt", "DESC"]],
                });

                return { result };
            } else {
                throw new Error();
            }
        });

    static getTodayRequestsByClient = async (clientId) =>
        await catchError(async () => {
            const dateFrom = new Date().setHours(0, 0, 0);
            const dateTo = new Date().setHours(23, 59, 59);

            const result = await db.Requests.findAll({
                where: {
                    clientId,
                    requestTime: { [Op.between]: [dateFrom, dateTo] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
                raw: false,
            });

            if (result) return { result };
            else throw new Error();
        });
    // Get By getByGuardIdAndDates
    static getByGuardIdAndDates = async (id, dateFrom, dateTo) =>
        await catchError(async () => {

            const startDate = new Date(dateFrom);
            startDate.setHours(0, 0, 0);
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);

            const result = await db.Requests.findAll({
                where: {
                    guardId:id,
                    requestTime: { [Op.between]: [startDate, endDate] },
                },
                include: { model: db.Students },
                order: [["createdAt", "DESC"]],
            });

            if (result) return { result };
            throw new Error();
        });
    static getTodayRequestsByTeacher = async (teacherId) =>
        await catchError(async () => {
            const grades = await db.TeachersGrades.findAll({
                where: { teacherId: teacherId },
                order: [["createdAt", "DESC"]],
                attributes: ["gradeId"],
                raw: true,
            });

            if (!grades) return { result: [] };

            const gradeIds = grades.map((g) => g.gradeId);

            const dateTo = new Date();
            const dateFrom = new Date();

            dateFrom.setHours(dateFrom.getHours() - 12);

            const result = await db.Requests.findAll({
                where: {
                    gradeId: { [Op.in]: gradeIds },
                    requestTime: { [Op.between]: [dateFrom, dateTo] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
                raw: false,
            });

            if (result) return { result };
            else throw new Error();
        });

    static getTodayRequestByParentAndStudent = async (parentId, studentId) =>
        await catchError(async () => {
            const dateFrom = new Date().setHours(0, 0, 0);
            const dateTo = new Date().setHours(23, 59, 59);

            const result = await db.Requests.findAll({
                where: {
                    //parentId,
                    studentId,
                    requestTime: { [Op.between]: [dateFrom, dateTo] },
                },
                raw: true,
                order: [["createdAt", "DESC"]],
            });

            if (result) return { result };
            throw new Error();
        });

    static getAllWithGrades = async () =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
                order: [["createdAt", "DESC"]],
                include: db.Grades,
            });
            if (result) return { result };
            else throw new Error();
        });

    // Get By Id
    static getById = async (id) =>
        await catchError(async () => {
            const result = await db.Requests.findByPk(id, {
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });

    static getByColumn = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });

    static getByColumnWithGrades = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
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

            const result = await db.Requests.findAll({
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
            const result = await db.Requests.findAll({
                where: { gradeId, status: 0 },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });

    static getByStudentAndDates = async (studentId, dateFrom, dateTo) =>
        await catchError(async () => {
            const startDate = new Date(dateFrom);
            startDate.setHours(0, 0, 0);
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);

            const result = await db.Requests.findAll({
                where: {
                    studentId,
                    status: 2,
                    createdAt: { [Op.between]: [startDate, endDate] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });

    static getLatestByStudent = async (studentId) =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
                where: { studentId },
                raw:true,
                order: [["createdAt", "DESC"]],
            });

            if (result) return { result: result[0] };
            else throw new Error();
        });

    static getByColumnWithTeachers = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Requests.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                include: [{ model: db.Teachers, include: db.Grades }],
            });
            if (result) return { result };
            else throw new Error();
        });

    // Create
    static create = async (data) =>
        await catchError(async () => {
            const resultSync = await db.Requests.create(data,{raw:true});
            if (resultSync) {
                const result = await db.Requests.findByPk(resultSync.id, {
                    include: { model: db.Students,include: db.Grades },
                });
                return { result };
            }
            else throw new Error();
        });

    // Update
    static update = async (id, data) =>
        await catchError(async () => {
            const affectedRows = await db.Requests.update(data, { where: { id } });
            if (affectedRows == 1) {
                const result = await db.Requests.findByPk(id, {
                    include: { model: db.Students,include: db.Grades },
                });
                return { result: true, request: result };
            }
            else throw new Error();
        });


    // Delete
    static delete = async (id) =>
        await catchError(async () => {
            const affectedRows = await db.Requests.destroy({ where: { id } });
            if (affectedRows == 1) return { result: true };
            else throw new Error();
        });



    static getByStudentWithDates = async (studentId, schoolId, gradeId, dateFrom, dateTo) =>
        await catchError(async () => {
            const startDate = new Date(dateFrom);
            startDate.setHours(0, 0, 0);
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);

            const result = await db.Requests.findAll({
                where: {
                    status: [0, 1, 2],
                    studentId,
                    createdAt: { [Op.between]: [startDate, endDate] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students, where:{schoolId:schoolId, gradeId:gradeId} },
            });
            if (result) return { result };
            else throw new Error();
        });




    static getGradesWise = async (gradeId, schoolId, dateFrom, dateTo) =>
        await catchError(async () => {
            const startDate = new Date(dateFrom);
            startDate.setHours(0, 0, 0);
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);
            const result = await db.Requests.findAll({
                where: {
                    gradeId,
                    status: [0, 1, 2],
                    createdAt: { [Op.between]: [startDate, endDate] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students },
            });
            if (result) return { result };
            else throw new Error();
        });



    static getBySchool = async ( schoolId, dateFrom, dateTo) =>
        await catchError(async () => {
            const startDate = new Date(dateFrom);
            startDate.setHours(0, 0, 0);
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);
            const result = await db.Requests.findAll({
                where: {
                    status: [0, 1, 2],
                    createdAt: { [Op.between]: [startDate, endDate] },
                },
                order: [["createdAt", "DESC"]],
                include: { model: db.Students, where:{schoolId:schoolId} },
            });
            if (result) return { result };
            else throw new Error();
        });
};
