import express from "express";
import multer from "multer";
import path from "path";
import { signin, signup, updateUser } from "../controllers/user.js";
import auth from "../middleware/auth.js";

// Create a new router instance
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directory where files will be stored
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// img filter
const isImage = (req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
      cb(null,true)
  }else{
      cb(new Error("only images is allow"))
  }
}


const upload = multer({
  storage:storage,
  fileFilter:isImage
})
// Define routes
router.post('/signin', signin);
router.post('/signup', upload.single("photo"), signup);
router.patch('/user/:id/update', auth, upload.single('picture'), updateUser);
export default router;
