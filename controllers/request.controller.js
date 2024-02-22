// Package Imports

// Local Imports
const { fcm } = require("utils/fcm");
const { RequestService,ParentService } = require("../services");

module.exports = class {
  // Get All
  static async getAll(req, res) {
    const data = await RequestService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }
  // Get AllWith grades
  static async getAllWithGrades(req, res) {
    const data = await RequestService.getAllWithGrades();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }
  // Get AllWith dates between
  static async getAllWithDates(req, res) {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    if (id) {
      if (dateFrom && dateTo) {
        const data = await RequestService.getByParentAndDates(
          id,
          dateFrom,
          dateTo
        );
        if (data.error) {
          res
            .status(500)
            .json({
              success: false,
              message: "Request could not be processed.",
            });
          return;
        } else {
          res.status(200).json({ success: true, requests: data.result });
          return;
        }
      } else {
        const data = await RequestService.getByColumn("parentId", id);
        if (data.error) {
          res.status(200).json({ success: true, requests: [] });
        } else {
          res.status(200).json({ success: true, requests: data.result });
        }
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide Parent ID." });
    }
  }

  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;
    const { getGrades, getTeachers } = req.query;

    if (getGrades) {
      const data = await RequestService.getByColumnWithGrades("clientId", id);
      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
          
      } else {
        res.status(200).json({ success: true, requests: data.result });
      }
      return;
    }
    if (getTeachers) {
      const data = await RequestService.getByColumnWithTeachers("clientId", id);
      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });

      } else {
        res.status(200).json({ success: true, requests: data.result });
      }
      return;
    }

    if (id) {
      const data = await RequestService.getByColumn("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, requests: [] });
      } else {
        res.status(200).json({ success: true, requests: data.result });
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
      const data = await RequestService.getByStudentAndDates(
        id,
        startDate,
        endDate
      );

      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, requests: data.result });
      }
    }
  }
  static async getAllByGrades(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await RequestService.getAllByGrades(id);
      if (data.error) {
        res.status(200).json({ success: true, requests: [] });
      } else {
        res.status(200).json({ success: true, requests: data.result });
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
    //   const data = await RequestService.getByColumnWithGrades("studentId", id);
    //   if (data.error) {
    //     res
    //         .status(500)
    //         .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, requests: data.result });
    //   }
    //   return;
    // }
    // if (getTeachers) {
    //   const data = await RequestService.getByColumnWithTeachers("studentId", id);
    //   if (data.error) {
    //     res
    //         .status(500)
    //         .json({ success: false, message: "Request could not be processed." });
    //   } else {
    //     res.status(200).json({ success: true, requests: data.result });
    //   }
    //   return;
    // }

    if (id) {
      const data = await RequestService.getByColumn("parentId", id);
      if (data.error) {
        res.status(200).json({ success: true, requests: [] });
      } else {
        res.status(200).json({ success: true, requests: data.result });
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
      const data = await RequestService.getById(id);
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
 const {parentId,studentId,timestamp,pickUpGuardian} = req.body
    const { result: existing } =
        await RequestService.getTodayRequestByParentAndStudent(
            parentId,
            studentId
        );
    if (existing.length > 0) {
      const latest = existing.find(e => {
        return String(e.studentId) === String(studentId);
      });
      const {request} = await RequestService.update(latest.id, {
        requestTime: timestamp,
        pickUpGuardian: pickUpGuardian,
        parentId: parentId,
      });
      res.status(200).json({ success: true, request: request });
    }else {
      const data = await RequestService.create({
        requestTime: timestamp,
        pickUpGuardian: pickUpGuardian,
        parentId: parentId,
        studentId: studentId,
        ...req.body
      });
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        const { error, result } = await RequestService.getById(data.result.id);
        res.status(200).json({ success: true, request: result });
      }
    }
  }
  // createApprove
  static async createApprove(req, res) {
    const { parentId,studentId } = req.body;
    const { result: existing } =
        await RequestService.getTodayRequestByParentAndStudent(
            parentId,
            studentId
        );
    if (existing.length > 0) {
      res.status(200).json({ success: false, message: "Already request generate by parent" });
    }else {
      const data = await RequestService.create({ ...req.body });
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        const requestId = data.result.id;
        const { error, result } = await RequestService.getById(data.result.id);
        const dataParent = await ParentService.getById(req.body.parentId);
        if (dataParent.result.deviceToken != null) {
          const sendNotification = await fcm('',dataParent.result.deviceToken, 'Alert!','approve request',requestId);
        }
        res.status(200).json({ success: true, request: result });
      }
    }

  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await RequestService.update(id, { ...rest });
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
      const data = await RequestService.delete(id);
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
  //get by single student data
static async getBySingleStudent(req, res) {
  const { studentId } = req.params;
  const { dateFrom, dateTo, gradeId, schoolId } = req.query;
  if (dateFrom && dateTo) {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const data = await RequestService.getByStudentWithDates(studentId, schoolId, gradeId, dateFrom, dateTo);
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }
}

//get by single guard data
  static async getBySingleGuard(req, res) {
    const { guardId } = req.params;
    const { dateFrom, dateTo } = req.query;
    const data = await RequestService.getByGuardIdAndDates(guardId,dateFrom, dateTo);
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }

// get by grade wise
static async getBygrade(req, res) {
  const { gradeId } = req.params;
  const { dateFrom, dateTo, schoolId } = req.query;
  if (dateFrom && dateTo) {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const data = await RequestService.getGradesWise(gradeId, schoolId, dateFrom, dateTo);
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }
}




// get by full school
static async getBySchool(req, res) {
  const { schoolId } = req.params;
  const { dateFrom, dateTo, gradeId } = req.query;
  if (dateFrom && dateTo) {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const data = await RequestService.getBySchool(schoolId, dateFrom, dateTo);
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, requests: data.result });
    }
  }
}
};
