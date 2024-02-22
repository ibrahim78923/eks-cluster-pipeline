// Package Imports

// Local Imports
const { PlanService } = require("../services");

module.exports = class {
  // Get By getByClient
  static async getAll(req, res) {
    const { durationType,lang } = req.query
    let data =[];
    if(durationType && lang){
       data = await PlanService.getByLangAndType(durationType,lang);
    }
    else if (lang){
      data = await PlanService.getByLang(lang);
    }else if (durationType){
      data = await PlanService.getByType(durationType);
    }
    else {
       data = await PlanService.getAll();
    }
    if (data.error) {
      res.status(200).json({ success: true, plans: [] });
    } else {
      res.status(200).json({ success: true, plans: data.result });
    }
  }
  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await PlanService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, plan: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get By type
  static async getByType(req, res) {
    const { type } = req.params;

    if (type) {
      const data = await PlanService.getByColumn(type);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, plan: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    let data = {};
    data = await PlanService.create({ ...req.body });
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }
    else {
      const { error, result } = await PlanService.getById(data.result.id);
      res.status(200).json({ success: true, plans: result  });
    }
  }
  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await PlanService.update(id, { ...rest });
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
      const data = await PlanService.delete(id);
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
