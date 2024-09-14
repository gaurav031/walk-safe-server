import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/users.js';
import cloudinary from '../helper/cloudinaryconfig.js';


export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
      // Find user and check password in parallel
      const existingUser = await User.findOne({ email }).lean(); // `lean()` for faster read, no mongoose object methods
      if (!existingUser) {
          return res.status(404).json({ message: "User doesn't exist." });
      }

      // Compare password asynchronously
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid Credentials." });
      }

      // Sign JWT token
      const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          process.env.JWT_SECRET || 'test',  // Use a proper secret from env
          { expiresIn: "1h" }
      );

      res.status(200).json({ result: existingUser, token });
  } catch (error) {
      res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'Profile picture is required.' });
      }

      // Find if user already exists
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists.' });
      }

      // Hash password asynchronously with bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // Upload picture to cloudinary
      const picturePath = await cloudinary.uploader.upload(req.file.path, {
          folder: 'user_profiles', // You can add a folder to organize uploads
          quality: 'auto',  // Optimize image quality
      });

      // Create new user and save to DB
      const newUser = new User({
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          picturePath: picturePath.secure_url
      });

      const result = await newUser.save(); // Saving the new user

      // Generate JWT token
      const token = jwt.sign(
          { email: result.email, id: result._id },
          process.env.JWT_SECRET || 'test',
          { expiresIn: '1h' }
      );

      res.status(201).json({ result: result, token });
  } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Something went wrong!' });
  }
};



export const updateUser = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL
    const { name } = req.body;

    // Ensure picturePath is only set if a file is provided
    const picturePath = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : null;

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

