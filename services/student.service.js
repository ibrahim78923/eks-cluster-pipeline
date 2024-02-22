// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
const defaultOptions = {};

module.exports = class {
    // Get All
    static getAll = async () =>
        await catchError(async () => {
            const result = await db.Students.findAll({
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: [
                        "parentId",
                        "teacherId",
                        "gradeId",
                        "campusId",
                        "schoolId",
                        "clientId",
                    ],
                },
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id", ["name", "grade"]],
                        include: [
                            { model: db.Schools, attributes: ["id", ["name", "school"]] },
                        ],
                    },
                    { model: db.Teachers, attributes: ["id", ["name", "teacher"]] },
                    {
                        model: db.Parents,
                        attributes: [
                            "id",
                            ["email", "parentEmail"],
                            ["phoneNo", "parentPhoneNo"],
                        ],
                    },
                ],
            });
            if (result) return { result };
            else throw new Error();
        });
// Get By Id
    static getId = async (id) =>
        await catchError(async () => {
            const result = await db.Students.findByPk(id, {
                attributes: ["id"],
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id"],
                        include: [{ model: db.TeachersGrades, attributes: ["teacherId"] }]
                    },
                ],
                plain:true
            });
            if (result) {
                const grade = result.grade;
                const teachers = grade.teachersGrades;
                return { result: teachers };
            }
              // if (result) return { result };
            else throw new Error();
        });

    static getByColumn = async (columnName, columnValue) =>
        await catchError(async () => {
            const result = await db.Students.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["parentId", "teacherId", "gradeId", "schoolId", "clientId"],
                },
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id", ["name", "grade"]],
                        include: [
                            { model: db.Schools, attributes: ["id", ["name", "school"],"profileUrl","name"], },
                        ],
                    },
                    {
                        model: db.Parents,attributes: ["email", "phoneNo", "credentialSentAt","id", "password","lastLogin" ]
                    },
                ],
            });
            // if (result.length === 0) throw new Error("Email not found");
            if (result) return { result };
            else throw new Error();
        });
    static getByClient = async (columnName, columnValue) =>
        await catchError(async () => {
            const dateFrom = new Date().setHours(0, 0, 0);
            const dateTo = new Date().setHours(23, 59, 59);
            const result = await db.Students.findAll({
                where: { [columnName]: columnValue },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["parentId", "teacherId", "gradeId", "schoolId", "clientId"],
                },
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id", ["name", "grade"]],
                        include: [
                            { model: db.Schools, attributes: ["id", ["name", "school"],"profileUrl","name"], },
                        ],
                    },
                    {
                        model: db.Parents,attributes: ["email", "phoneNo", "credentialSentAt","id", "password","lastLogin" ]
                    },
                    {
                        model: db.Requests,attributes: ["id", "StudentId", "status" ],where: {
                            createdAt: { [Op.between]: [dateFrom, dateTo] },
                        },
                        required: false, // Add this line to make the association optional
                    },
                ],
            });
            // if (result.length === 0) throw new Error("Email not found");
            if (result) return { result };
            else throw new Error();
        });

    static getIdsByParent = async (parentId) =>
        await catchError(async () => {
            const result = await db.PickUpGuardianStudents.findAll({ where: { parentId } });
            if (result) return { result };
            throw new Error();
        });

    // Get By Id
    static getById = async (id) =>
        await catchError(async () => {
            const result = await db.Students.findByPk(id, {
                attributes: {
                    exclude: ["parentId", "teacherId", "gradeId", "schoolId", "clientId"],
                },
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id", ["name", "grade"]],
                        include: [
                            { model: db.Schools, attributes: ["id", ["name", "school"]] },
                        ],
                    },
                    { model: db.Teachers, attributes: ["id", ["name", "teacher"]] },
                    {
                        model: db.PickUpGuardianStudents,attributes: ["parentId"],
                        include: [
                            { model: db.Parents },
                        ],
                    },
                    { model: db.Parents },
                ],
            });
            if (result) return { result };
            else throw new Error();
        });

    // Get By teacher  Id
    static getTeacherId = async (id) =>
        await catchError(async () => {
            const result = await db.Students.findByPk(id, {
                attributes: ["id"],
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id"],
                        include: [{ model: db.Teachers, attributes: ["id"] }],
                    },

                ],
                plain:true
            });
            if (result) {
                const grade = result.grade;
                const teacher = result.teacher;
                return { result: teacher };
            }
            if (result) return { result };
            else throw new Error();
        });
    // Get By client  Id
    static getClientId = async (id) =>
        await catchError(async () => {
            const result = await db.Students.findByPk(id, {
                attributes: ["id"],
                include: [
                    {
                        model: db.Grades,
                        attributes: ["id"],
                        include: [{ model: db.Teachers, attributes: ["id"] }],
                    },
                ],
            });
            if (result) {
                const client = result.clientId;

                return { result: client };
            }
            //   if (result) return { result };
            else throw new Error();
        });

    // Create
    static create = async (data) =>
        await catchError(async () => {
            const result = await db.Students.create(data);
            return { result };
        });

    // Update
    static update = async (id, data) =>
        await catchError(async () => {
            const affectedRows = await db.Students.update(data, { where: { id } });
            if (affectedRows == 1) return { result: true };
            else throw new Error();
        });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Students.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
  static deleteGuardianStudent = async (parentId) =>
    await catchError(async () => {
      const affectedRows = await db.Students.destroy({ where: { parentId } });
        console.log(affectedRows)
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
    static getByIdComplete = async (id) =>
        await catchError(async () => {
            const result = await db.Students.findByPk(id, {
                attributes: {
                    exclude: ["parentId", "teacherId", "gradeId", "schoolId", "clientId"],
                },
                include: [
                    {
                        model: db.Parents,
                    },
                    {
                        model: db.Grades,
                        attributes: ["id", ["name", "grade"]],
                        include: [
                            { model: db.Schools, attributes: ["id", "name","profileUrl"] },
                        ],
                    },
                ],
            });
            if (result) return { result };
            else throw new Error();
        });

    static promoteStudent = async (gradeId,schoolId) =>
        await catchError(async () => {
            const result = await db.Students.findAll({
                where: {
                    gradeId,
                    schoolId
                },
                order: [["createdAt", "DESC"]],
            });

            if (result) return { result };
            else throw new Error();
        });
    // count student
    static countStudentByClient = async (clientId) =>
        await catchError(async () => {
            const count = await db.Students.count({
                where: {
                    clientId
                }
            });
            return { count };
        });
};
