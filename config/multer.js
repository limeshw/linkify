import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "file-sharing-app",
    resource_type: "auto", // pdf, images, zip, etc
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname}`;
    },
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

export default upload;
