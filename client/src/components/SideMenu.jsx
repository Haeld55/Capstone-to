import { FaBars } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { FaBook } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi"
import { MdInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { CiSettings } from "react-icons/ci";

import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const SideMenu = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.meesage));
    }
  };

  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col justify-start">
        <label htmlFor="my-drawer-2" className=" drawer-button lg:hidden">
          <FaBars onClick={() => {}} />
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="text-center items-center menu p-5 w-54 min-h-full bg-blue-400 text-base-content">
          <div className="flex flex-col items-center gap-5">
          <Link to={'/profile'}
          >
            {currentUser ? <img src={currentUser.avatar} alt='profile' className="w-24 h-24 rounded-full" /> : (
              <GrUserAdmin className="w-auto h-14"/>
            )}
          </Link>
          <Link to={'/admin'}>
            <a className="text-xl font-semibold text-white no-underline hover:underline">Admin Dash board</a>
          </Link>
          </div>
          <div className="flex flex-col gap-3 my-5">
            <Link to={'/customerManagement'}>
              <div className="flex flex-row items-center gap-2">
                <FaUsers className="h-8 w-8 text-white" />
                <li className="text-md font-semibold text-white no-underline hover:underline">Onsite Customer</li>
              </div>
            </Link>
            <Link to={'/onlineManagement'}>
              <div className="flex flex-row items-center gap-2">
                <FaBook className="h-8 w-8 text-white" />
                <li className="text-md font-semibold text-white no-underline hover:underline">Online Customer</li>
              </div>
            </Link>
            <Link to={'/reportList'}>
            <div className="flex flex-row items-center gap-2">
              <HiDocumentReport className="h-8 w-8 text-white" />
              <li className="text-md font-semibold text-white no-underline hover:underline ">Report</li>
            </div>
            </Link>
            <Link to={'/inventory'}>
            <div className="flex flex-row items-center gap-2">
              <MdInventory className="h-8 w-8 text-white" />
              <li className="text-md font-semibold text-white no-underline hover:underline">Inventory List</li>
            </div>
            </Link>
            <Link to={'/setting'}>
            <div className="flex flex-row items-center gap-2">
              <CiSettings className="h-8 w-8 text-white" />
              <li className="text-md font-semibold text-white no-underline hover:underline">Setting</li>
            </div>
            </Link>
            <div className="flex flex-row items-center gap-2">
              <span onClick={handleSignOut} className='text-white font-bold text-xl cursor-pointer'>
                Sign out
              </span>  
            </div>
          </div>
          </ul>
      </div>
    </div>
  );
};

export default SideMenu;
