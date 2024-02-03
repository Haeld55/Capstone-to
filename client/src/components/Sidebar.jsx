import { FaTachometerAlt, FaRegSun } from "react-icons/fa"
import { IoIosPeople } from "react-icons/io";
import { IoPeopleCircle } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { GrStorage } from "react-icons/gr";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className='bg-[#4E73DF] px-[25px] h-screen w-full'>
            <Link to={'/admin'}>
                <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                    <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer uppercase'>Admin panel</h1>
                </div>
            </Link>
            <Link to={'/admin'}>
                <div className='flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3] cursor-pointer'>
                    <FaTachometerAlt color='white' />
                    <p className='text-[14px] leading-[20px] font-bold text-white'>Dashboard</p>
                </div>
            </Link>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                <Link to={'/onsite'}>
                    <div className='flex items-center gap-[10px]'>
                            <IoIosPeople color='white' fontSize={30} /> <p className='text-[15px] leading-[20px] font-bold text-white text-center'>OnSite Customer</p>
                    </div>
                </Link>
                </div>

                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                <Link to={'/online'}>
                    <div className='flex items-center gap-[10px]'>
                        <IoPeopleCircle color='white' fontSize={30}/> <p className='text-[15px] leading-[20px] font-bold text-white text-center'>Online Customer</p>
                    </div>
                </Link>
                </div>
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <Link to={'/report'}>
                        <div className='flex items-center gap-[10px]'>
                            <TbReportAnalytics color='white' fontSize={30} /> <p className='text-[15px] leading-[20px] font-bold text-white text-center'>Report</p>
                        </div>
                    </Link>
                </div>
                <Link to={'/inventory'}>
                    <div className='flex items-center gap-[10px] py-[15px]  cursor-pointer'>
                        <GrStorage color='white' fontSize={30} /> <p className='text-[15px] leading-[20px] font-bold text-white'>Inventory</p>
                    </div>
                </Link>
                <Link to={'/setting'}>
                    <div className='flex items-center gap-[10px] py-[15px] cursor-pointer'>
                        <FaRegSun color='white' fontSize={30} /> <p className='text-[15px] leading-[20px] font-bold text-white'>Setting</p>
                    </div>
                </Link>
            </div>
            <div className='pt-[15px]'>
                <div className='flex items-center justify-center'>
                    
                </div>
            </div>
        </div>
  )
}
