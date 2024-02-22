// Package Imports

// Local Imports
const { GradeService,GradeTimeService } = require("../services");

module.exports = class {
  // Get All
  static async getAll(_, res) {
    const data = await GradeService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, grades: data.result });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, grade: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
// Get By Id
  static async getByIdWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getByIdWeb(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, grade: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  static async getStudentByTeacher(req, res) {
    const { teacherId,gradeId} = req.query;
    const id = gradeId;
    if (id && teacherId){

      const data = await GradeService.getStudentByTeachersGrades({ id, teacherId });
      console.log(data)
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, result: data.result.students });
      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "Please provide  Teacher and Grade ID." });
    }
  }
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getByClient({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, grades: [] });
      } else {
        res.status(200).json({ success: true, grades: data.result });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide client ID." });
    }
  }
  static async getByClientWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getByClientWeb({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, grades: [] });
      } else {
        res.status(200).json({ success: true, grades: data.result });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide client ID." });
    }
  }

  static async getBySchool(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getByColumn({ schoolId: id });
      if (data.error) {
        res.status(200).json({ success: true, grades: [] });
      } else {
        res.status(200).json({ success: true, grades: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  static async getBySchoolWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeService.getByClientWeb({ schoolId: id });
      if (data.error) {
        res.status(200).json({ success: true, grades: [] });
      } else {
        res.status(200).json({ success: true, grades: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  static async getByTeacher(req, res) {
    const { id } = req.params;
    if (id) {
      const data = await GradeService.getByColumn({ teacherId: id });
      if (data.error) {
        res.status(200).json({ success: true, grades: [] });
      } else {
        res.status(200).json({ success: true, grades: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Create
  static async create(req, res) {
    // get School id
    const { schoolId, name } = req.body;
    const gradeNameCheck = await GradeService.getByColumn({ schoolId, name });
    if (gradeNameCheck.result.length > 0) {
      res
        .status(200)
        .json({ success: false, message: "Grade name already exists" });
      return;
    }

    const data = await GradeService.create({ ...req.body, schoolId, name });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const gradeId = data.result.id;
      for (let i in req.body.gradeTimes) {
        const day = req.body.gradeTimes[i].day;
        const offTime = req.body.gradeTimes[i].offTime;
        const startTime = req.body.gradeTimes[i].startTime;
        const isActive = req.body.gradeTimes[i].isActive;
        await GradeTimeService.create({  gradeId,day,offTime,startTime,isActive });
      }
      const { error, result } = await GradeService.getById(data.result.id);
      res.status(200).json({ success: true, grade: result });
    }
  }
  static async createGradeTime(req, res) {
    // get School id
    const { gradeId, day,offTime,startTime } = req.body;
    const data = await GradeTimeService.create({  gradeId,day,offTime,startTime });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await GradeService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        for (let i in req.body.gradeTimes) {
          const timeId = req.body.gradeTimes[i].id;
          const day = req.body.gradeTimes[i].day;
          const offTime = req.body.gradeTimes[i].offTime;
          const startTime = req.body.gradeTimes[i].startTime;
          const isActive = req.body.gradeTimes[i].isActive;
          await GradeTimeService.update(timeId,{ day,offTime,startTime,isActive });
        }
        res.status(200).json({ success: true });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // gradeTime Update
  static async gradeTimeUpdate(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await GradeTimeService.update(id, { ...rest });
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
      const data = await GradeService.delete(id);
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
  // gradeTime Delete
  static async gradeTimeDelete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await GradeTimeService.delete(id);
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
