import express from 'express';
import { createStar, viewStar } from '../controllers/start-controller.js';

const router = express.Router();

router.post('/feedback/:userId', createStar)
router.get('/view', viewStar)

export default router;