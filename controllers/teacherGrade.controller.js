// Package Imports

// Local Imports
const { TeacherGradeService } = require("../services");

module.exports = class {
  // Get All
  static async getAll(_, res) {
    const data = await TeacherGradeService.getAll();
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, teachersGrades: data.result });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherGradeService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, grade: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }

  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherGradeService.getByColumn("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, teachersGrades: [] });
      } else {
        res.status(200).json({ success: true, teachersGrades: data.result });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide client ID." });
    }
  }
  // Create
  static async create(req, res) {
    const data = await TeacherGradeService.create({ ...req.body });
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, grade: data.result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await TeacherGradeService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherGradeService.delete(id);
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID" });
    }
  }
};
