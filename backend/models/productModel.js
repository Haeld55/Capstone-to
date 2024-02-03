import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productStock: {
        type: Number,
        required: true,
    },
    userOrders: [
        {
            productName: {
                type: String, // Store the name of the product
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            quantity: {
                type: Number,
                default: 0,
            },
        }
    ],
    onsiteOrders: [
        {
            productName: {
                type: String, // Store the name of the product
            },
            onsite: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Walk',
            },
            quantity: {
                type: Number,
                default: 0,
            },
        }
    ],
});

const Product = mongoose.model('Product', productSchema);

export default Product;
