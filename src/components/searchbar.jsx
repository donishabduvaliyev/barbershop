import React from "react";

const SearchBar = () => {
  return (
    <div className="top-0 left-0 w-full bg-red-300 z-50 shadow p-4">
      <input
        type="text"
        placeholder="Search barbershops, salons..."
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
};

export default SearchBar;
