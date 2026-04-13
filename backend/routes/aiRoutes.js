import express from 'express';
import { chatWithGrok } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithGrok);

export default router;
