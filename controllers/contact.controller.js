// Package Imports
const  nodemailer = require("nodemailer");
// Local Imports
const { ContactService } = require("../services");

module.exports = class {

  // Get All
  static async getAll(_, res) {
    const data = await ContactService.getAll();
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, contacts: data.result });
    }
  }
  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await ContactService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, contacts: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Create
  static async create(req, res) {
    const { email,name,schoolName,phone,message,comment } = req.body;
    const data = await ContactService.create({ email,name,schoolName,phone,message,comment, ...req.body });
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    }
    else {
      if (email) {
        //send email
        try {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
              user: 'ask@ezpick.co',
              pass: 'rRBQE8npvUVWhMfb',
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"EZPick" <ask@ezpick.co>',
            // to: 'bikerztest14@gmail.com',
            to: 'waqargill@gmail.com',
            subject: "Ezpick Customer",
            html: `
                <style>
                html,
                body {
                  margin: 0 auto !important;
                  padding: 0 !important;
                  height: 100% !important;
                  width: 100% !important;
                  background: #f1f1f1;
                }
              
                /* What it does: Stops Outlook from adding extra spacing to tables. */
                table,
                td {
                  mso-table-lspace: 0pt !important;
                  mso-table-rspace: 0pt !important;
                }
              
                /* What it does: Fixes webkit padding issue. */
                table {
                  border-spacing: 0 !important;
                  border-collapse: collapse !important;
                  table-layout: fixed !important;
                  margin: 0 auto !important;
                }
              </style>
              
              <!-- CSS Reset : END -->
              <div
                style="width: 100%; margin: 0 auto; background-color: #2f4d33"
                align="center"
              >
                <div style="padding-top: 40px; padding-bottom: 40px">
                  <div
                    style="
                      width: 93%;
                      margin: 0 auto;
                      padding-top: 0px;
                      background-color: #ffffff;
                      border-radius: 10px;
                      height: 90%;
                    "
                  >
                    <!-- BEGIN BODY -->
              
                    <table width="100%" style="background-color: #ffffff">
                      <tr>
                        <td align="center">
                          <tr>
                            <td align="center">
                              <p
                                style="
                                  text-align: center;
                                  color: #7f7f7f;
                                  font-family: Urbanist;
                                  font-size: 30px;
                                  font-style: normal;
                                  font-weight: 600;
                                  line-height: normal;
                                  letter-spacing: 1px;
                                  text-transform: capitalize;
                                  margin-top: 3%;
                                "
                              >
                                Customer Contact
                              </p>
                            </td>
                          </tr>
                          <td align="center">
                              <table>
                                  <tr>
                                    <td align="left">
                                      <p     
                                      style="
                                      text-align: start;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    ">
                                    Name:</p>
                                    </td>
                                    <td align="center">
                                      <p        
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    "> 
                                    ${name}</p>
                                    </td>
                                  </tr>
                    
                                  <tr>
                                    <td align="center">
                                      <p    
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    ">
                                    Email:</p>
                                    </td>
                                    <td align="center">
                                      <p    
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    "> ${email}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center">
                                      <p      
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    ">
                                    Phone:</p>
                                    </td>
                                    <td align="center">
                                      <p    
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    "> ${phone}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center">
                                      <p      
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    ">Comments:</p>
                                    </td>
                                    <td align="center">
                                      <p        
                                      style="
                                      text-align: left;
                                      color: #808080;
                                      font-family: Urbanist;
                                      font-size: 18px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: normal;
                                      letter-spacing: 1.92px;
                                      text-transform: capitalize;
                                      margin: 0;
                                    "> ${comment}</p>
                                    </td>
                                  </tr>
                                </table>
                          </td>
                          
              
                          <tr>
                            <td align="center">
                              <p
                                style="
                                  color: #808080;
                                  font-family: Urbanist;
                                  font-size: 20px;
                                  font-style: normal;
                                  font-weight: 500;
                                  line-height: normal;
                                  letter-spacing: 1.92px;
                                  text-transform: capitalize;
                                  margin-top: 1%;
                                  margin-bottom: 0%;
                                "
                              >
                                The Ezpick Team
                              </p>
                            </td>
                          </tr>
              
                          <tr>
                            <td align="center">
                              <img
                                src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679808272.png"
                                alt=""
                                style="width: 8%; margin-bottom: 5%;"
                              />
                            </td>
                          </tr>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

`, // html body
          });

          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
          console.error("Error sending email:", error);

        }
      }
      const { error, result } = await ContactService.getById(data.result.id);
      res.status(200).json({ success: true, contacts: result  });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await ContactService.update(id, { ...rest });
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
      const data = await ContactService.delete(id);
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
