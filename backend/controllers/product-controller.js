import Product from '../models/productModel.js'


export const addProduct = async(req, res) => {
  try {
    const { productName, productPrice, productStock } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      productName,
      productPrice,
      productStock,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const viewProduct = async(req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const updateProduct = async(req, res) => {
  try {
    const productIdToUpdate = req.params.id;
    const { productPrice, productStock } = req.body;

    // Find the product by its _id
    const productToUpdate = await Product.findById(productIdToUpdate);

    if (!productToUpdate) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the values if provided in the request body

    if (productPrice !== undefined) {
      productToUpdate.productPrice = productPrice;
    }

    if (productStock !== undefined) {
      productToUpdate.productStock = productStock;
    }

    // Save the updated product
    const updatedProduct = await productToUpdate.save();

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by its ID and delete it
    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with a success message
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const updateStock = async (req, res) => {
  const { newQuantity } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Ensure the new quantity is a positive number
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Subtract newQuantity from the current stock
    product.productStock -= newQuantity;

    // Save the updated product
    await product.save();

    // Respond with the updated stock for confirmation
    res.json({ updatedStock: product.productStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};