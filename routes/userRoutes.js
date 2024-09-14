import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { getAllMissingPerson } from "../controllers/missingperson.js";
import { getFir } from "../controllers/fir.js";

const router = express.Router();

// User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Missing person and FIR routes
router.get('/getmissing', getAllMissingPerson);
router.get('/getfir', getFir);

export default router;
