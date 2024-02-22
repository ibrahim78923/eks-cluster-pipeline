// Package Imports

// Local Imports
const { pushNotificationService } = require("../services");

module.exports = class {
  // Get All
  static async getAllByTeachers(req, res) {
    const { id } = req.params;
    if (id){

      const data = await pushNotificationService.getByColumnWithTeachers("teacherId", id);
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

      const data = await pushNotificationService.getByColumnWithParents("parentId", id);
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
    const data = await pushNotificationService.getAllWithGrades();
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
        const data = await pushNotificationService.getByParentAndDates(
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
        const data = await pushNotificationService.getByColumn("parentId", id);
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
    const { getGrades, getTeachers } = req.query;

    if (getGrades) {
      const data = await pushNotificationService.getByColumnWithGrades("clientId", id);
      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
      return;
    }
    if (getTeachers) {
      const data = await pushNotificationService.getByColumnWithTeachers("clientId", id);
      if (data.error) {
        res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, notifications: data.result });
      }
      return;
    }

    if (id) {
      const data = await pushNotificationService.getByColumn("clientId", id);
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
      const data = await pushNotificationService.getByStudentAndDates(
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
      const data = await pushNotificationService.getAllByGrades(id);
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
    //   const data = await pushNotificationService.getByColumnWithGrades("studentId", id);
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
    //   const data = await pushNotificationService.getByColumnWithTeachers("studentId", id);
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
      const data = await pushNotificationService.getByColumn("parentId", id);
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
      const data = await pushNotificationService.getById(id);
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
    const data = await pushNotificationService.create({ ...req.body });
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      const { error, result } = await pushNotificationService.getById(data.result.id);
      res.status(200).json({ success: true, campus: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await pushNotificationService.update(id, { ...rest });
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
      const data = await pushNotificationService.delete(id);
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
