import express from "express";
import { loginPolice, registerPolice } from "../controllers/policeController.js";
import { getAllMissingPerson, registerMissingperson, toggleFound } from "../controllers/missingperson.js";
import { registerFir, updateCadre } from "../controllers/fir.js";
const router = express.Router();

router.post('/register',registerPolice);
router.post('/login',loginPolice);
router.post('/registermissing',registerMissingperson)
router.post('/registerfir',registerFir)
router.get('/getmissing',getAllMissingPerson)
router.put('/found/:id',toggleFound)
router.patch('/updateCadre/:id',updateCadre)
export default router;