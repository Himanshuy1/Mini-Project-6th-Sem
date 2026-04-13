import express from 'express';
import multer from 'multer';
import { getNews, refreshNews, verifyManualNews } from '../controllers/newsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getNews);
router.post('/refresh', refreshNews);
router.post('/verify', upload.single('image'), verifyManualNews);

export default router;
