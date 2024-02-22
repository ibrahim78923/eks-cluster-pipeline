// Package Imports

// Local Imports
const { DashboardService } = require("../services");

module.exports = class {

  // dashBoard Api

  static async dashboard(req, res) {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;
    if (id && dateFrom && dateTo) {
      const data = await DashboardService.dashboard("clientId", id, dateFrom, dateTo);
      if (data.error) {
        res.status(200).json({ success: true, schools: [] });
      } else {
        res.status(200).json({ success: true, schools: data.result,
          grades: data.result1,
          teachers: data.result2,
          students: data.result3,
          parentsData:{parents: data.result4,
            androidDevices: data.result5, 
            iphoneDevices: data.result6, 
            emptydevice: data.result7
          },
          totalRequest:{requests: data.result8,
            sentRequests: data.result9,
            approveRequests: data.result10, 
            confirmRequests: data.result11
          },
          Weekly_Requests: data.per_day
        });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }

};
