// Package Imports
const { S3 } = require("@aws-sdk/client-s3");

class Storage {
  static init() {
    return new S3({ region: "us-east-1" });
  }
}

module.exports = Storage;
