// Package Imports
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require('csv-parser');
const upload = multer({ dest: "uploads/" });
const bodyParser = require('body-parser')
const { sendEmail } = require("../utils/sendEmail");
const { sendEmailParent } = require("../utils/sendEmailParent");
// Local Imports
const { StudentService, ParentService,ClientService } = require("../services");
module.exports = class {
  // Get All
  static async getAll(_, res) {
    const data = await StudentService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true, students: data.result });
    }
  }
  // Get By Id
  static async getByClient(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByClient("clientId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  // Get By Id
  static async getByGrade(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByColumn("gradeId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide client ID." });
    }
  }
  static async getByParent(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByColumn("parentId", id);
      if (data.error) {
        res.status(200).json({ success: true, students: [] });
      } else {
        res.status(200).json({ success: true, students: data.result });
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
      const data = await StudentService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, student: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }
  // Get studentId
  static async getTeacherId(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getId(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, result: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // addSibling
  static async addSibling(req, res) {
    // first search the parent based on the email and phone no
    const { email, phoneNo, parentId: parentIdFromReq } = req.body;
    // const profileUrl = req.file.location;
    console.log(email);

    let parentId = undefined;

    if (!parentIdFromReq) {
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Please provide parent email.",
        });
        return;
      }

      const existingParentCheck = await ParentService.getByColumn(
        "email",
          email
      );

      if (!existingParentCheck.error) {
        parentId = existingParentCheck.result[0].id;
      } else {
        const newParent = {
          email: email,
        };

        if (phoneNo) newParent.phoneNo = phoneNo;

        const parentAddition = await ParentService.create(newParent);
        if (parentAddition.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        }
        parentId = parentAddition.result.id;
      }
    } else {
      parentId = parentIdFromReq;
    }

    const data = await StudentService.create({ ...req.body, parentId });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { result } = await StudentService.getById(data.result.id);
      await ParentService.addPickUpGuardian(parentId,data.result.id);
      res.status(200).json({ success: true, student: result });
    }
  }
  // Create
  static async create(req, res) {
    // first search the parent based on the email and phone no
    // const profileUrl = req.file.location;
    // console.log(profileUrl)
    const { email, phoneNo,motherEmail,clientId, parentId: parentIdFromReq } = req.body;
      if (!clientId) {
        res.status(400).json({
          success: false,
          message: "Please provide client Id .",
        });
        return;
      }
    if (clientId) {
      const client = await ClientService.getById(clientId);
      const {count} = await StudentService.countStudentByClient(clientId);
      console.log('count',count)
      console.log('client?.result?.plan?.noOfStudent',client?.result?.plan?.noOfStudent)
      if (count  >= client?.result?.plan?.noOfStudent  ) {
        res.status(200).json({ success: false, message: 'You have exceeded the limits of your current plan. Please consider upgrading your plan to continue.' });
        return
      }
    }
    let parentId = undefined;

    if (!parentIdFromReq) {
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Please provide parent email.",
        });
        return;
      }

      const existingParentCheck = await ParentService.checkEmail(clientId,email);

      if (!existingParentCheck.error) {
        parentId = existingParentCheck.result[0].id;
        res.status(200).json({ success: false, message: "Student Already exits against this Parent Email, if you want to add Sibling please on the Switch!", student: existingParentCheck });
        return;
      } else {
        const newParent = {
          clientId: clientId,
          email: email,
          motherEmail:motherEmail,
          role:'parent'
        };

        if (phoneNo) newParent.phoneNo = phoneNo;

        const parentAddition = await ParentService.create(newParent);
        if (parentAddition.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
          return;
        }
        parentId = parentAddition.result.id;
      }
    } else {
      parentId = parentIdFromReq;
    }

    // const data = await StudentService.create({ ...req.body, parentId,profileUrl });
    const data = await StudentService.create({ ...req.body, parentId });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      const { result } = await StudentService.getById(data.result.id);
      await ParentService.addPickUpGuardian(parentId,data.result.id);
      res.status(200).json({ success: true,message: "Student created!", student: result });
    }
  }

  // Update
  static async update(req, res) {
    const { id, email,parentId,phoneNo,password,name,gradeId,motherEmail,gender,schoolId,nameAr,isSibling,clientId} = req.body;
    console.log(req.body)
    let setParentId = undefined;
    if (email) {
      const existingParentCheck = await ParentService.checkEmail(clientId,email);
      if(!existingParentCheck.error){
        setParentId = existingParentCheck?.result[0].id;
      }
      if (!existingParentCheck.error && !isSibling){
        if (existingParentCheck.result[0].id != parentId) {
          res.status(200).json({ success: false, message: "Student Already exits against this Parent Email, if you want to add Sibling please on the Switch!", student: existingParentCheck });
          return;
        }
      }
    }
    if (id &&  parentId ) {
      if (isSibling) {
        const data = await StudentService.update(id, {
          nameAr: nameAr,
          name: name,
          schoolId:schoolId,
          gradeId:gradeId,
          gender:gender,
          parentId:setParentId
        });
        await ParentService.addPickUpGuardian(setParentId,id);
        const parentdata = await ParentService.update(setParentId, {
          password: password,
          phoneNo: phoneNo,
          email:email,
          motherEmail:motherEmail
        });
        if (data.error && parentdata.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
        } else {
          res.status(200).json({ success: true });
        }
      }else {
        const data = await StudentService.update(id, {
          nameAr: nameAr,
          name: name,
          schoolId:schoolId,
          gradeId:gradeId,
          gender:gender
        });
        const parentData = await ParentService.update(parentId, {
          password: password,
          phoneNo: phoneNo,
          email:email,
          motherEmail:motherEmail
        });
        if (data.error && parentData.error) {
          res.status(500).json({
            success: false,
            message: "Request could not be processed.",
          });
        } else {
          res.status(200).json({ success: true });
        }
      }

    }
    else
    {
      res
          .status(400)
          .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Update
  static async updateProfile(req, res) {
    const profileUrl = req.file.location;
    const { id } = req.body;
    if (id) {
      const data = await StudentService.update(id, {
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
          .json({ success: true, message: "Profile image Uploaded.", url:profileUrl  });
      }
    } else {
      console.log("Not Found");
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }
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
          const batchSize = 100; // Set the batch size according to your needs

          let count = 0; // Initialize count to 0
          const DATA = {
            newStudents: [],
            existingUsers: [], // Array to store existing users found in your system
            duplicates: [], // Array to store duplicate rows in the files
            invalidData: [], // Array to store invalid rows with invalid emails
            totalImportedLength: results.length,
          };

          const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

          async function processBatch(batch) {
            // Process and insert the batch into the database
            // Implement your database-specific batch insert logic here
            // This will depend on the database library you are using
            const insertResults = await Promise.all(batch.map(async (result) => {
              const guardian1Email = result.Guardian1Email.trim();

              // Check for duplicates in the current batch
              const isDuplicateInBatch = batch.some((item) => item !== result && item.Guardian1Email.trim() === guardian1Email);

              if (isDuplicateInBatch) {
                DATA.duplicates.push(result); // Add the duplicate row to the duplicates array
                return null; // Return null for duplicate rows
              }

              if (!emailPattern.test(guardian1Email)) {
                DATA.invalidData.push(result); // Add the row with an invalid email to the invalidData array
                return null; // Return null for rows with invalid emails
              }

              const existingParentCheck = await ParentService.checkUser(clientId, guardian1Email);

              if (existingParentCheck.error) {
                // Record not found in the system, insert it
                const newParent = {
                  email: guardian1Email,
                  phoneNo: result.Guardian1Mobile,
                  nationalId: result.Guardian1GovernmentID,
                  name: result.Guardian1Name,
                  motherEmail: result.Guardian2Email.trim(),
                  clientId: clientId,
                  role: 'parent',
                };

                const parentAddition = await ParentService.create(newParent);

                if (!parentAddition.error) {
                  const parentId = parentAddition.result.id;
                  const student = {
                    name: result.StudentName,
                    nameAr: result.SecondaryName,
                    gender: result.Gender,
                    gradeId: result.gradeId,
                    parentId: parentId,
                    schoolId: schoolId,
                    clientId: clientId,
                  };

                  const data = await StudentService.create(student);
                  await ParentService.addPickUpGuardian(parentId, data.result.id);

                  if (!data.error) {
                    count++;
                    return data.result;
                  }
                }
              } else {
                // Record found in the system, add it to the existingUsers array
                DATA.existingUsers.push(existingParentCheck.result);
              }

              return null; // Return null for unsuccessful inserts
            }));

            // Filter out null results (failed inserts) and add the successful ones to DATA
            DATA.newStudents.push(...insertResults.filter((result) => result !== null));
          }

          async function processData() {
            let batch = [];

            for (let i = 0; i < results.length; i++) {
              const result = results[i];

              if (!result || !result.Guardian1Email || !result.Guardian1Email.trim()) {
                // Skip this record if Guardian1Email is empty or undefined
                DATA.invalidData.push(result);
                continue;
              }

              if (!emailPattern.test(result.Guardian1Email.trim())) {
                DATA.invalidData.push(result); // Add the row with an invalid email to the invalidData array
                continue; // Skip the row with an invalid email
              }

              // Check for duplicates in the current batch
              const isDuplicateInBatch = batch.some((item) => item !== result && item.Guardian1Email.trim() === result.Guardian1Email.trim());

              if (isDuplicateInBatch) {
                DATA.duplicates.push(result); // Add the duplicate row to the duplicates array
                continue; // Skip the duplicate row
              }

              // Add the record to the current batch
              batch.push(result);

              if (batch.length >= batchSize || i === results.length - 1) {
                // If batch size is reached or it's the last record, process the batch
                await processBatch(batch);
                batch = []; // Clear the batch for the next set of records
              }
            }

            res.json({ success: true, message: DATA });
          }

          processData();

        });
  }


  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.delete(id);
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
  // Send email single
  static async sendEmail(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await StudentService.getByIdComplete(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        const emailFather = await sendEmailParent(data.result.parent.email, 'ezpick credentials',data.result.name,data.result.parent.id,data.result.parent.password,data.result.grade.school?.name,data.result.grade.school?.profileUrl)
        const emailMother = await sendEmailParent(data.result.parent.motherEmail, 'ezpick credentials',data.result.name,data.result.parent.id,data.result.parent.password,data.result.grade.school?.name,data.result.grade.school?.profileUrl);
        var dateTime = new Date();
        const parentdata = await ParentService.update(data.result.parent.id, {
          credentialSentAt:dateTime.toString()
        });
        res.status(200).json({ success: true, message: "Email Sent" });
      }
    } else {
      res.status(400).json({ success: false, message: "Please provide an ID." });
    }
  }
  // Send email Bulk
  static async bulkSendEmail(req, res) {
    let count=0;
    const gradeIds  = req.body;
    if (gradeIds){
      for (let i in gradeIds) {
        const gradeId = gradeIds[i];
        if (gradeId) {
          const data = await StudentService.getByColumn("gradeId", gradeId);
          const student= data.result;
          if (data.error) {
            res.status(200).json({success: false, message: "Not found."});
          } else {
            let j = 0; const iMax = student.length;
            for(j ; j < iMax; j++) {
              if(student[j].parent.email){
                const emailFather = await sendEmailParent(student[j].parent.email, 'ezpick credentials',student[j].name,student[j].parent.id,student[j].parent.password,student[j].grade.school.name,student[j].grade.school.profileUrl);
                const emailMother = await sendEmailParent(student[j].parent.motherEmail, 'ezpick credentials',student[j].name,student[j].parent.id,student[j].parent.password,student[j].grade.school.name,student[j].grade.school.profileUrl);
                var dateTime = new Date();
                const parentdata = await ParentService.update(student[j].parent.id, {
                  credentialSentAt:dateTime.toString()
                });
              }
            }
            count++
          }
        }
      }
      res.status(200).json({success: true, message: "Successfully Sent"});
    } else {
      res.status(400).json({ success: false, message: "Please provide an IDs." });
    }
  }
  // promoteStudent
  static async promoteStudent(req, res) {
    const { gradeId } = req.params;
    const { schoolId } = req.query;
    const { promotedSchoolId } = req.query;
    const { promotedGradeId } = req.query;
    let { students }  = req.query;
     students = JSON.parse(students);
    if (students.length > 0) {
      students.map(async (item)=> {
        const data = await StudentService.update(item, {
          schoolId:promotedSchoolId,
          gradeId:promotedGradeId
        });
        // console.log(item)
      });
      res.status(200).json({ success: true });
    }else {
      res.status(200).json({ success: false });
    }
  }

};
