import asyncHandler from 'express-async-handler';
import generateToken from '../config/token.js';
import FirUser from '../models/firuser.js';
import bcrypt from 'bcryptjs';

// Registering a user
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, aadhar, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        res.status(400).json({ "error": "Please fill all the fields" });
        return;
    }

    // Checking if email is already registered
    const userExists = await FirUser.findOne({ email });
    if (userExists) {
        res.status(400).json({ "error": "User already registered" });
        return;
    }

    // Hash passwords
    const salt = bcrypt.genSaltSync(12);
    const user = new FirUser({
        name,
        email,
        aadhar,
        password: bcrypt.hashSync(password, salt),
        cpassword: bcrypt.hashSync(cpassword, salt)
    });

    const result = await user.save();

    // Registration is successful
    if (result) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            aadhar: user.aadhar,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ "error": "Failed to create user" });
    }
});

// Verifying a registered user (Login)
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const userFound = await FirUser.findOne({ email });
 
    if (!userFound) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify the password
    const isPasswordCorrect = bcrypt.compareSync(password, userFound.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    // Login is successful
    res.status(201).json({
        _id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        aadhar: userFound.aadhar,
        token: generateToken(userFound._id)
    });
});
