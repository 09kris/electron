import React from "react";
import { FaHeart, FaShoppingBag, FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <div className="w-full">
      {/* Top Yellow Bar */}
      <div className="bg-yellow-400 flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-3xl font-bold text-gray-800">electro</div>

        {/* Search Bar */}
        <div className="flex-1 mx-10 max-w-3xl">
          <div className="flex rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="bg-gray-800 px-4 py-2 text-white">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-800 font-medium">
          <div className="relative">
            <FaHeart size={20} />
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
          </div>
          <div className="relative flex items-center gap-1">
            <FaShoppingBag size={20} />
            <span className="absolute -top-2 -right-3 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
            <span>$0.00</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex justify-between items-center px-6 py-3 border-b">
        {/* Left Menu */}
        <div className="flex items-center gap-6">
          <div className="font-semibold cursor-pointer">All Departments ▼</div>
          <div className="cursor-pointer">Home ▼</div>
          <div className="cursor-pointer flex items-center gap-1">
            Catalog
            <span className="bg-blue-600 text-white text-xs px-1 rounded">New</span>
          </div>
          <div className="cursor-pointer flex items-center gap-1">
            Gift Cards
            <span className="bg-green-400 text-white text-xs px-1 rounded">Sale</span>
          </div>
          <div className="cursor-pointer">Pages ▼</div>
          <div className="cursor-pointer">Features</div>
        </div>

        {/* Right Text */}
        <div className="text-sm text-gray-700">
          Free Shipping on Orders $500+
        </div>
      </div>
    </div>
  );
};

export default Header;
