import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InventoryData() {
      const [productName, setProductName] = useState('');
      const [productPrice, setProductPrice] = useState('');
      const [productStock, setProductStock] = useState('');
      const [productId, setProductId] = useState('');
      const [newProductPrice, setNewProductPrice] = useState('');
      const [newProductStock, setNewProductStock] = useState('');
      const [products, setProducts] = useState([]);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    
      const fetchProducts = async () => {
        try {
          const response = await axios.get('/api/product/getProduct');
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      };
    
      useEffect(() => {
        fetchProducts();
    
        const intervalId = setInterval(() => {
          fetchProducts();
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);
    
      const handleUpdateProduct = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.put(`/api/product/updateProduct/${selectedProductId}`, {
            productPrice: selectedProductPrice,
            productStock: selectedProductStock,
          });
      
      
          // Clear the selected product information after the update
          setSelectedProductId('');
          setSelectedProductPrice('');
          setSelectedProductStock('');
      
          fetchProducts(); // Assuming fetchProducts is a function to refresh the product list
      
          // Display success toast
          toast.success('Product updated successfully', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => setIsUpdateVisible(false), // Hide the update section after the toast is closed
          });
        } catch (error) {
          console.error('Error updating product:', error);
        }
      };
      
      
    
      const handleDeleteClick = (product) => {
        setSelectedProduct(product);
      };
    
      const handleConfirmDelete = async () => {
        try {
          if (!selectedProduct) {
            console.error('No product selected for deletion');
            return;
          }
      
          const productIdToDelete = selectedProduct._id;
          await axios.delete(`/api/product/delete/${productIdToDelete}`);
      
          setSelectedProduct(null);
          fetchProducts();
      
          // Display success toast
          toast.success('Product deleted successfully', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
      
    
      const handleCancelDelete = () => {
        setSelectedProduct(null);
      };
    
      const validateProductName = (name) => {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
      };

      const handleAddProduct = async (e) => {
        e.preventDefault();
      
        try {
          if (!validateProductName(productName)) {
            // Display error toast for invalid productName
            toast.error('Product name can only contain letters, numbers, and spaces', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
      
            // Reset or clear the form
            setProductName('');
            setProductPrice('');
            setProductStock('');
      
            return;
          }
      
          const response = await axios.post('/api/product/newProduct', {
            productName,
            productPrice,
            productStock,
          });
      
      
          // Clear the form
          setProductName('');
          setProductPrice('');
          setProductStock('');
      
          fetchProducts();
      
          // Display success toast
          toast.success('Success Added Product!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } catch (error) {
          console.error('Error adding product:', error);
        }
      };
      

      const [selectedProductId, setSelectedProductId] = useState('');
      const [selectedProductPrice, setSelectedProductPrice] = useState('');
      const [selectedProductStock, setSelectedProductStock] = useState('');

      const handleTableRowClick = (product) => {
        setSelectedProductId(product._id);
        setSelectedProductPrice(product.productPrice);
        setSelectedProductStock(product.productStock);
        setIsUpdateVisible(true)
      };
  return (
    <div>
        <div className="p-[25px] mt-5 mb-5">
            <h1 className='font-bold uppercase text-2xl text-gray-600'>Inventory</h1>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 items-center justify-center">
            <div className="flex flex-col lg:flex-row justify-center items-center my-10 gap-5">
                {!isUpdateVisible && (
                  <div className="">
                      <form onSubmit={handleAddProduct} className='flex flex-col gap-3 items-start justify-center'>
                          <div className="grid grid-cols-1 grid-rows-4 gap-3 justify-center items-center">
                              <h1 className='font-bold uppercase text-gray-500 text-xl mb-3'>Add Product</h1>
                              <label
                              htmlFor="Product Name"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                              >
                              <input
                                  type="text"
                                  value={productName}
                                  onChange={(e) => setProductName(e.target.value)}
                                  className="peer border-none btn-md bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                  placeholder="Product Name"
                              />

                              <span
                                  className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                                  Product Name
                              </span>
                              </label>

                              <label
                              htmlFor="Product Price"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                              >
                              <input
                                  type="number"
                                  value={productPrice}
                                  min={0}
                                  max={100}
                                  onChange={(e) => setProductPrice(e.target.value)}
                                  className="peer border-none btn-md btn-wide bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                  placeholder="Product Price"
                              />

                              <span
                                  className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                                  Product Price
                              </span>
                              </label>

                              <label
                              htmlFor="Product Stock"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                              >
                              <input
                                  type="number"
                                  value={productStock}
                                  min={0}
                                  max={100}
                                  onChange={(e) => setProductStock(e.target.value)}
                                  className="peer border-none btn-md btn-wide bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                  placeholder="Product Stock"
                              />

                              <span
                                  className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                                  Product Stock
                              </span>
                              </label>
                              <button type="submit" className='btn btn-outline btn-info'>Add Product</button>
                          </div>
                      </form>
                  </div>
                )}
                {isUpdateVisible && (
                  <div className="flex flex-col gap-8">
                          <h2 className='font-bold text-xl capitalize text-gray-500'>Product Update</h2>
                      <div className='flex flex-col gap-3 items-start justify-center'>
                          <label
                              htmlFor="ProductID"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                          >
                              <input
                                type="text"
                                id="ProductID"
                                className="peer border-none btn-wide btn-md bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Product ID"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                              />

                              <span
                              className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                              Product ID
                              </span>
                          </label>

                          <form onSubmit={handleUpdateProduct} className='flex flex-col gap-3'>
                              <label
                              htmlFor="ProductPrice"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                              >
                              <input
                                type="number"
                                id="newProductPrice"
                                className="peer border-none btn-wide btn-md bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Product Price"
                                value={selectedProductPrice}
                                onChange={(e) => setSelectedProductPrice(e.target.value)}
                              />

                              <span
                                  className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                                  Product Price
                              </span>
                              </label>

                              <label
                              htmlFor="ProductStock"
                              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                              >
                              <input
                                type="number"
                                id="newProductStock"
                                className="peer border-none btn-wide btn-md bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                                placeholder="Product Stock"
                                value={selectedProductStock}
                                onChange={(e) => setSelectedProductStock(e.target.value)}
                              />

                              <span
                                  className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                              >
                                  Product Stock
                              </span>
                              </label>

                              <button type="submit" className="btn btn-outline btn-info">
                              Update
                              </button>
                          </form>
                      </div>
                  </div>
                )}
            </div>
            <div className="col-span-1">
                <p className='font-bold uppercase text-2xl text-gray-400 pl-5 lg:pl-0'>Product Stock</p>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product ID</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product Name</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product Price</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product Stock</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                    <tr className="odd:bg-gray-50" key={product._id} onClick={() => handleTableRowClick(product)}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center cursor-pointer">{product._id}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{product.productName}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{product.productPrice}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{product.productStock}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">
                        {selectedProduct && selectedProduct._id === product._id ? (
                            <div className="delete-confirmation flex items-center justify-center flex-col">
                              <p>Are you sure you want to delete {selectedProduct.productName}?</p>
                              <div className="flex flex-row gap-3">
                                <button onClick={handleConfirmDelete} className="btn btn-error">
                                    Confirm
                                </button>
                                <button onClick={handleCancelDelete} className="btn btn-secondary">
                                    Cancel
                                </button>
                              </div>
                            </div>
                        ) : (
                            <button onClick={() => handleDeleteClick(product)} className="btn btn-outline btn-error">
                            Delete
                            </button>
                        )}
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
  )
}
