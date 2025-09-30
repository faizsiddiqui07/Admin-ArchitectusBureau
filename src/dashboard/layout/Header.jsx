import React, { useContext } from 'react'
import profile from '../../assets/profile.png'
import storeContext from '../../context/storeContext'
import { FiMenu, FiX, FiBell, FiSettings, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'

const Header = ({ onMenuToggle, sidebarOpen }) => {
  const { store } = useContext(storeContext)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="px-3">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              {sidebarOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
            
            {/* Welcome Message */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Welcome back! Admin</h1>
              <p className="text-sm text-gray-500">Here's your overview</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{store.userInfo?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{store.userInfo?.role}</p>
                </div>
                <div className="relative">
                  <img 
                    src={profile} 
                    className="h-8 w-8 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors" 
                    alt="Profile" 
                  />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header