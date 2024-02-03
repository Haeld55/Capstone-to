import express from 'express'
import { createGcash, updateGcash, viewGcash } from '../controllers/gcash-controller.js';

const router = express.Router();

router.post('/gcash', createGcash)
router.put('/gcashU/:id', updateGcash)
router.get('/gcashV', viewGcash)

export default router;