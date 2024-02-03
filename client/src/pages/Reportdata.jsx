import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function Reportdata() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reportMonth, setreportMonth] = useState([]);
    const [onsite, setOnsite] = useState([]);
    const [onsiteWeek, setOnsiteWeek] = useState([]);
    const [onsiteMonth, setOnsiteMonth] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [currentPage2, setCurrentPage2] = useState(1);
    const itemsPerPage2 = 5;
    const [currentPage3, setCurrentPage3] = useState(1);
    const itemsPerPage3 = 5;
    const [currentPage4, setCurrentPage4] = useState(1);
    const itemsPerPage4 = 5;
    const [currentPage5, setCurrentPage5] = useState(1);
    const itemsPerPage5 = 5;
    const [currentPage6, setCurrentPage6] = useState(1);
    const itemsPerPage6 = 5;

    const printTable = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Report</title></head><body>');
        printWindow.document.write('<h1>Generated Report</h1>');
        printWindow.document.write(document.getElementById('reportTable').outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      };

    const printTable2 = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Report</title></head><body>');
        printWindow.document.write('<h1>Generated Report</h1>');
        printWindow.document.write(document.getElementById('reportTable2').outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      };

    const fetchReport = async () => {
        try {
          let endpoint = '/api/new/reportMonth';  // Adjust the endpoint accordingly
      
          if (filter === 'month') {
            // Calculate the start and end of the current month
            const startDate = startOfMonth(new Date());
            const endDate = endOfMonth(new Date());
      
            // Append query parameters to the endpoint
            endpoint += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
          }
      
          // Call the API endpoint to fetch the report data
          const response = await axios.get(endpoint);
      
          // Update the state with the fetched data
          setreportMonth(response.data);
        } catch (error) {
          console.error('Error fetching report:', error);
        }
      };
      
      useEffect(() => {
        fetchReport();
      }, [filter]);

    const onReportMonth = async () => {
        try {
          let endpoint = '/api/add/month';  // Adjust the endpoint accordingly
      
          if (filter === 'onsiteMonth') {
            // Calculate the start and end of the current month
            const startDate = startOfMonth(new Date());
            const endDate = endOfMonth(new Date());
      
            // Append query parameters to the endpoint
            endpoint += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
          }
      
          // Call the API endpoint to fetch the report data
          const response = await axios.get(endpoint);
      
          // Update the state with the fetched data
          setOnsiteMonth(response.data);
        } catch (error) {
          console.error('Error fetching report:', error);
        }
      };
      
      useEffect(() => {
        onReportMonth();
      }, [filter]);

    const onReportWeek = async () => {
        try {
          let endpoint = '/api/add/week';  // Adjust the endpoint accordingly
      
          if (filter === 'onsiteWeek') {
            // Calculate the start and end of the current month
            const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
            const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    
            // Append query parameters to the endpoint
            endpoint += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
          }
      
          // Call the API endpoint to fetch the report data
          const response = await axios.get(endpoint);
      
          // Update the state with the fetched data
          setOnsiteWeek(response.data);
        } catch (error) {
          console.error('Error fetching report:', error);
        }
      };
      
      useEffect(() => {
        onReportWeek();
      }, [filter]);
      
    const onReport = async () => {
        try {
            const response = await axios.get('/api/add/report'); // Replace with your actual API endpoint
            setOnsite(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching reports:', error);
            // Handle error as needed
            setLoading(false);
          }
      };
      
      useEffect(() => {
        onReport();
      }, [filter]);
  
    const fetchReportWeek = async () => {
      try {
        let endpoint = '/api/new/reportWeek';
  
        if (filter === 'week') {
          // Calculate the start and end of the current week
          const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
          const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  
          // Append query parameters to the endpoint
          endpoint += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }
  
        // Call the API endpoint to fetch the report data
        const response = await axios.get(endpoint);
  
        // Update the state with the fetched data
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };
  
    useEffect(() => {
    fetchReportWeek();
    }, [filter]);

   

    useEffect(() => {
      const fetchReports = async () => {
        try {
          const response = await axios.get('/api/new/report'); // Replace with your actual API endpoint
          setReports(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching reports:', error);
          // Handle error as needed
          setLoading(false);
        }
      };
  
      fetchReports();
    }, []);
  
    if (loading) {
      return <p>Loading...</p>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastItem2 = currentPage2 * itemsPerPage2;
    const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
    const currentItems2 = orders.slice(indexOfFirstItem2, indexOfLastItem2);
    const paginate2 = (pageNumber) => setCurrentPage2(pageNumber);

    const indexOfLastItem3 = currentPage3 * itemsPerPage3;
    const indexOfFirstItem3 = indexOfLastItem3 - itemsPerPage3;
    const currentItems3 = reportMonth.slice(indexOfFirstItem3, indexOfLastItem3);
    const paginate3 = (pageNumber) => setCurrentPage3(pageNumber);

    const indexOfLastItem4 = currentPage4 * itemsPerPage4;
    const indexOfFirstItem4 = indexOfLastItem4 - itemsPerPage4;
    const currentItems4 = onsite.slice(indexOfFirstItem4, indexOfLastItem4);
    const paginate4 = (pageNumber) => setCurrentPage4(pageNumber);

    const indexOfLastItem5 = currentPage5 * itemsPerPage5;
    const indexOfFirstItem5 = indexOfLastItem5 - itemsPerPage5;
    const currentItems5 = onsiteWeek.slice(indexOfFirstItem5, indexOfLastItem5);
    const paginate5 = (pageNumber) => setCurrentPage5(pageNumber);

    const indexOfLastItem6 = currentPage6 * itemsPerPage6;
    const indexOfFirstItem6 = indexOfLastItem6 - itemsPerPage6;
    const currentItems6 = onsiteMonth.slice(indexOfFirstItem6, indexOfLastItem6);
    const paginate6 = (pageNumber) => setCurrentPage6(pageNumber);
  return (
    <div>
        <div className="p-[25px] mt-5 mb-5">
            <p className='font-bold uppercase text-gray-600 text-3xl'>Report</p>
        </div>
        <div className="">
            <div className="flex flex-row justify-between items-center p-[25px]">
                <div className="">
                    <p className='font-bold uppercase text-gray-500 text-2xl'>Online Customer</p>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <label htmlFor="HeadlineAct" className="block text-lg font-bold text-gray-500">
                        Filter
                        </label>

                        <select
                        name="HeadlineAct"
                        id="HeadlineAct"
                        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        >
                        <option value="">Please select</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        </select>
                    </div>
                </div>
                <div className="">
                <button className='btn btn-outline btn-error' onClick={printTable}>
                    Generate Report
                </button>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                        {filter === 'week' ? (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg">
                                <table id='reporTable' className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>
        
                                <tbody className="divide-y divide-gray-200">
                                {currentItems2.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(orders.length / itemsPerPage2) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage2 === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate2(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        
                        ) : filter === 'month' ? (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg">
                                <table id="reportTable" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {currentItems3.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(reportMonth.length / itemsPerPage3) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage3 === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate3(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        ) : (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg"> 
                                <table id="reportTable" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {currentItems.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(reports.length / itemsPerPage) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        )}
                </div>
            </div>
        </div>
        <div className="">
            <div className="flex flex-row justify-between items-center p-[25px]">
                <div className="">
                    <p className='font-bold uppercase text-gray-500 text-2xl'>Onsite Customer</p>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <label htmlFor="HeadlineAct" className="block text-lg font-bold text-gray-500">
                        Filter
                        </label>

                        <select
                        name="HeadlineAct"
                        id="HeadlineAct"
                        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        >
                        <option value="">Please select</option>
                        <option value="onsiteWeek">Weekly</option>
                        <option value="onsiteMonth">Monthly</option>
                        </select>
                    </div>
                </div>
                <div className="">
                <button className='btn btn-outline btn-error' onClick={printTable2}>
                    Generate Report
                </button>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                        {filter === 'onsiteWeek' ? (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg">
                                <table id='reportTable2' className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>
        
                                <tbody className="divide-y divide-gray-200">
                                {currentItems5.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(onsiteWeek.length / itemsPerPage5) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage5 === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate5(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        
                        ) : filter === 'onsiteMonth' ? (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg">
                                <table id="reportTable2" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {currentItems6.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(onsiteMonth.length / itemsPerPage6) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage6 === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate6(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        ) : (
                        <div className="">
                            <div className="overflow-x-auto rounded-t-lg"> 
                                <table id="reportTable2" className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time Created</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                {currentItems4.map((report) => (
                                    <tr key={report._id}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report._id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.service?.serviceType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalQuantity}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.totalCost}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.orderStatus}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{report.formattedCreatedAt}</td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                                <ol className="flex justify-end gap-1 text-xs font-medium">
                                    {Array.from({ length: Math.ceil(onsite.length / itemsPerPage4) }, (_, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className={`block h-8 w-8 rounded ${
                                                    currentPage4 === index + 1
                                                        ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                                        : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                                }`}
                                                onClick={() => paginate4(index + 1)}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        )}
                </div>
            </div>
        </div>
    </div>
  )
}
