import React, { useState } from "react";
import { HomeIcon, SearchIcon, CalendarIcon, UserIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, key: "home" , link: "/" },
    { name: "Search", icon: <SearchIcon className="h-6 w-6" />, key: "search" ,link: "/search" },
    { name: "Bookings", icon: <CalendarIcon className="h-6 w-6" />, key: "bookings", link: "/booking" },
  
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 items-center bg-white shadow border-t z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex flex-col items-center text-xs ${
              active === item.key ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <NavLink to={item.link}>
              {item.icon}
            </NavLink>
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
