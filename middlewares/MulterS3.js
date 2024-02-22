const multer = require("multer");
const multerS3 = require("multer-s3");
const Storage = require("../s3");

// Constants
const bucket = process.env.S3_BUCKET || "ezpick";

class MulterS3 {
  static studentUploader = null;
  static schoolUploader = null;
  static cmsUploader = null;
  static teacherUploader = null;
  static notificationUploader = null;

  init(s3) {
    MulterS3.studentUploader = multer({
      storage: multerS3({
        s3,
        bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname, mime: file.mimetype });
        },
        key: function (req, file, cb) {
          const fileNameSplit = file.originalname.split(".");
          const fileType = fileNameSplit[fileNameSplit.length - 1];
          const name = Date.now().toString() + "." + fileType;
          const path = "students/" + name;
          cb(null, path);
        },
      }),
    });

    MulterS3.schoolUploader = multer({
      storage: multerS3({
        s3,
        bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname, mime: file.mimetype });
        },
        key: function (req, file, cb) {
          const fileNameSplit = file.originalname.split(".");
          const fileType = fileNameSplit[fileNameSplit.length - 1];
          const name = Date.now().toString() + "." + fileType;
          const path = "schools/" + name;
          cb(null, path);
        },
      }),
    });
    MulterS3.cmsUploader = multer({
      storage: multerS3({
        s3,
        bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname, mime: file.mimetype });
        },
        key: function (req, file, cb) {
          const fileNameSplit = file.originalname.split(".");
          const fileType = fileNameSplit[fileNameSplit.length - 1];
          const name = Date.now().toString() + "." + fileType;
          const path = "cms/" + name;
          cb(null, path);
        },
      }),
    });
    MulterS3.teacherUploader = multer({
      storage: multerS3({
        s3,
        bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname, mime: file.mimetype });
        },
        key: function (req, file, cb) {
          const fileNameSplit = file.originalname.split(".");
          const fileType = fileNameSplit[fileNameSplit.length - 1];
          const name = Date.now().toString() + "." + fileType;
          const path = "teachers/" + name;
          cb(null, path);
        },
      }),
    });

    MulterS3.notificationUploader = multer({
      storage: multerS3({
        s3,
        bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname, mime: file.mimetype });
        },
        key: function (req, file, cb) {
          const fileNameSplit = file.originalname.split(".");
          const fileType = fileNameSplit[fileNameSplit.length - 1];
          const name = Date.now().toString() + "." + fileType;
          const path = "notifications/" + name;
          cb(null, path);
        },
      }),
    });

    return {
      studentUploader: MulterS3.studentUploader,
      schoolUploader: MulterS3.schoolUploader,
      cmsUploader: MulterS3.cmsUploader,
      teacherUploader: MulterS3.teacherUploader,
      notificationUploader: MulterS3.notificationUploader,
    };
  }

  getUploader() {
    if (MulterS3.uploader) return MulterS3.uploader;
    else {
      // Initialize S3 Bucket
      const s3 = Storage.init();
      return this.init(s3);
    }
  }
}

module.exports = MulterS3;
