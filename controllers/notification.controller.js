// Package Imports

// Local Imports
const { NotificationService,TeacherService,ParentService } = require("../services");
const { fcm } = require("utils/fcm");

module.exports = class {
  // Get All
  static async getAllByTeachers(req, res) {
    const { id } = req.params;
    if (id){

      const data = await NotificationService.getByColumnWithTeachers("teacherId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    }
    else{
      res
          .status(500)
          .json({ success: false, message: "Id Not Found." });
    }
  }
  static async getAllByParents(req, res) {
    const { id } = req.params;
    if (id){

      const data = await NotificationService.getByColumnWithParents("parentId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    }
  else{
      res
          .status(500)
          .json({ success: false, message: "Id Not Found." });
    }
}
  // Get AllWith grades
  static async getAllWithGrades(req, res) {
    const data = await NotificationService.getAllWithGrades();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, notifications: data.result });
    }
  }
  // Get AllWith dates between
  static async getAllWithDates(req, res) {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;
    if (id) {
      if (dateFrom && dateTo) {
        const data = await NotificationService.getByParentAndDates(
          id,
          dateFrom,
          dateTo
        );
        if (data.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        } else {
          res.status(200).json({ success: true, notifications: data.result });
          return;
        }
      } else {
        const data = await NotificationService.getByColumn("parentId", id);
        if (data.error) {
          res.status(200).json({ success: true, notifications: [] });
        } else {
          res.status(200).json({ success: true, notifications: data.result });
        }
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide parentId ID." });
    }
  }

  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;
    // res.status(200).json({ success: true, notifications: "Heellow"});
    console.log(id,"notifications")
    // const { getGrades, getTeachers } = req.query;

    // if (getGrades) {
    //   const data = await NotificationService.getByColumnWithGrades("clientId", id);
    //   if (data.error) {
    //     res
    //       .status(500)
    //       .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, notifications: data.result });
    //   }
    //   return;
    // }
    // if (getTeachers) {
    //   const data = await NotificationService.getByColumnWithTeachers("clientId", id);
    //   if (data.error) {
    //     res
    //       .status(500)
    //       .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, notifications: data.result });
    //   }
    //   return;
    // }

    if (id) {
      const data = await NotificationService.getByColumnsgroupBy("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, notifications: [] });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Student id
  static async getByStudent(req, res) {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      const data = await NotificationService.getByStudentAndDates(
        id,
        startDate,
        endDate
      );
      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    }
  }
  static async getAllByGrades(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await NotificationService.getAllByGrades(id);
      if (data.error) {
        res.status(200).json({ success: true, notifications: [] });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide gradeId ID." });
    }
  }
  // Get By Student id
  static async getByParent(req, res) {
    const { id } = req.params;
    // const { getGrades,getTeachers } = req.query;
    //
    // if (getGrades) {
    //   const data = await NotificationService.getByColumnWithGrades("studentId", id);
    //   if (data.error) {
    //     res
    //         .status(500)
    //         .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, notifications: data.result });
    //   }
    //   return;
    // }
    // if (getTeachers) {
    //   const data = await NotificationService.getByColumnWithTeachers("studentId", id);
    //   if (data.error) {
    //     res
    //         .status(500)
    //         .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, notifications: data.result });
    //   }
    //   return;
    // }

    if (id) {
      const data = await NotificationService.getByColumn("parentId", id);
      if (data.error) {
        res.status(200).json({ success: true, notifications: [] });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide parentId ID." });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await NotificationService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, request: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const imageUrl = req?.file?.location;
    let data = {};
    if(imageUrl){
      data = await NotificationService.create({ ...req.body, imageUrl });
    } else{
      data = await NotificationService.create({ ...req.body });
    }
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }
    else {
      const { error, result } = await NotificationService.getById(data.result.id);
      res.status(200).json({ success: true, request: result  });
    }
  }
  static async bulkCreate(req, res) {
    const imageUrl = req?.file?.location;
    const { sendTo,clientId } = req.body;
    let data = {};
    if(sendTo=== 'teacher')
    {
      const teachers = await TeacherService.getByclient({ clientId: clientId });
      let j = 0; const iMax = teachers.result.length;
      for(j ; j < iMax; j++) {
        const teacherId = teachers.result[j].id;
        const deviceToken = teachers.result[j].deviceToken;
        if (!teachers.error) {
          if(imageUrl){
            data = await NotificationService.create({ ...req.body,teacherId, imageUrl });
            if(deviceToken){
              const sendNotification = await fcm(imageUrl,deviceToken, data.result.title,data.result.message,'','request');
            }
          } else{
            data = await NotificationService.create({ ...req.body,teacherId });
            if(deviceToken){
              const sendNotification = await fcm('',deviceToken, data.result.title,data.result.message,'','admin');
            }
          }
          console.log(teacherId)
        }
      }
      res.status(200).json({ success: true  });
    }else {
      const parents = await ParentService.getByColumn("clientId", clientId);
      let j = 0; const iMax = parents?.result.length;
      for(j ; j < iMax; j++) {
        const parentId = parents.result[j].id;
        const deviceToken = parents.result[j].deviceToken;
        if (!parents.error) {
          if(imageUrl){
            data = await NotificationService.create({ ...req.body,parentId, imageUrl });
            if(deviceToken){
              const sendNotification = await fcm(imageUrl,deviceToken, data.result.title,data.result.message,'','admin');
            }
          } else{
            data = await NotificationService.create({ ...req.body ,parentId});
            if(deviceToken){
              const sendNotification = await fcm('',deviceToken, data.result.title,data.result.message,'','admin');
            }
          }
        }
      }
      res.status(200).json({ success: true  });
    }
  }
  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await NotificationService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await NotificationService.delete(id);
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide an ID" });
    }
  }
};
