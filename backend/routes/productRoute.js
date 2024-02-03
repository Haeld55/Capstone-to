import express from 'express'
import { addProduct, deleteProduct, getProduct, updateProduct, updateStock, viewProduct } from '../controllers/product-controller.js';

const router = express.Router();

router.post('/newProduct', addProduct)
router.get('/viewProduct', viewProduct)
router.put('/updateProduct/:id', updateProduct)
router.get('/getProduct', getProduct)
router.delete('/delete/:id', deleteProduct)
router.put('/updateStock/:productId', updateStock)

export default router;