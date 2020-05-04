import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isImage = /image\/(png|jpeg|jpg)/g.test(file.mimetype);
    if (isImage) cb(null, true);
    else cb(null, false);
  },
  limits: {
    fileSize: 2500000,
  },
}).single("image");
