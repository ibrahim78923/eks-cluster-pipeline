// Package Imports

// Local Imports
const { db } = require("../database");
const { Op } = require("sequelize");
const { catchError } = require("../utils");
const { hash } = require("../utils/bcrypt");
const { sendEmail } = require("../utils/sendEmail");

class ParentService {
  // Get All
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.Parents.findAll( {
          order: [["createdAt", "DESC"]],
          include: {model: db.Students, include: {model: db.Grades, include: db.Schools}}
      });
      if (result) return { result };
      else throw new Error();
    });
    static getAllByOffTime = async (dayName, startTime, endTime) => {
        try {
            const query = `
                SELECT p.*, s.name AS studentName, g.name AS gradeName, sc.name AS schoolName
                            FROM parents AS p
                            JOIN students AS s ON p.id = s.parentId
                            JOIN grades AS g ON s.gradeId = g.id
                            JOIN gradesTimes AS gt ON g.id = gt.gradeId
                            JOIN schools AS sc ON g.schoolId = sc.id
                            WHERE p.deviceToken IS NOT NULL
                              AND gt.day = :dayName
                              AND gt.isActive = 1
                              AND gt.offTime BETWEEN :startTime AND :endTime
                            ORDER BY p.createdAt DESC;
                        `;

            const result = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { dayName, startTime, endTime },
            });

            return { result };
        } catch (error) {
            throw error;
        }
    };
    static getAllByStartTime = async (dayName, startTime, endTime) => {
        try {
            const query = `
                    SELECT p.*, s.name AS studentName, g.name AS gradeName, sc.name AS schoolName
                            FROM parents AS p
                            JOIN students AS s ON p.id = s.parentId
                            JOIN grades AS g ON s.gradeId = g.id
                            JOIN gradesTimes AS gt ON g.id = gt.gradeId
                            JOIN schools AS sc ON g.schoolId = sc.id
                            WHERE p.deviceToken IS NOT NULL
                              AND gt.day = :dayName
                              AND gt.isActive = 1
                              AND gt.startTime BETWEEN :startTime AND :endTime
                            ORDER BY p.createdAt DESC;
                        `;

            const result = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: { dayName, startTime, endTime },
            });

            return { result };
        } catch (error) {
            throw error;
        }
    };

  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.Parents.findByPk(id, {
          order: [["createdAt", "DESC"]],
          include: {model: db.Students,
              include: [
                  {
                      model: db.Grades,
                      include: [
                          {
                              model: db.GradesTime , where: { day: weekday },

                          },
                          { model: db.Schools }
                      ],
                  },
              ],
          }
      });
      if (result) return { result };
      else throw new Error();
    });

  static getAssistantById = async (id) =>
    await catchError(async () => {
        const result = await db.Parents.findAll({
            order: [["createdAt", "DESC"]],
            where: {
                userName: {
                    [Op.like]: parseInt(id)  + parseInt(1000000) + '%'
                }
            }
        });
        if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.Parents.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          include: {model: db.Students,
              include: [
                  {
                      model: db.Grades,
                      include: [
                          {
                              model: db.GradesTime , where: { day: weekday },

                          },
                          { model: db.Schools }
                      ],
                  },
              ],
          }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static getByColumnRoleBase = async (id,role) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.Parents.findAll({
        where: {
            clientId:id,
            role: {
                [Op.like]: role + '%'
            }
        },
        order: [["createdAt", "DESC"]],
          include: {model: db.Students,
              include: [
                  {
                      model: db.Grades,
                      include: [
                          {
                              model: db.GradesTime , where: { day: weekday },

                          },
                          { model: db.Schools }
                      ],
                  },
              ],
          }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  static checkEmail = async (clientId,email) =>
    await catchError(async () => {
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.Parents.findAll({
        where: {
            clientId,
            email
        },
        order: [["createdAt", "DESC"]],
          include: {model: db.Students,
              include: [
                  {
                      model: db.Grades,
                      include: [
                          {
                              model: db.GradesTime , where: { day: weekday },

                          },
                          { model: db.Schools }
                      ],
                  },
              ],
          }
      });
      if (result.length === 0) throw new Error();
      if (result) return { result };
      else throw new Error();
    });
  //checkUser
    static checkUser = async (clientId, email) =>
        await catchError(async () => {
            const result = await db.Parents.findOne({
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
        const dateObj = new Date()
        const weekday = dateObj.toLocaleString("default", { weekday: "long" })
      const result = await db.Parents.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          include: {model: db.Students,
              include: [
                  {
                      model: db.Grades,
                      include: [
                          {
                              model: db.GradesTime , where: { day: weekday },

                          },
                          { model: db.Schools }
                      ],
                  },
              ],
          }
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
      const result = await db.Parents.create({ password, ...data });
        if(result){
            try {
                await sendEmail(result.email, 'ezpick credentials',result.name,result.id,result.password);
            }
            catch (error){
                console.error('Error while sending email:', error);
                // You can choose to return a specific error message or status code, or perform any other necessary actions here.
            }
            await ParentService.update(result.id, { userName: result.id })
            return { result };
        }else
        {
            throw error
        }
    });
    static createGuardian = async (data) =>
        await catchError(async () => {
            var length = 7,
                charset = "0123456789",
                password = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                password += charset.charAt(Math.floor(Math.random() * n));
            }
            let guardian = 1000000;
            const result = await db.Parents.create({password, ...data});
            const count = await db.Parents.count({
                where: {
                    userName: {
                        [Op.like]: parseInt(data.parentId)  + parseInt(guardian) + '%'
                    }
                }
            });
            if (result) {
                let userName = parseInt(data.parentId)  + parseInt(guardian)
                    userName+='-'+count
                await ParentService.update(result.id, {userName: userName})
            }
            return {result};
        });
  // Update
  static update = async (id, data) =>
    await catchError(async () => {
        const [affectedRows] = await db.Parents.update(data, { where: { id } });
        if (affectedRows) {
            const updatedParent = await db.Parents.findByPk(id);
            return { result: true, data: updatedParent };
        } else {
            throw new Error();
        }
    });
  static updateStatus = async (id, data) =>
    await catchError(async () => {
        const [affectedRows] = await db.Parents.update(data, { where: { clientId: id } });
        if (affectedRows > 0) return { result: true };
        else throw new Error();
    });
    static addPickUpGuardian = async (parentId,studentId ) => {
        const result = await db.PickUpGuardianStudents.create({
            parentId,
            studentId,
        });
        if (result) return {result};
        else throw new Error();
    };
  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.Parents.destroy({ where: { id } });
      const parentId = id
        const affectedRows1 = await db.PickUpGuardianStudents.destroy({ where: {  parentId } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
  // Delete associated
    static deleteAssociated = async (parentId, studentId) => {
        try {
            const existingRecord = await db.PickUpGuardianStudents.findOne({ where: { parentId } });
            if (!existingRecord) {
                return { result: true };
            }

            const affectedRows = await db.PickUpGuardianStudents.destroy({ where: { parentId } });

            if (affectedRows > 0) {
                return { result: true };
            } else {
                throw new Error('Deletion failed');
            }
        } catch (error) {
            console.error('Error deleting associated record:', error);
            throw error;
        }
    };

};

module.exports = ParentService