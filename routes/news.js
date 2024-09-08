import express from 'express';
import { getNews } from '../controllers/news.js';
const router = express.Router();


// Route for fetching news
router.get('/news', getNews);


export default router;