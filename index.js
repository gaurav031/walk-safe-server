import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import url from 'url';
import 'dotenv/config';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';


// Get __dirname equivalent in ES modules
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

// Middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/posts', postRoutes);
app.use('/user', upload.single('picture'), userRoutes);


app.get('/', (req, res) => {
  res.send('App is running');
});

// Connect to MongoDB
const PORT =process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Handle unexpected errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
  mongoose.disconnect();
  process.exit(1);
});
