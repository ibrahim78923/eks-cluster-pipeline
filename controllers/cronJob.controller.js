// Local Imports
const moment = require('moment-timezone');
const { ParentService,TeacherGradeService ,TeacherService,GradeService,StudentService,RequestService} = require("../services");
const { fcm } = require("utils/fcm");

module.exports = class {


  // welcome
  static async welcome(_, res) {
    res.json({ success: true, message: 'welcome' });
    const data = await ParentService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.json({ success: true, admins: data.result });
    }
  }
  // password change
  static async passwordChange(_, res) {
    const data = await ParentService.getAll();
    let j = 0; const iMax = data.result.length;
    for(j ; j < iMax; j++) {
      if(data.result[j].password){
        console.log(data.result[j].password)
      }
      var length = 7,
          charset = "0123456789",
          password = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      await ParentService.update(data.result[j].id, { password: password })
    }
  }
  // password change
  static async addClientId(_, res) {
    const clientId= '1000000';
    const data = await StudentService.getByColumn("clientId", clientId);
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }else {
      let j = 0; const iMax = data.result.length;
      for(j ; j < iMax; j++) {
        const parentId = data.result[j].parentId;
        if (!data.error) {
          //  await ParentService.update(parentId, {
          //   clientId: clientId
          // });
          console.log(parentId)
        }
      }
      res.status(200).json({ success: true,data:iMax });
    }

  }
  // addTestStudent
  static async addTestStudent(_, res) {
    const clientId= '1000049';
    const schoolId= '75';
    const gradeId= '153';
    const parents = await ParentService.getByColumn('clientId',clientId);
    let j = 0; const iMax = parents.result.length;
    for(j ; j < iMax; j++) {
      let parentId= parents.result[j].id
      // let email = '';
      // var digits = '0123456789';
      // for (let i = 0; i < 10; i++ ) {
      //   email += digits[Math.floor(Math.random() * 10)];
      // }
      // email= email+'+'+j+'@gmail.com'
      // const newParent = {
      //   clientId: clientId,
      //   email: email,
      //   motherEmail:email,
      //   role:'parent'
      // };
      // const parentAddition = await ParentService.create(newParent);
      if (!parents.error) {
        const newChild = {
          clientId: clientId,
          name: parents.result[j].email,
          schoolId:schoolId,
          parentId:parentId,
          gradeId:gradeId,
          gender:'male'
        };
        const data = await StudentService.create(newChild);
        let studentId = data.result.id;
        console.log('studentId',studentId)
        console.log('parentId',parentId)
        await ParentService.addPickUpGuardian(parentId,studentId);
      }



    }
    res.status(200).json({ success: true,data:iMax });
  }
  // password change
  static async createRequest(_, res) {
    const clientId= '1000000';
    const data = await StudentService.getByColumn("clientId", clientId);
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }else {
      let j = 0; const iMax = data.result.length;
      for(j ; j < iMax; j++) {
        const parentId = data.result[j].parent.id;
        const studentId = data.result[j].id;
        const gradeId = data.result[j].grade.id;
        const status = 0;
        const requestTime = new Date();
        // const req = await RequestService.create({ parentId,studentId,gradeId,clientId,status,requestTime });
        console.log(studentId)
        return
      }
      res.status(200).json({ success: true,data:iMax });
    }

  }
  static async offTimeReminderSend(_, res) {
    const saudiTime = moment().tz('Asia/Riyadh');
    const updatedTimeAdd = saudiTime.add(30, 'minute');
    const dayName = saudiTime.format('dddd');

    console.log('start time',updatedTimeAdd.format('HH:mm'));
    console.log(dayName);
    const data = await ParentService.getAllByOffTime(dayName,updatedTimeAdd.format('HH:mm'),updatedTimeAdd.format('HH:mm'));
    if (!data.error) {
      let j = 0; const iMax = data.result.length;
      if(iMax){
        for(j ; j < iMax; j++) {
          let k = 0;
          const deviceToken = data.result[j].deviceToken;
          const studentName = data.result[j].studentName;
          console.log(deviceToken)
          if(deviceToken){
            const sendNotification = await fcm('',deviceToken, 'Reminder!','Hello, Parents You have 30 Minutes to pick up your child '+studentName+' from school.','','admin');
          }
        }
        res.json({ success: true, messege: data });
      }else {
        res.json({ success: false, messege: 'off time  '+updatedTimeAdd.format('HH:mm')+ ' not match' });
      }

    }
  }

  // startTimeReminderSend
  static async startTimeReminderSend(_, res) {
    const saudiTime = moment().tz('Asia/Riyadh');
    const updatedTimeAdd = saudiTime.add(30, 'minute');
    const dayName = saudiTime.format('dddd');

    console.log('start time',updatedTimeAdd.format('HH:mm'));
    console.log(dayName);
    const data = await ParentService.getAllByStartTime(dayName,updatedTimeAdd.format('HH:mm'),updatedTimeAdd.format('HH:mm'));
    if (!data.error) {
      let j = 0; const iMax = data.result.length;
      if(iMax){
        for(j ; j < iMax; j++) {
          let k = 0;
          const deviceToken = data.result[j].deviceToken;
          const studentName = data.result[j].studentName;
          console.log(deviceToken)
          if(deviceToken){
            const sendNotification = await fcm('',deviceToken, 'Reminder!','Hello, Parents You have 30 Minutes left to Drop your child '+studentName+' in school.','','admin');
          }
        }
        res.json({ success: true, messege: data });
      }else {
        res.json({ success: false, messege: 'Start time '+updatedTimeAdd.format('HH:mm')+' not match' });
      }

    }
  }
  // delete student
  static async delete(_, res) {

    const data = await StudentService.getByColumn("clientId",'1000000' );
    console.log(data)
    if (data.error) {
      res.status(200).json({ success: false });
    } else {
      // let j = 0; const iMax = data.result.length;
      // if(iMax){
      //   for(j ; j < iMax; j++) {
      //      await ParentService.delete(data.result[j].parent.id);
      //     console.log(data.result[j].parent.id)
      //     await StudentService.delete(data.result.id);
      //     console.log(data.result[j].id)
      //   }
      // }
      res.status(200).json({ success: true });
    }

  }

  // Add grades Time for all
  static async addGradeTime(_, res) {

    const data = await GradeService.getAll();
    // const data = await GradeService.getById(gradeId);
    if (!data.error) {

      let j = 0; const iMax = data.result.length;
      if(iMax){
        for(j ; j < iMax; j++) {
          let gradeId = data.result[j].id;
          console.log(gradeId)
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          for (let i in days) {
            const day = days[i];
            const offTime = '13:50';
            const startTime = '9:30';
            const isActive = true;
            await GradeTimeService.create({  gradeId,day,offTime,startTime });
          }
        }
      }


      res.status(200).json({ success: true,data:data });
    }

  }

  // Add grades Time for all
  static async addTeacherGrade(_, res) {


    const teacherData = await TeacherService.getByclient({ clientId: 1000002 });
    const gradeData = await GradeService.getByClient({ clientId: 1000002 });
    if (!teacherData.error) {
      let j = 0; const iMax = teacherData.result.length;
        if(iMax){
          for(j ; j < iMax; j++) {
            let teacherId = teacherData.result[j].id;
            console.log('teacher id',teacherId)
              let k = 0; const kMax = gradeData.result.length;
                if(kMax) {
                  for (k; k < kMax; k++) {
                    let gradeId = gradeData.result[k].id;
                    // await TeacherGradeService.create({  teacherId, gradeId });
                    console.log(gradeId)
                  }
                }
            }
          }
        }

      res.status(200).json({ success: true });

  }
  // addStudent for all
  static async addStudent(_, res) {
    const data = await StudentService.getAll();
    if (!data.error) {
      let j = 0; const iMax = data.result.length;
        if(iMax){
          for(j ; j < iMax; j++) {
            let studentId = data.result[j].id;
            let parentId = data.result[j].parent.id;
            console.log('studentId',studentId)
            console.log('parentId',parentId)
            // await ParentService.addPickUpGuardian(parentId,studentId);
            }
          }
        }
      res.status(200).json({ success: true });
  }

};
