const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });





const storageTemplate = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/assets"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9) + "_" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueSuffix);
  },
});

const uploadTemplate = multer({ storage: storageTemplate });





module.exports = { upload, uploadTemplate };
