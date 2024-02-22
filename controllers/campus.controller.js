// Package Imports

// Local Imports
const { CampusService } = require("../services");

module.exports = class {
  // Get All
  static async getAll(_, res) {
    const data = await CampusService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, campuses: data.result });
    }
  }
  // Get By ClientId
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CampusService.getByColumn("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, campuses: [] });
      } else {
        res.status(200).json({ success: true, campuses: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getBySchoolId(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CampusService.getByColumn("schoolId", id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, campuses: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CampusService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, campus: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const data = await CampusService.create({ ...req.body });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { error, result } = await CampusService.getById(data.result.id);
      res.status(200).json({ success: true, campus: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await CampusService.update(id, { ...rest });
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
      const data = await CampusService.delete(id);
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
