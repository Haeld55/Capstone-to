import express from 'express';
import { forgetPass, google, role, signOut, signin, signup, verifyForgetPass, viewUser } from '../controllers/auth-controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)
router.post('/forget', forgetPass)
router.post('/reset-password/:token', verifyForgetPass)
router.put('/role/:orderId', role)
router.get('/viewTO', viewUser)

export default router;