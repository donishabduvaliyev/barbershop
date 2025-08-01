import React from "react";

const SearchBar = () => {
  return (
    <div className="top-0 left-0 w-full  z-50 shadow p-4">
      <input
        type="text"
        placeholder="Search barbershops, salons..."
        className="w-full p-3 bg-white/70 dark:bg-gray-700/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20 focus:ring-2 focus:ring-yellow-200"
      />
    </div>
  );
};

export default SearchBar;
