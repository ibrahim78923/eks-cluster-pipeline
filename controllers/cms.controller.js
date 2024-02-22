// Package Imports

// Local Imports
const { CmsService,PlanService } = require("../services");

module.exports = class {
  // Get By getByClient
  static async getAll(req, res) {
    const { lang } = req.query
    let data =[]
    if(lang){
      data = await CmsService.getAllByLang(lang);
    }else {
      data = await CmsService.getAll();
    }
    if (data.error) {
      res.status(200).json({ success: true, cms: [] });
    } else {
      res.status(200).json({ success: true, cms: data.result });
    }
  }
  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CmsService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, cms: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const { cmsFeatures,cmsPlans } = req.body;
    let data = {};
    data = await CmsService.create({ ...req.body });
    const cmId = data.result.id
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }
    else {
      if (cmsFeatures){
        for (let i in cmsFeatures) {
           await CmsService.featureCreate({
            title: cmsFeatures[i].title,
            description:cmsFeatures[i].description,
            image:cmsFeatures[i].image,
            lang:cmsFeatures[i].lang,
             cmId
          });
        }
      }
      if (cmsPlans){
        for (let i in cmsPlans) {
          await PlanService.create({
            title: cmsPlans[i].title,
            point1:cmsPlans[i].point1,
            point2:cmsPlans[i].point2,
            point3:cmsPlans[i].point3,
            point4:cmsPlans[i].point4,
            point5:cmsPlans[i].point5,
            point6:cmsPlans[i].point6,
            point7:cmsPlans[i].point7,
            point8:cmsPlans[i].point8,

            price:cmsPlans[i].price,
            lang:cmsPlans[i].lang,
            durationType:cmsPlans[i].durationType,
            cmId
          });
        }
      }
      const { error, result } = await CmsService.getById(data.result.id);
      res.status(200).json({ success: true, cms: result  });
    }
  }
  // featureCreate
  static async featureCreate(req, res) {
    const imageUrl = req?.file?.location;
    let data = {};
    if(imageUrl){
      data = await CmsService.featureCreate({ ...req.body, imageUrl });
    } else{
      data = await CmsService.featureCreate({ ...req.body });
    }
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }
    else {
      res.status(200).json({ success: true  });
    }
  }
  // Update
  static async update(req, res) {
    const { id,cmsFeatures,cmsPlans, ...rest } = req.body;

    if (id) {
      const data = await CmsService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        if (cmsFeatures){
          for (let i in cmsFeatures) {
            if(cmsFeatures[i].id){
              await CmsService.featureUpdate(cmsFeatures[i].id,{
                title: cmsFeatures[i].title,
                description:cmsFeatures[i].description,
                image:cmsFeatures[i].image,
                lang:cmsFeatures[i].lang,
                cmId:id
              });
            }else {
              await CmsService.featureCreate({
                title: cmsFeatures[i].title,
                description:cmsFeatures[i].description,
                image:cmsFeatures[i].image,
                lang:cmsFeatures[i].lang,
                cmId:id
              });
            }
          }
        }
        if (cmsPlans){
          for (let i in cmsPlans) {
            if(cmsPlans[i].id){
              await PlanService.update(cmsPlans[i].id,{
                title: cmsPlans[i].title,
                point1:cmsPlans[i].point1,
                point2:cmsPlans[i].point2,
                point3:cmsPlans[i].point3,
                point4:cmsPlans[i].point4,
                point5:cmsPlans[i].point5,
                point6:cmsPlans[i].point6,
                point7:cmsPlans[i].point7,
                point8:cmsPlans[i].point8,
                price:cmsPlans[i].price,
                lang:cmsPlans[i].lang,
                durationType:cmsPlans[i].durationType,
                cmId:id
              });
            }else {
            await PlanService.create({
              title: cmsPlans[i].title,
              description:cmsPlans[i].description,
              price:cmsPlans[i].price,
              lang:cmsPlans[i].lang,
              durationType:cmsPlans[i].durationType,
              cmId:id
            });
            }
          }
        }
        res.status(200).json({ success: true });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // featureUpdate
  static async featureUpdate(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await CmsService.featureUpdate(id, { ...rest });
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
  static async uploadImage(req, res) {
    const profileUrl = req.file?.location;
    if (!profileUrl) {
      res.status(500).json({
        success: false,
        message: "Request could not be processed.",
      });
    } else {
      res
          .status(200)
          .json({ success: true, message: "Profile image Uploaded.",Url:profileUrl });
    }
  }
  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CmsService.delete(id);
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
  // Delete
  static async featureDelete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await CmsService.featureDelete(id);
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
