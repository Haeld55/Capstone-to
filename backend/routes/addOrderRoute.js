import express from 'express'
import { chartDrop, chartWalk, createAddOrder, dateToday, deleteOrder, editOrder, monthly, reportFirstMonth, reportFirstWeek, reportList, today, totalCustomer, updateOrderStatus, viewAddOrder, viewArchive, viewProductOrder, walkArhive, walkUnarchive, week } from '../controllers/addOrder-controller.js';

const router = express.Router();

router.post('/addOrder', createAddOrder)
router.get('/viewOrder', viewAddOrder)
router.get('/archive', viewArchive)
router.put('/unarchive/:orderId', walkUnarchive)
router.post('/archiveU/:orderId', walkArhive)
router.put('/update/:id', updateOrderStatus)
router.get('/sample1/:userId', viewProductOrder)
router.put('/editOrder/:id', editOrder)
router.get('/date', dateToday)
router.delete('/deleteOrder/:id', deleteOrder)
router.get('/totalCounts', totalCustomer)
router.get('/walk', chartWalk)
router.get('/drop', chartDrop)
router.get('/report', reportList)
router.get('/week', reportFirstWeek)
router.get('/month', reportFirstMonth)
router.get('/today', today)
router.get('/weekly', week)
router.get('/monthly', monthly)

export default router;