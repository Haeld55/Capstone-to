import express from 'express';
import { addOrder, adminUpdateStatus, archieveOrder, monthly, newNote, reportFirstMonth, reportFirstWeek, reportList, sendSms, today, unArchieve, viewNote, viewUserOrder, viewUserOrderToday, viewsOrder, week } from '../controllers/userOrder-controller.js';

const router = express.Router();

router.post('/newOrder', addOrder)
router.post('/archieve/:orderId', newNote)
router.get('/viewArchive', viewNote)
router.get('/report', reportList)
router.get('/reportWeek', reportFirstWeek)
router.get('/reportMonth', reportFirstMonth)
router.get('/archived-orders/:userId', archieveOrder);
router.get('/viewsOrder', viewsOrder)
router.get('/viewUserOrder/:userId', viewUserOrder)
router.get('/viewToday/:userId', viewUserOrderToday)
router.put('/update/:orderId', adminUpdateStatus)
router.put('/unarchieve/:orderId', unArchieve)
router.post('/sms/:orderId', sendSms)
router.get('/today', today)
router.get('/week', week)
router.get('/month', monthly)

export default router;