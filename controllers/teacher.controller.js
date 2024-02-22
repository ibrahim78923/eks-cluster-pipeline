// Package Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const readline = require('readline');
const fs = require("fs");
const csv = require('csv-parser');
// Local Imports
const { hash } = require("../utils/bcrypt");
// Local Imports
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const { TeacherService, TeacherGradeService ,ClientService} = require("../services");
const  nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/sendEmail");
const { sendEmailTeacher } = require("../utils/sendEmailTeacher");

module.exports = class {

  // Update Password
  static async updatePassword(req, res) {
    const { id, newPassword, oldPassword } = req.body;

    const user = await TeacherService.getById(id);
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
    const passwordCheck = await TeacherService.getByColumnForLogin("password", oldPassword);
    if (passwordCheck.error) {
      res.status(200).json({
        success: false,
        message: "invalid credentials",
      });
      return;
    }

    const data = await TeacherService.update(id, {
      password: newPassword,
    });
    console.log(data)
    if (data.error) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true , message: "Password Updated successful." });
    }
  }
  // Update
  static async updateProfile(req, res) {
    const profileUrl = req.file.location;
    const { id } = req.body;
    if (id) {
      const data = await TeacherService.update(id, {
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
            .json({ success: true, message: "Profile image Uploaded.", url:profileUrl });
      }
    } else {
      console.log("Not Found");
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }
  }
  //login by email
  static async loginByEmail(req, res) {
    const { email,password } = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an email." });
      return;
    }



    // Fetch user with the email
    const userCheck = await TeacherService.getByColumn({ email: email });
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this User yet...",
      });
      return;
    }
    // Compare the passwords
    // const passwordCheck = await TeacherService.getByColumnForLogin("password", password);
    // if (passwordCheck.error) {
    //   res.status(200).json({
    //     success: false,
    //     message: "invalid credentials",
    //   });
    //   return;
    // }
    const [result] = userCheck.result;

    // Data to send as API response
    const response = {
      id: result.id,
      role: "TEACHER",
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
      role: "TEACHER",
      selectedGrades:result.selectedGrades,
      token,
    });
  }
  //login by email
  static async loginByEmailWebCallback(req, res) {
    const credentials = require('../credentials.json');
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
    const { code } = req.query;
    let email= '';
    if(code){
      try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Access Token:', tokens.access_token);
        oauth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        // Example: Retrieve the user's Gmail profile
        const promise = () => new Promise((resolve, reject)=> {
          gmail.users.getProfile({ userId: 'me' }, (err, res) => {
            if (err) {
              console.error('The API returned an error:', err);
              reject()
              return;
            }
            const profile = res.data;
            console.log('Email Address:', profile.emailAddress);
            resolve(profile)
          });
        })
        const profile = await promise();
        if(profile.emailAddress){
          console.log('kjdgdjfgsd')
          const userCheck = await TeacherService.getByColumn({ email: profile.emailAddress });
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
            role: "TEACHER",
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
            role: "TEACHER",
            token,
          });
        }
      } catch (error) {
        return res.status(401).json({ error: "User Not Found Or Not 553" });
      }
    }
  }
  //login by email
  static async verifyGoogleToken(req, res) {
    const { tokens }  = req.query;
    const { role }  = req.query;
    let userCheck='';
    let roleCheck='';
    try {
      // Verify the token is valid
      const  user  =   JSON.parse(Buffer.from(tokens.split('.')[1], 'base64').toString());
      const email =user.email
      if(email){
        if(role.includes("teacher")){
           userCheck = await TeacherService.getByColumn({ email: email });
          roleCheck='TEACHER';
        }
        if(role.includes("client")){
           userCheck = await ClientService.getByColumn("email", email);
          roleCheck='CLIENT';
        }
        console.log(roleCheck)
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
          role: roleCheck,
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
          role: roleCheck,
          token,
        });
      }
    } catch (error) {
      return res.status(401).json({ error: "User Not Found Or Not Authorized" });
    }
  }
  static async loginByEmailWeb(req, res) {
    const credentials = require('../credentials.json');
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly']
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    res.redirect(authUrl);

  }
  // Import
  static async import(req, res) {
    const {schoolId,clientId} = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];

    // Read the CSV file
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => { // Add async keyword here
          // Process the data from the CSV file

          // Remove the uploaded file
          fs.unlinkSync(req.file.path);

          // res.json({ message: 'File uploaded and processed successfully', data: results });
          let count = 0; // Initialize count to 0
          for (let i = 0; i < results.length; i++) {
            let teacher = undefined;
            if (!results[i].Email) {
              continue; // Skip this record if Guardian1Email is empty
            }
            const email = results[i].Email.trim();
            const existingUserCheck = await TeacherService.checkUser(clientId,email);
            if (existingUserCheck.error) {
              var length = 7,
                  charset = "0123456789",
                  password = "";
              for (var j = 0, n = charset.length; j < length; ++j) {
                password += charset.charAt(Math.floor(Math.random() * n));
              }
              teacher = {
                name: results[i].Name,
                nameAr: results[i].SecondaryName,
                gender: results[i].Gender,
                email: email,
                schoolId: schoolId,
                clientId:clientId,
                password:password,
                selectedGrades:req.body.grades
              };
              const data = await TeacherService.create(teacher);
              if (!data.error) {
                count++;
                const teacherId = data.result.id;
                const grades = JSON.parse(req.body.grades);
                for (let i in grades) {
                  const gradeId = grades[i];
                  await TeacherGradeService.create({ teacherId, gradeId });
                }
              }
            }
          }
          res.json({ success: true, message: count + ' Teachers imported successfully' });
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
    const user = await TeacherService.getById(id);

    if (user.error) {
      res.status(200).json({ success: false ,message:'User not found'});
      return;
    }else {
      const teacher = user.result;
      const DATA = {
        forget: teacher?.forget,
        forgetAt: teacher?.forgetAt,
      };
      res
          .status(200)
          .json({ success: true, data: DATA });
    }
  }
  // forgot pasword
  static async forgotPassword(req, res) {
    const { userName,email } = req.body;
    let data;
    if (userName || email) {
      if (email){
        data = await TeacherService.getByColumn({email:email});
      }
      else if (userName){
        data = await TeacherService.getByColumn({userName:userName});
      }
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // check email
        const teacher = data.result[0];
        if(teacher.email){
          // Data to send as API teacher
          const currentDate = new Date()
          const expiry = currentDate.setTime(currentDate.getTime() + (15 * 60 * 1000));
          const TOKEN_DATA = {
            id: teacher.id,
            role: 'TEACHER',
            expiry
          };
          // Generate JWT Token
          const token = jwt.sign(TOKEN_DATA, JWT_SECRET);

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
              to: teacher.email,
              subject: "Forgot Password ✔",
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
                                             src="${teacher.grades[0]?.school?.profileUrl}"
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
                                             Hi ${teacher.name?teacher.name:''},
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
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            const data = await TeacherService.update(teacher.id, {
              forgetAt: new Date().toLocaleString(),
              forget: false,
            });
            // Final teacher
            res.status(200).json({
              success: true,
              message: "Email Sent successfully",
            });
          } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({
              success: false,
              message: "An error occurred while sending the email.",
            });
          }
        }else {
          res
              .status(200)
              .json({ success: false, message: "Email Not Found." });
        }

      }
    } else {
      res
          .status(200)
          .json({ success: false, message: "teacher Not found" });
    }
  }


  // Login
  static async login(req, res) {
    const { username, email, password } = req.body;

    // Validate Email
    // if (!email || email.trim() === "") {
    //   res
    //       .status(400)
    //       .json({ success: false, message: "Please provide an email." });
    //   return;
    // }
// Validate username
    if (!username || username.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an username." });
      return;
    }

    // Validate Password
    if (!password || password.trim() === "") {
      res
          .status(400)
          .json({ success: false, message: "Please provide an password." });
      return;
    }

    // Fetch user with the email
    const userCheck = await TeacherService.getByColumn({username});
    if (userCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this username yet...",
      });
      return;
    }

    const [result] = userCheck.result;

    // Compare the passwords
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
      role: "TEACHER",
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
      role: "TEACHER",
      selectedGrades:result.selectedGrades,
      token,
    });
  }

  // Get All
  static async getAll(_, res) {
    const data = await TeacherService.getAll();
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, teachers: data.result });
    }
  }
// Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByclient({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getByClientWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByClientWeb({ clientId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By teacher id
  static async getStudent(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByGrade({ id: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, grades: data.students });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide school ID." });
    }
  }
  static async getBySchoolId(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByColumn({ schoolId: id });
      if (data.error) {
        res.status(200).json({ success: true, teachers: [] });
      } else {
        res.status(200).json({ success: true, teachers: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide school ID." });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, teacher: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get By Id
  static async getByIdWeb(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getByIdWeb(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, teacher: data.result });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email single
  static async sendEmail(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        const email = await sendEmailTeacher(data.result.email,'ezpick credentials',data.result.name,data.result.userName,data.result.password,data.result.grades[0].school.name,data.result.grades[0].school.profileUrl);
        res.status(200).json({ success: true, message: "Email Sent" });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email Bulk
  static async bulkSendEmail(req, res) {
    let count = 0;
    const { teacherIds } = req.body;
    if (teacherIds){
      for (let i in teacherIds) {
        const teacherId = teacherIds[i];
        if (teacherId) {
          const data = await TeacherService.getById(teacherId);
          if (!data.error) {
            //   res.status(200).json({success: false, message: "Not found."});
            // } else {
            const email = await sendEmailTeacher(data.result.email,'ezpick credentials',data.result.name,data.result.userName,data.result.password,data.result.grades[0].school.name,data.result.grades[0].school.profileUrl);
            count++
          }
        }
      }
      res.status(200).json({success: true, message: "Total Credentials "+ count+" Sent"});
    } else {
      res.status(400).json({ success: false, message: "Please provide an IDs." });
    }
  }

  // Create
  static async create(req, res) {
    const profileUrl = req.file.location;
    const { email, password, ...rest } = req.body;
    if (!email) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }
    const existingUserCheck = await TeacherService.getByColumn({ email });
    if (!existingUserCheck.error) {
      res.status(200).json({ success: false, message: "Email Already Registered." })
      return;
    }
    // const hashedPassword = await hash(password);
    const data = await TeacherService.create({ password: password,
      email,
      profileUrl,
      ...rest,
    });
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {

      const teacherId = data.result.id;
      //
      // for (let i in req.body.grades) {
      //   const gradeId = req.body.grades[i];
      //   await TeacherGradeService.create({ teacherId, gradeId });
      // }

      const { result } = await TeacherService.getById(teacherId);

      res.status(200).json({ success: true, teacher: result });
    }
  }
  // Create
  static async simpleCreate(req, res) {
    const { email, password,clientId, ...rest } = req.body;
    if (!email) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an email." });
      return;
    }
    const existingUserCheck = await TeacherService.getByColumn({ email,clientId });
    if (!existingUserCheck.error) {
      res.status(200).json({ success: false, message: "Email Already Registered." })
      return;
    }
    // const hashedPassword = await hash(password);
    const data = await TeacherService.create({ password: password,
      email,
      clientId,
      ...rest,
    });
    if (data.error) {
      res.status(500).json({ success: false, message: "Request could not be processed." });
    } else {

      const teacherId = data.result.id;

      for (let i in req.body.grades) {
        const gradeId = req.body.grades[i];
        await TeacherGradeService.create({ teacherId, gradeId });
      }

      const { result } = await TeacherService.getById(teacherId);

      res.status(200).json({ success: true, teacher: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, ...rest } = req.body;

    if (id) {
      const data = await TeacherService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        if(req.body.grades){
          const teachersGrades = await TeacherGradeService.delete(id);
          for (let i in req.body.grades) {
            const gradeId = req.body.grades[i];
            let teacherId =id
            await TeacherGradeService.create({ teacherId, gradeId });
          }
        }

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
      const data = await TeacherService.delete(id);
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
  // aliass token
  static async aliasToken(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await TeacherService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        // Data to send as API response
        const response = {
          id: data.result.clientId,
        };
        // Generate JWT Token
        const aliasToken = jwt.sign(response, JWT_SECRET);
        res.status(200).json({ success: true ,aliasToken:aliasToken});
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }

  }
};
