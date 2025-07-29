import React from "react";

const SearchBar = () => {
  return (
    <div className="top-0 left-0 w-full  z-50 shadow p-4">
      <input
        type="text"
        placeholder="Search barbershops, salons..."
        className="w-full p-3 rounded-xl border border-gray-300 bg-gray-950 focus:outline-none focus:ring-2 focus:ring-yellow-200"
      />
    </div>
  );
};

export default SearchBar;
