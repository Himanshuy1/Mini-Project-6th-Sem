import { getHudData } from '../controllers/hudDataController.js';
import express from 'express';

const router = express.Router();

router.get('/data', getHudData);

export default router;
