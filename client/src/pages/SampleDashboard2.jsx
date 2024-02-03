import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { IoIosPeople } from "react-icons/io";
import { useEffect, useState } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from '../components/PieComponent';
import { Progress } from 'antd';
import error from '../assets/error.png'




export default function SampleDashboard2() {

    const [earnings, setEarnings] = useState({ count: 0, totalCost: 0 });
    const [earningsWeekly, setEarningsWeekly] = useState({ count: 0, totalCost: 0 });
    const [earningsMonth, setEarningsMonth] = useState({ count: 0, totalCost: 0 });

    const [onsiteEarnings, setOnsiteEarnings] = useState({ count: 0, totalCost: 0 });
    const [onsiteEarningsWeek, setOnsiteEarningsWeek] = useState({ count: 0, totalCost: 0 });
    const [onsiteEarningsMonth, setOnsiteEarningsMonth] = useState({ count: 0, totalCost: 0 });

    const datas = [
        {
            name: 'Online Daily',
            cost: earnings.totalCost,
            count: earnings.count,
        },
        {
            name: 'Online Weekly',
            cost: earningsWeekly.totalCost,
            count: earningsWeekly.count,
        },
        {
            name: 'Online Monthy',
            cost: earningsMonth.totalCost,
            count: earningsMonth.count,
        },
        {
            name: 'Onsite Daily',
            cost: onsiteEarnings.totalCost,
            count: onsiteEarnings.count,
        },
        {
            name: 'Onsite Weekly',
            cost: onsiteEarningsWeek.totalCost,
            count: onsiteEarningsWeek.count,
        },
        {
            name: 'Onsite Monthly',
            cost: onsiteEarningsMonth.totalCost,
            count: onsiteEarningsMonth.count,
        },
      ];

  const fetchData = async (endpoint, setDataFunction) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setDataFunction(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData('/api/new/today', setEarnings);
    fetchData('/api/new/week', setEarningsWeekly);
    fetchData('/api/new/month', setEarningsMonth);
    fetchData('/api/add/today', setOnsiteEarnings);
    fetchData('/api/add/weekly', setOnsiteEarningsWeek);
    fetchData('/api/add/monthly', setOnsiteEarningsMonth);
  }, []);

    const [chartWidth, setChartWidth] = useState({
        width: 270,
      });
      
      useEffect(() => {
        const handleResize = () => {
          let newWidth;
      
          if (window.innerWidth >= 1440) {
            newWidth = 850;
          } else if (window.innerWidth >= 1140) {
            newWidth = 1050;
          } else if (window.innerWidth >= 1024) {
            newWidth = 550;
          } else if (window.innerWidth >= 768) {
            newWidth = 690;
          } else {
            newWidth = 260;
          }
      
          setChartWidth({ width: newWidth });
        };
      
        handleResize(); // Initial width setup
      
        window.addEventListener('resize', handleResize);
      
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

  return (
    <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
            <div className='flex flex-col items-start gap-3 lg:items-center md:flex-row md:justify-between mb-5'>
                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer'>Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 grid-rows-2 gap-10">
                <div className="grid grid-cols-4 grid-rows-1 gap-[5rem]">
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#36B9CC] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">ONLINE DAILY(COUNT)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {earnings.count !== undefined ? `${earnings.count.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <IoIosPeople fontSize={28} />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#4E73DF] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#B589DF] text-11 leading-17 font-bold">EARNINGS (Daily)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {earnings.totalCost !== undefined ? `₱${earnings.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} color="" />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#1CC88A] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">EARNINGS (WEEKLY)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {earningsWeekly.totalCost !== undefined ? `₱${earningsWeekly.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#36B9CC] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">EARNINGS (MONTHLY)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {earningsMonth.totalCost !== undefined ? `₱${earningsMonth.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 grid-rows-1 gap-[5rem]">
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#36B9CC] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">ONSITE DAILY(COUNT)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {onsiteEarnings.count !== undefined ? `${onsiteEarnings.count.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <IoIosPeople fontSize={28} />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#4E73DF] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#B589DF] text-11 leading-17 font-bold">EARNINGS (Daily)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {onsiteEarnings.totalCost !== undefined ? `₱${onsiteEarnings.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} color="" />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#1CC88A] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">EARNINGS (WEEKLY)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {onsiteEarningsWeek.totalCost !== undefined ? `₱${onsiteEarningsWeek.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} />
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-2 xl:col-span-1">
                        <div className="h-[100px] lg:w-[380px] xl:w-[280px] rounded-[8px] bg-white border-l-4 border-[#36B9CC] flex items-center justify-between px-8 cursor-pointer hover:shadow-lg transform hover:scale-103 transition duration-300 ease-out">
                        <div>
                            <h2 className="text-[#1cc88a] text-11 leading-17 font-bold">EARNINGS (MONTHLY)</h2>
                            <h1 className="text-20 leading-24 font-bold text-[#5a5c69] mt-5">
                            {onsiteEarningsMonth.totalCost !== undefined ? `₱${onsiteEarningsMonth.totalCost.toLocaleString()}` : 'Loading...'}
                            </h1>
                        </div>
                        <FaRegCalendarMinus fontSize={28} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row mt-[50px] w-full gap-[30px]'>
                <div className='basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Earnings Overview</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="w-[200px] lg:w-[400px]">
                        <LineChart className="w-[200px] lg:w-[1150px] h-[250px] lg:h-[500px]"
                            width={chartWidth.width}
                            height={300}
                            data={datas}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                </div>
                <div className='basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Revenue Resources</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='pl-[35px]'>

                        <PieComponent />

                        {

                        }
                    </div>
                </div>
            </div>
    </div >
  )
}
