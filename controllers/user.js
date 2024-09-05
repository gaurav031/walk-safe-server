import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/users.js'; 

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const picturePath = req.file?.filename; // Ensure that req.file is available

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            picturePath, // Save image path in the database
        });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
};



export const updateUser = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL
    const { name } = req.body;

    // Ensure picturePath is only set if a file is provided
    const picturePath = req.file ? `/images/${req.file.filename}` : null;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No user exists with id: ${id}`);
    }

    try {
        // Prepare update object dynamically
        const updateFields = {};
        if (name) updateFields.name = name;
        if (picturePath) updateFields.picturePath = picturePath;

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error); // Log error for server-side debugging
        res.status(500).json({ message: "Error updating user." });
    }
};

