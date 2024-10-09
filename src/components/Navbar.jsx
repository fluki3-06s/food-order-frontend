import React from 'react';
import logo from '../pages/assets/logo.png';

const Navbar = ({ openOrderPage, openReceptionPage, openHistoryPage }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto mr-4" />
            <span className="text-xl font-semibold text-orange-600">อาหารตามสั่ง</span>
          </div>
          <ul className="flex space-x-4">
            <li>
              <button 
                onClick={openOrderPage} 
                className="btn btn-ghost hover:bg-orange-100 text-orange-600 hover:text-orange-700 transition-colors duration-300"
              >
                สั่งอาหาร
              </button>
            </li>
            <li>
              <button 
                onClick={openReceptionPage} 
                className="btn btn-ghost hover:bg-orange-100 text-orange-600 hover:text-orange-700 transition-colors duration-300"
              >
                รับคำสั่งซื้อ
              </button>
            </li>
            <li>
              <button 
                onClick={openHistoryPage} 
                className="btn btn-ghost hover:bg-orange-100 text-orange-600 hover:text-orange-700 transition-colors duration-300"
              >
                ประวัติคำสั่งซื้อ
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;