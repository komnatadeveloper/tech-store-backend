const multer = require("multer");
const sharp = require("sharp");

// Check File Extension Using Multer Library
const fileCheck = multer({
  // dest: 'avatars',    // Using if we prefer to save on "dest":"avatars" folder
  limits: {
    fileSize: 1000000, // Unit : Byte
  },
  fileFilter(req, file, cb) {
    // with regular expression
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload a picture with .jgp, .jpeg or .png extension")
      );
    }

    cb(undefined, true);
  },
});

// Check File Extension Using Multer Library for update
const fileCheckForUpdate = multer({
  // dest: 'avatars',    // Using if we prefer to save on "dest":"avatars" folder
  limits: {
    fileSize: 1000000, // Unit : Byte
  },
  fileFilter(req, file, cb) {
    if (file) {
      // with regular expression
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(
          new Error(
            "Please upload a picture with .jgp, .jpeg or .png extension"
          )
        );
      }
    }

    cb(undefined, true);
  },
});

// Resize and Buffer By Sharp Library
const resizeFile = async (file, width, height) =>
  await sharp(file.buffer).resize({ width, height }).png().toBuffer();

module.exports = {
  fileCheck,
  resizeFile,
  fileCheckForUpdate,
};
