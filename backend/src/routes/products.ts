import express from "express";
import multer from "multer";

const router = express.Router();

const FILE_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination(_req, file, callback) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    const uploadError = isValid ? null : new Error("Invalid image type"); // If it returns null proceed with upload others wise pass it to the error handler middleware
    callback(uploadError, "public/uploads"); // This folder should be present, multer will not create it automatically
  },
  filename(_req, file, callback) {
    const filename = file.originalname.split(" ").join("-").split(".")[0];
    const extension = FILE_TYPE_MAP[file.mimetype];
    callback(null, `${filename}-${Date.now()}.${extension}`);
  },
});

export default router;
