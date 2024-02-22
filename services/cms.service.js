// Package Imports

// Local Imports
const { db } = require("../database");
const { catchError } = require("../utils");
const { Op } = require("sequelize");
var moment = require("moment"); // require
const { sequelize } = require('../database');

module.exports = class {
  // Get By Id
  static getById = async (id) =>
    await catchError(async () => {
        const result = await db.cms.findByPk(id, {
            include: [
                { model: db.plans },
                { model: db.cmsFeatures }
            ]
        });
      if (result) return { result };
      else throw new Error();
    });

  static getByColumn = async (columnName, columnValue) =>
    await catchError(async () => {
      const data = await db.cms.findAll({
        where: { [columnName]: columnValue },
        order: [["createdAt", "DESC"]],
          include: [
              { model: db.plans },
              { model: db.cmsFeatures }
          ]
      });
      if (result) return { result };
      else throw new Error();
    });
  // get all
  static getAll = async () =>
    await catchError(async () => {
      const result = await db.cms.findAll({
        order: [["createdAt", "DESC"]],
          include: [
              { model: db.plans },
              { model: db.cmsFeatures }
          ]
      });
        if (result) {
            const customResponse = result.map((item) => {
                const {
                    id,
                    heroTitleBold,
                    heroText1,
                    heroText2,
                    heroButtonText,
                    heroVideoUrl,
                    securityAuthorizedSmallText,
                    securityAuthorizedBoldText,
                    securityAuthorizedDescription,
                    securityAuthorizedPoint1,
                    securityAuthorizedPoint2,
                    securityAuthorizedPoint3,
                    securityAuthorizedPoint4,
                    securityAuthorizedPoint5,
                    securityAuthorizedPoint6,
                    securityAuthorizedPoint7,
                    securityAuthorizedImageUrl,
                    RealTimeUpdatesSmallText,
                    RealTimeUpdatesBoldText,
                    RealTimeUpdatesDescription,
                    RealTimeUpdatesTextLineOne,
                    RealTimeUpdatesTextLineTwo,
                    RealTimeUpdatesImageUrl,
                    mobileAppHeading,
                    mobileAppDetail,
                    mobileAppImageUrl,
                    lang,
                    plans,
                    cmsFeatures,
                } = item;

                const heroSectionResponse = {
                    heroTitleBold,
                    heroText1,
                    heroText2,
                    heroButtonText,
                    heroVideoUrl,
                };

                const securitySectionResponse = {
                    securityAuthorizedSmallText,
                    securityAuthorizedBoldText,
                    securityAuthorizedDescription,
                    securityAuthorizedPoint1,
                    securityAuthorizedPoint2,
                    securityAuthorizedPoint3,
                    securityAuthorizedPoint4,
                    securityAuthorizedPoint5,
                    securityAuthorizedPoint6,
                    securityAuthorizedPoint7,
                    securityAuthorizedImageUrl,
                };

                const realTimeUpdatesSectionResponse = {
                    RealTimeUpdatesSmallText,
                    RealTimeUpdatesBoldText,
                    RealTimeUpdatesDescription,
                    RealTimeUpdatesTextLineOne,
                    RealTimeUpdatesTextLineTwo,
                    RealTimeUpdatesImageUrl,
                };

                const mobileAppSectionResponse = {
                    mobileAppHeading,
                    mobileAppDetail,
                    mobileAppImageUrl,
                };

                const plansResponse = plans.map((plan) => {
                    const {
                        id: id, // Include plan id
                        title,
                        point1,
                        point2,
                        point3,
                        point4,
                        point5,
                        point6,
                        point7,
                        point8,
                        price,
                        lang,
                        durationType,
                    } = plan;
                    return {
                        id: id,
                        title,
                        point1,
                        point2,
                        point3,
                        point4,
                        point5,
                        point6,
                        point7,
                        point8,
                        price,
                        lang,
                        durationType,
                    };
                });

                const cmsFeaturesResponse = cmsFeatures.map((feature) => {
                    const {
                        id: id, // Include feature id
                        title,
                        description,
                        imageUrl,
                        lang,
                    } = feature;
                    return {
                        id: id,
                        title,
                        description,
                        imageUrl,
                        lang,
                    };
                });

                // Combine all the responses into a final response object for the current item
                const finalItemResponse = {
                    id,
                    lang,
                    heroSection: heroSectionResponse,
                    securitySection: securitySectionResponse,
                    realTimeUpdatesSection: realTimeUpdatesSectionResponse,
                    mobileAppSection: mobileAppSectionResponse,
                    plans: plansResponse,
                    cmsFeatures: cmsFeaturesResponse,

                };

                return finalItemResponse;
            });

            return { result: customResponse };
        } else {
            throw new Error();
        }
    });
  // get all By language
  static getAllByLang = async (lang) =>
    await catchError(async () => {
      const result = await db.cms.findAll({
        order: [["createdAt", "DESC"]],
          where: { lang: lang },
          include: [
              { model: db.plans ,where: { lang: lang }},
              { model: db.cmsFeatures,where: { lang: lang } }
          ]
      });
        if (result) {
            const customResponse = result.map((item) => {
                const {
                    id,
                    heroTitleBold,
                    heroText1,
                    heroText2,
                    heroButtonText,
                    heroVideoUrl,
                    securityAuthorizedSmallText,
                    securityAuthorizedBoldText,
                    securityAuthorizedDescription,
                    securityAuthorizedPoint1,
                    securityAuthorizedPoint2,
                    securityAuthorizedPoint3,
                    securityAuthorizedPoint4,
                    securityAuthorizedPoint5,
                    securityAuthorizedPoint6,
                    securityAuthorizedPoint7,
                    securityAuthorizedImageUrl,
                    RealTimeUpdatesSmallText,
                    RealTimeUpdatesBoldText,
                    RealTimeUpdatesDescription,
                    RealTimeUpdatesTextLineOne,
                    RealTimeUpdatesTextLineTwo,
                    RealTimeUpdatesImageUrl,
                    mobileAppHeading,
                    mobileAppDetail,
                    mobileAppImageUrl,
                    lang,
                    plans,
                    cmsFeatures,
                } = item;

                const heroSectionResponse = {
                    heroTitleBold,
                    heroText1,
                    heroText2,
                    heroButtonText,
                    heroVideoUrl,
                };

                const securitySectionResponse = {
                    securityAuthorizedSmallText,
                    securityAuthorizedBoldText,
                    securityAuthorizedDescription,
                    securityAuthorizedPoint1,
                    securityAuthorizedPoint2,
                    securityAuthorizedPoint3,
                    securityAuthorizedPoint4,
                    securityAuthorizedPoint5,
                    securityAuthorizedPoint6,
                    securityAuthorizedPoint7,
                    securityAuthorizedImageUrl,
                };

                const realTimeUpdatesSectionResponse = {
                    RealTimeUpdatesSmallText,
                    RealTimeUpdatesBoldText,
                    RealTimeUpdatesDescription,
                    RealTimeUpdatesTextLineOne,
                    RealTimeUpdatesTextLineTwo,
                    RealTimeUpdatesImageUrl,
                };

                const mobileAppSectionResponse = {
                    mobileAppHeading,
                    mobileAppDetail,
                    mobileAppImageUrl,
                };

                const plansResponse = plans.map((plan) => {
                    const {
                        id: id, // Include plan id
                        title,
                        point1,
                        point2,
                        point3,
                        point4,
                        point5,
                        point6,
                        point7,
                        point8,
                        price,
                        lang,
                        durationType,
                    } = plan;
                    return {
                        id: id,
                        title,
                        point1,
                        point2,
                        point3,
                        point4,
                        point5,
                        point6,
                        point7,
                        point8,
                        price,
                        lang,
                        durationType,
                    };
                });

                const cmsFeaturesResponse = cmsFeatures.map((feature) => {
                    const {
                        id: id, // Include feature id
                        title,
                        description,
                        imageUrl,
                        lang,
                    } = feature;
                    return {
                        id: id,
                        title,
                        description,
                        imageUrl,
                        lang,
                    };
                });

                // Combine all the responses into a final response object for the current item
                const finalItemResponse = {
                    id,
                    lang,
                    heroSection: heroSectionResponse,
                    securitySection: securitySectionResponse,
                    realTimeUpdatesSection: realTimeUpdatesSectionResponse,
                    mobileAppSection: mobileAppSectionResponse,
                    plans: plansResponse,
                    cmsFeatures: cmsFeaturesResponse,

                };

                return finalItemResponse;
            });

            return { result: customResponse };
        } else {
            throw new Error();
        }
    });
  // Create
  static create = async (data) =>
    await catchError(async () => {
      const result = await db.cms.create(data);
      return { result };
    });
  static featureCreate = async (data) =>
    await catchError(async () => {
      const result = await db.cmsFeatures.create(data);
      return { result };
    });
  // Update
  static update = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.cms.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });// Update
  static featureUpdate = async (id, data) =>
    await catchError(async () => {
      const affectedRows = await db.cmsFeatures.update(data, { where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });

  // Delete
  static delete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.cms.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
  static featureDelete = async (id) =>
    await catchError(async () => {
      const affectedRows = await db.cmsFeatures.destroy({ where: { id } });
      if (affectedRows == 1) return { result: true };
      else throw new Error();
    });
};
