import React, { useState } from "react";
import Slidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Fixed Sidebar - Hidden on mobile */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:block">
        <Slidebar onClose={closeSidebar} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar - Only visible when sidebarOpen is true */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Slidebar onClose={closeSidebar} />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;