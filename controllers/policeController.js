import asyncHandler from 'express-async-handler';
import generateToken from '../config/token.js';
import Police from '../models/police.js';
import bcrypt from 'bcryptjs';

// Registering a police officer
export const registerPolice = asyncHandler(async (req, res) => {
    const { name, email, serviceNumber, rank, password, cpassword } = req.body;

    // Validate required fields
    if (!name || !email || !serviceNumber || !rank || !password || !cpassword) {
        res.status(400).json({ "error": "Please fill all the fields" });
        return;
    }

    // Check if email is already registered
    const policeExists = await Police.findOne({ email });
    if (policeExists) {
        res.status(400).json({ "error": "Police officer already registered" });
        return;
    }

    // Hash the password before saving
    const salt = bcrypt.genSaltSync(12);
    const police = new Police({
        name,
        email,
        serviceNumber,
        rank,
        password: bcrypt.hashSync(password, salt),
        cpassword: bcrypt.hashSync(cpassword, salt)
    });

    // Save the police officer record
    const result = await police.save();

    // If registration is successful
    if (result) {
        res.status(201).json({
            _id: police._id,
            name: police.name,
            email: police.email,
            serviceNumber: police.serviceNumber,
            rank: police.rank,
            token: generateToken(police._id)
        });
    } else {
        res.status(400).json({ "error": "Failed to create police officer" });
    }
});

// Verifying a registered police officer (Login)
export const loginPolice = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if the police officer exists
    const policeFound = await Police.findOne({ email });

    if (!policeFound) {
        res.status(400).json({ "error": "Invalid credentials" });
        return;
    }

    // Verify password
    const isPasswordCorrect = bcrypt.compareSync(password, policeFound.password);
    if (isPasswordCorrect) {
        res.status(200).json({
            _id: policeFound._id,
            name: policeFound.name,
            email: policeFound.email,
            serviceNumber: policeFound.serviceNumber,
            rank: policeFound.rank,
            token: generateToken(policeFound._id),
        });
    } else {
        res.status(400).json({ "error": "Invalid credentials" });
    }
});
