import { Spinner } from '@material-tailwind/react';
import { useState } from 'react';

export default function AddOrder() {
    const [formData, setFormData] = useState({
        fullname: '',
        address: '',
        clothes: 0,
        clothesPrice: 100,
        pants: 0,
        pantsPrice: 100,
        mixed: 0,
        mixedPrice: 100,
        totalCost: 0,
        totalQuantity: 0,
        orderType: '',
        orderStatus: 'processing',
      });
      const [totalQuantity, setTotalQuantity] = useState(0);
      const [totalClothesPrice, setTotalClothesPrice] = useState(0);
      const [totalPantsPrice, setTotalPantsPrice] = useState(0);
      const [totalMixedPrice, setTotalMixedPrice] = useState(0);
      const [totalCostOverAll, setTotalOverAll] = useState(0);
      const [error, setError] = useState(false);
      const [loading, setLoading] = useState(false);
      const [submitDone, setSubmitDone] = useState(false);

      const handleChange = (e) => {

        if (e.target.id === 'Gcash' || e.target.id === 'COD') {
          setFormData({
            ...formData,
            type: e.target.id,
          });
        }
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        if (
          e.target.type === 'number' ||
          e.target.type === 'text' 
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          });
        }
      };

      const handleCostPayment = (e) => {
        e.preventDefault();
      
        // Calculate the total quantity as the sum of clothes, pants, and mixed
        const calculatedTotalQuantity = parseInt(formData.clothes) + parseInt(formData.pants) + parseInt(formData.mixed);
        setTotalQuantity(calculatedTotalQuantity);
      
        // Calculate the total price for clothes, pants, and mixed
        const calculatedTotalClothes = formData.clothes * formData.clothesPrice;
        const calculatedTotalPants = formData.pants * formData.pantsPrice;
        const calculatedTotalMixed = formData.mixed * formData.mixedPrice;
      
        // Calculate the overall cost
        const calculateOverAllCost =
          calculatedTotalClothes + calculatedTotalPants + calculatedTotalMixed;
      
        // Update the state with the calculated total
        setTotalClothesPrice(calculatedTotalClothes);
        setTotalPantsPrice(calculatedTotalPants);
        setTotalMixedPrice(calculatedTotalMixed);
        setTotalOverAll(calculateOverAllCost);
      
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalQuantity: calculatedTotalQuantity, // Corrected totalQuantity
          totalCost: calculateOverAllCost,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          setError(false);
          const res = await fetch('/api/add/addOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...formData,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }
          setSubmitDone('Order Submitted Done');
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

  return (
    <div className="">
    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={()=>document.getElementById('my_modal_1').showModal()}>Add Order</button>
    <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
            <p>Add User</p>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col gap-4 flex-1">
                <div className="">
                    <input 
                    type="text" 
                    id='fullname'
                    onChange={handleChange}
                    value={formData.fullname}
                    placeholder='Full Name'
                    required
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    />
                </div>
                <div className="">
                    <input 
                    type="text" 
                    id='address'
                    onChange={handleChange}
                    value={formData.address}
                    placeholder='Address'
                    required
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    />
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col text-center items-center gap-2">
                    <p className='text-lg font-semibold uppercase'>Clothes</p>
                    <input 
                    type="number"
                    id='clothes'
                    min={0}
                    max={10}
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    onClick={handleCostPayment}
                    value={formData.clothes}
                    />
                    </div>
                    <div className="flex flex-col text-center items-center gap-2">
                    <p className='text-lg font-semibold uppercase'>Pants</p>
                    <input 
                    type="number"
                    id='pants'
                    min={0}
                    max={10}
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    onClick={handleCostPayment}
                    value={formData.pants}
                    />
                    </div>
                    <div className="flex flex-col text-center items-center gap-2">
                    <p className='text-lg font-semibold uppercase'>Mixed</p>
                    <input 
                    type="number"
                    id='mixed'
                    min={0}
                    max={10}
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    onClick={handleCostPayment}
                    value={formData.mixed}
                    />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Clothes Price: {totalClothesPrice}</p>
                    <p>Pants Price: {totalPantsPrice}</p>
                    <p>Mixed Price: {totalMixedPrice}</p>
                    <p>Total Quantity: {totalQuantity}</p>
                    <p>Total Cost: {totalCostOverAll}</p>
                </div>
                <div className="relative h-10 w-72 min-w-[200px my-5">
                <select name="orderType" 
                className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                onChange={handleChange}
                value={formData.orderType} >
                    <option value="">Select Order Type</option>
                    <option value="walk">Walk In</option>
                    <option value="drop">Drop Off</option>
                </select>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Select a City
                </label>
                {formData.orderType === "walk" && (
                <button
                onSubmit={handleSubmit}
                disabled={loading || loading}
                className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded my-5'
                >
                {loading ? <Spinner color="green" /> : 'Add Order'}</button>
                )}
                {error && <p className='text-red-700 text-sm'>{error}</p>}
                {submitDone && submitDone}
                {formData.orderType === "drop" && (
                <button
                onSubmit={handleSubmit}
                disabled={loading || loading}
                className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded my-5'
                >
                {loading ? <Spinner color="green" /> : 'Add Order'}</button>
                )}
                {error && <p className='text-red-700 text-sm'>{error}</p>}
                {submitDone && submitDone}
                </div>
                </div>
                </form>
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
    </div>
  )
}
