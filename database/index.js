// Package Imports
const Sequelize = require("sequelize");

// Local Imports
const dbConfig = require("./db.config");
const {
  getSchoolModel,
  getAdminModel,
  getClientModel,
  // getCampusModel,
  getGradeModel,
  getTeacherModel,
  getTeacherGradeModel,
  getStudentModel,
  getParentModel,
  getRequestModel,
  getNotificationModel,
  getPushNotificationModel,
  getGradesTimeModel,
  getPickUpGuardianModel,
  getPickUpGuardianStudentModel,
  planModel,
  cmsModel,
  cmsFeatureModel,
  contactModel,
  guardModel


} = require("./models");

const defineRelations = (db) => {
  // Relations for Clients
  db.Clients.hasMany(db.Schools);
  db.Clients.belongsTo(db.plans);

  //plans relation
  db.plans.hasOne(db.Clients);

  // cms relations
  db.cmsFeatures.belongsTo(db.cms);
  db.plans.belongsTo(db.cms);
  db.cms.hasMany(db.plans);
  db.cms.hasMany(db.cmsFeatures);

  // Relations for Schools
  db.Schools.belongsTo(db.Clients);
  db.Schools.hasMany(db.Grades);
  db.Schools.hasMany(db.Teachers);


  // Relations for Grades
  db.Grades.belongsTo(db.Schools);
  // db.Grades.belongsTo(db.Teachers);
  db.Grades.hasMany(db.Students);
  // Relations for Teachers
  db.Teachers.hasMany(db.Students);
  // db.Teachers.hasMany(db.Grades);
  db.Teachers.belongsTo(db.Schools);
  db.Teachers.hasMany(db.Notifications);
  // Relations for Parents
  db.Parents.hasMany(db.Students);
  db.Parents.hasMany(db.Notifications);
  // Relations for Students
  db.Students.belongsTo(db.Grades);
  db.Students.belongsTo(db.Teachers);
  db.Students.belongsTo(db.Parents);
  // Relations for Request
  db.Students.hasMany(db.Requests);
  db.Requests.belongsTo(db.Students);
  // Relations for Notifications
  db.Notifications.belongsTo(db.Parents);
  db.Notifications.belongsTo(db.Teachers);
  // relation For grades

  db.Grades.hasMany(db.GradesTime);
  db.GradesTime.belongsTo(db.Grades);


  db.Teachers.belongsToMany(db.Grades, {through:db.TeachersGrades});
  db.Grades.belongsToMany(db.Teachers, {through:db.TeachersGrades});
  db.Teachers.hasMany(db.TeachersGrades);
  db.TeachersGrades.belongsTo(db.Teachers);
  db.Grades.hasMany(db.TeachersGrades);
  db.TeachersGrades.belongsTo(db.Grades);


  db.Parents.belongsToMany(db.Students, {through:db.PickUpGuardianStudents});
  db.Students.belongsToMany(db.Parents, {through:db.PickUpGuardianStudents});
  db.Parents.hasMany(db.PickUpGuardianStudents);
  db.PickUpGuardianStudents.belongsTo(db.Parents);
  db.Students.hasMany(db.PickUpGuardianStudents);
  db.PickUpGuardianStudents.belongsTo(db.Students);


  //guards
  db.Guards.hasMany(db.Requests);
  db.Requests.belongsTo(db.Guards);
};

class Database {
  static db = {};
  static connect() {
    const sequelize = new Sequelize(
      dbConfig.DB,
      dbConfig.USER,
      dbConfig.PASSWORD,
      {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: { ...dbConfig.pool },
      }
    );

    const { db } = Database;

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.Schools = getSchoolModel(sequelize);
    db.Admins = getAdminModel(sequelize);
    db.Clients = getClientModel(sequelize);
    // db.Campuses = getCampusModel(sequelize);
    db.Grades = getGradeModel(sequelize);
    db.Teachers = getTeacherModel(sequelize);
    db.TeachersGrades = getTeacherGradeModel(sequelize);
    db.Students = getStudentModel(sequelize);
    db.Parents = getParentModel(sequelize);
    db.Requests = getRequestModel(sequelize);
    db.Notifications = getNotificationModel(sequelize);
    // db.pushNotifications = getPushNotificationModel(sequelize);
    db.GradesTime = getGradesTimeModel(sequelize);
    // db.pickUpGuardians = getPickUpGuardianModel(sequelize);
    db.PickUpGuardianStudents = getPickUpGuardianStudentModel(sequelize);
    db.plans = planModel(sequelize);
    db.cms = cmsModel(sequelize);
    db.cmsFeatures = cmsFeatureModel(sequelize);
    db.contacts = contactModel(sequelize);
    db.Guards = guardModel(sequelize);

    // define relations
    defineRelations(db);

    db.sequelize
      .sync()
      .then(() => {
        console.log("Synced db.");
      })
      .catch((err) => {
        console.log("Failed to sync db: " + err.message);
      });
  }
}

module.exports = Database;
