// Package Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local Imports
const { hash } = require("../utils/bcrypt");
const nodemailer = require("nodemailer");


// Local Imports
const { ParentService,StudentService } = require("../services");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
module.exports = class {
  // Update Password
  static async updatePassword(req, res) {
    const { id, newPassword, oldPassword } = req.body;

    const user = await ParentService.getById(id);
    if (user.error) {
      res.status(200).json({ success: false ,message:'User not found'});
      return;
    }
    if (!newPassword && newPassword.length==0) {
      res.status(200).json({ success: false ,message:' New password filed is missing'});
      return;
    }
    if (!oldPassword && oldPassword.length==0) {
      res.status(200).json({ success: false ,message:'Old password filed is missing'});
      return;
    }
    // validate old password
    const passwordCheck = await ParentService.getByColumnForLogin("password", oldPassword);
    if (passwordCheck.error) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }
    // const hashedPassword = await hash(newPassword);

    const data = await ParentService.update(id, {
      password: newPassword,
    });
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true ,message:'Password Update successful'});
    }
  }
  // forgot Password check
  static async forgotPasswordCheck(req, res) {
    const { id } = req.body;
    // Validate Username
    if (!id) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an Id." });
      return;
    }
    const user = await ParentService.getById(id);

    if (user.error) {
      res.status(200).json({ success: false ,message:'User not found'});
      return;
    }else {
      const parent = user.result;
      const DATA = {
        forget: parent?.forget,
        forgetAt: parent?.forgetAt,
      };
      res
          .status(200)
          .json({ success: true, data: DATA });
    }
  }
  static async forgotPassword(req, res) {
    const { userName,email } = req.body;
    let data;
    if (userName || email) {
      if (email){
         data = await ParentService.getByColumn("email", email);
      }
      else if (userName){
         data = await ParentService.getByColumn("userName", userName);
      }
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const parent = data.result[0];
        if(parent.email){
          // Data to send as API parent
          const currentDate = new Date()
          const expiry = currentDate.setTime(currentDate.getTime() + (15 * 60 * 1000));
          const TOKEN_DATA = {
            id: parent.id,
            role: 'PARENT',
            expiry
          };
          // Generate JWT Token
          const token = jwt.sign(TOKEN_DATA, JWT_SECRET);

          //send email

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'ask@ezpick.co', // generated ethereal user
              pass: 'rRBQE8npvUVWhMfb', // generated ethereal password
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"EZPick" < ask@ezpick.co>', // sender address
            to: parent.email, // list of receivers
            subject: "Forgot Password ✔", // Subject line
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
                  <div style="width: 100%;margin: 0 auto;background-color: #2f4d33;" align="center">
                     <div style="padding-top: 40px; padding-bottom: 40px;">
                        <div
                           style="width: 93%; margin: 0 auto; padding-top: 0px; background-color: #ffffff;border-radius: 10px;height: 90%;">
                           <!-- BEGIN BODY -->
                           <table width="100%" style="background-color: #ffffff; " align="center">
                           <tr>
                              <td>
                                 <!-- Nested table for background image -->
                                 <table
                                    align="center"
                                    >
                                    <tr style="">
                                       <td align="center">
                                          <img
                                             src="${parent.students[0]?.grade?.school?.profileUrl}"
                                             alt="school logo"
                                             style="margin-top: 8%; width: 50%;display:block;"
                                             />
                                          <!-- <img
                                             src=""
                                             alt=""
                                             width="700px"
                                             height="1px"
                                             /> -->
                                       </td>
                                    </tr>
                                    <tr style="margin: 0 auto">
                                       <td style="height: 30%; width: 100%" align="center">
                                          <!-- <img
                                             src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679900281.png"
                                             alt=""
                                             style="width: 50px;display: inline-block;margin-top:7%"
                                             /> -->
                                          <p style="display: inline-block; vertical-align: top;margin-top:65px"
                                             >
                                             <img
                                                src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1690107020703.png"
                                                alt=""
                                                style="width: 25%;"
                                                align="center"
                                                />
                                             <br />
                                             <span
                                                style="
                                                color: #2A7936;
                                                font-family: Urbanist;
                                                font-size: 28px;
                                                font-style: normal;
                                                font-weight: 600;
                                                line-height: normal;
                                                text-transform: uppercase;
                                                ;
                                                "
                                                >
                                             reset password
                                             </span>
                                          </p>
                                          <!-- <img
                                             src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679900281.png"
                                             alt=""
                                             style="width: 50px; display: inline-block;margin-top:5%"
                                             /> -->
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #2a7936;
                                             font-family: Urbanist;
                                             font-size: 25px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 2.64px;
                                             text-transform: capitalize;
                                             margin-top: 0px;
                                             "
                                             >
                                             Hi ${parent.name ? parent.name : ''},
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #000;
                                             font-family: Urbanist;
                                             font-size: 16px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             text-transform: uppercase;
                                             "
                                             >
                                             It seems you forgot your password!
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #878787;
                                             text-align: center;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 400;
                                             line-height: normal;
                                             letter-spacing: 1.68px;
                                             "
                                             >
                                             A request has been received to change the <br />
                                             password of your account.
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <button
                                             style="
                                             color: #fff;
                                             font-family: Urbanist;
                                             font-size: 23px;
                                             padding: 12px 20px 12px 20px;
                                             margin-top: 50px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 2.28px;
                                             text-transform: capitalize;
                                             border-radius: 25px;
                                             border: 0px solid;
                                             background: linear-gradient(
                                             51deg,
                                             rgba(42, 121, 54, 0.99) 0%,
                                             rgba(15, 176, 40, 0.99) 100%
                                             );
                                             ">
                                             <a style="color: white; text-decoration: none;" target="_blank" href="https://school.ezpick.co/reset-password?token=${token}">Reset Password</a>
                                          </button>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #8f8f8f;
                                             text-align: center;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 400;
                                             line-height: normal;
                                             letter-spacing: 1.74px;
                                             "
                                             >
                                             By clicking this link button, <br />
                                             you can reset your password.
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #888;
                                             font-family: Urbanist;
                                             font-size: 23px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             "
                                             >
                                             For any further queries, email us through this email
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #353cf4;
                                             font-family: Urbanist;
                                             font-size: 20px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 1.16px;
                                             text-decoration-line: underline;
                                             "
                                             >
                                             ask@ezpick.com
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #808080;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             text-transform: capitalize;
                                             "
                                             >
                                             Thank you,
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #808080;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             text-transform: capitalize;
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
                                             style="width: 20%; margin-bottom: 10%;margin-top:2%"
                                             />
                                       </td>
                                    </tr>
                                    </td>
                                 </table>
                        </div>
                     </div>
                  </div>
`, // html body
          });

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          const data = await ParentService.update(parent.id, {
            forgetAt: new Date().toLocaleString(),
            forget: false,
          });
          // Final parent
          res.status(200).json({
            success: true,
            message: "Email Sent successful",
          });
        }else {
          res
              .status(200)
              .json({ success: false, message: "Email Not Found." });
        }

      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "Parent Not found" });
    }
  }

  // Login
  static async loginByUsername(req, res) {
    const { username, password } = req.body;


    // Validate Username
    if (!username || username.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an username." });
      return;
    }

    // Validate Password
    if (!password || password.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an password." });
      return;
    }

    // Fetch user with the email
    const userCheck = await ParentService.getByColumnForLogin("userName", username);
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this User NAme yet...",
      });
      return;
    }

    const [result] = userCheck.result;

    // Compare the passwords
    // console.log(result.password)
    // const passwordCheck = await ParentService.getByColumnForLogin("password", password);
    if (result.password!=password) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }

    // Data to send as API response
    const response = {
      id: result.id,
      role: "PARENT",
      email: result.email,
      name: result.name,
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
      token,
    });
  }

  // verifyToken
  static async verifyToken(req, res) {
    const { token }  = req.body;
    try {
      // Verify the token is valid
      const  user  = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Authorized",
        data: user,
      });
    } catch (error) {
      return res.status(401).json({ error: "User Not Found Or Not Authorized" });
    }
  }
  static async loginByEmail(req, res) {
    const { email } = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }



    // Fetch user with the email
    const userCheck = await ParentService.getByColumn("email", email);
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this User yet...",
      });
      return;
    }

    const [result] = userCheck.result;

    // Data to send as API response
    const response = {
      id: result.id,
      role: "PARENT",
      email: result.email,
      name: result.name,
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
      token,
    });
  }
  // has email
  static async hasEmail(req, res) {
    const { userName } = req.params;

    if (userName) {
      const data = await ParentService.getByColumn("userName", userName);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const parent = data.result[0];
        res.status(200).json({ success: true, hasEmail: !!parent.email });
      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "Please provide an user name." });
    }
  }

  // Get All
  static async getAll(_, res) {
    const data = await ParentService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, parents: data.result });
    }
  }
  // Get By Id
  static async getById(req, res) {

    const { id } = req.params;

    if (id) {
      const data = await ParentService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, parent: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get By Id
  static async getAssistantById(req, res) {

    const { parentId } = req.params;
    if (parentId) {
      const data = await ParentService.getAssistantById(parentId);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, parent: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;
    const { role } = req.query;
    if (id ) {
      if (role){
        const data = await ParentService.getByColumnRoleBase(id,role);
        if (data.error) {
          res.status(200).json({ success: true, parents: [] });
        } else {
          res.status(200).json({ success: true, parents: data.result });
        }
      }else {
        const data = await ParentService.getByColumn("clientId", id);
        if (data.error) {
          res.status(200).json({ success: true, parents: [] });
        } else {
          res.status(200).json({ success: true, parents: data.result });
        }
      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Create
  static async create(req, res) {
    const { email } = req.body;

    const existingParentCheck = await ParentService.getByColumn("email", email);

    if (!existingParentCheck.error) {
      res.status(200).json({
        success: false,
        message: "Parent already exists with this email.",
      });
      return;
    }

    const data = await ParentService.create({ ...req.body });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, parent: data.result });
    }
  }
 // Create
  static async createGuardian(req, res) {
    const { studentIds,nationalId, } = req.body;
    const { result } = await ParentService.getByColumn("nationalId", nationalId);
    if (result) {
      res.status(200).json({
        success: false,
        message: "The provided national ID already exists in the system."
      });
      return;
    }
    const email = nationalId+'@gmail.com'
    const motherEmail = nationalId+'@gmail.com'
    const data = await ParentService.createGuardian({ ...req.body,email,motherEmail });

    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      const guardianId = data.result.id
      studentIds.map(async (item)=> {
        await ParentService.addPickUpGuardian(guardianId,item);
        // console.log(item)
      });
      const { result } = await ParentService.getByColumn("id", data.result.id);
      res.status(200).json({ success: true, guardian: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await ParentService.update(id, { ...rest });
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
  // updateGuardian
  static async updateGuardian(req, res) {
    const { id,studentIds, ...rest } = req.body;

    if (id) {
      const { data:data } = await ParentService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        const guardianId = data.id
        if(studentIds){
          await ParentService.deleteAssociated(guardianId);
          try {
            studentIds.map(async (item)=> {
              await ParentService.addPickUpGuardian(guardianId,item);
            });
          }catch (error){
            console.error('Error updates students:', error);
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

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await ParentService.delete(id);
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
  // deleteGuardian
  static async deleteGuardian(req, res) {
    const { id } = req.params;

    if (id) {
      const dataParent = await ParentService.delete(id);
      const dataStudent = await StudentService.deleteGuardianStudent(id);
      if (dataParent.error && dataStudent.error) {
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
