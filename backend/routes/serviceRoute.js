import express from 'express';
import { allUpdate, dropUpdate, getService, specialUpdate, walkUpdate, washUpdate } from '../controllers/service-controller.js';

const router = express.Router();

// Define the route for updating the 'Wash&Dry' service cost
router.get('/wash', washUpdate);
router.get('/special', specialUpdate);
router.get('/walk', walkUpdate);
router.get('/drop', dropUpdate);
router.put('/update', allUpdate);
router.get('/addService', getService)

export default router;