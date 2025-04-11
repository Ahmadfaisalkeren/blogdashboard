import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex">
      <Sidebar isMinimized={isSidebarMinimized} />
      <div className="flex-grow p-3 bg-gray-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
