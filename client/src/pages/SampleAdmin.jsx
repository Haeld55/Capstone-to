import Headers from '../components/Headers'
import SampleSidebar from "../components/Sidebar";
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

export default function SampleAdmin() {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`w-[98%] lg:w-[15%] xl:w-[12%] h-screen bg-gray-800 ${
          isSidebarVisible ? 'fixed inset-0 z-50' : 'hidden lg:block'
        }`}
      >
        <SampleSidebar />
      </div>

      {/* Main content */}
      <div className="relative flex-grow">
        {/* Burger button for small screens */}
        <div className="lg:hidden absolute top-0 left-0 z-50">
          <button
            className="block text-2xl text-white cursor-pointer"
            onClick={toggleSidebar}
          >
            <div className="text-3xl font-extrabold">
              {isSidebarVisible ? <RxCross1 color="black" /> : <CiMenuBurger color="black" />}
            </div>
          </button>
        </div>

        {/* Content container with fixed width */}
        <div className="">
          <Headers />
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
