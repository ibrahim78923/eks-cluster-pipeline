// Package Imports

// Local Imports
const { SchoolService,TeacherService,GradeService } = require("../services");

module.exports = class {
  // Get All
  static async getAll(req, res) {
    const data = await SchoolService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, schools: data.result });
    }
  }
  // Get AllWith grades
  static async getAllWithGrades(req, res) {
    const data = await SchoolService.getAllWithGrades();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, schools: data.result });
    }
  }

  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;
    const { getGrades,getTeachers } = req.query;

    if (getGrades) {
      const data = await SchoolService.getByColumnWithGrades("clientId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
      return;
    }
    if (getTeachers) {
      const data = await SchoolService.getByColumnWithTeachers("clientId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
      return;
    }

    if (id) {
      const data = await SchoolService.getByColumn("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, schools: [] });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }

  // Get By Id
  static async getByClientWeb(req, res) {
    const { id } = req.params;
    const { getGrades,getTeachers } = req.query;

    if (getGrades) {
      const data = await SchoolService.getByColumnWithGrades("clientId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
      return;
    }
    if (getTeachers) {
      const data = await SchoolService.getByColumnWithTeachers("clientId", id);
      if (data.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
      return;
    }

    if (id) {
      const data = await SchoolService.webByClient("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, schools: [] });
      } else {
        res.status(200).json({ success: true, schools: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await SchoolService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, school: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const profileUrl = req.file.location;
    const data = await SchoolService.create({ ...req.body,profileUrl });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { error, result } = await SchoolService.getById(data.result.id);
      res.status(200).json({ success: true, school: result });
    }
  }
  // Create
  static async simpleCreate(req, res) {
    const data = await SchoolService.create({ ...req.body });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { error, result } = await SchoolService.getById(data.result.id);
      res.status(200).json({ success: true, school: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await SchoolService.update(id, { ...rest });
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
// Update
  static async updateProfile(req, res) {
    const profileUrl = req.file.location;
    const { id } = req.body;
    if (id) {
      const data = await SchoolService.update(id, {
        profileUrl: profileUrl,
      });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res
            .status(200)
            .json({ success: true, message: "Profile image Uploaded." });
      }
    } else {
      console.log("Not Found");
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }
  }
  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const grades  = await GradeService.getByColumn({schoolId:id});
      const teacher  = await TeacherService.getByColumn({schoolId:id});
      if (grades.error  ||  teacher.error ){
        const data = await SchoolService.delete(id);
        if (data.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
        } else {
          res.status(200).json({ success: true });
        }
      }else {
        res.status(500).json({
          success: false,
          message: "Request could not be processed because teachers and grades record exits for this school.",
        });

      }
    } else {
      res.status(200).json({ success: false, message: "Please provide an ID" });
    }
  }
};
