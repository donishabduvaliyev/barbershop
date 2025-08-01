import React, { useState } from "react";
// import { HomeIcon, SearchIcon, CalendarIcon, UserIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

// const BottomNav = () => {
//  

//   const navItems = [
//     { name: "Home", icon: <HomeIcon className="h-6 w-6" />, key: "home", link: "/" },
//     { name: "Search", icon: <SearchIcon className="h-6 w-6" />, key: "search", link: "/search" },
//     { name: "Bookings", icon: <CalendarIcon className="h-6 w-6" />, key: "bookings", link: "/booking" },

//   ];

//   return (
//     <div className="sticky w- bottom-0 left-0 right-0 items-center bg-gray-900 shadow border border-gray-600 rounded-3xl border-t z-50">
//       <div className="flex justify-around py-2">
//         {navItems.map((item) => (
//           <button
//             key={item.key}
//             onClick={() => setActive(item.key)}
//             className={`flex flex-col items-center text-xs ${active === item.key ? "text-yellow-300" : "text-gray-500"
//               }`}
//           >
//             <NavLink to={item.link}>
//               {item.icon}
//             </NavLink>
//             <span>{item.name}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BottomNav;

const UserIcon = ({ isActive }) => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const SearchIcon = ({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-7 h-7" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const HomeIcon = ({ isActive }) => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12.276V22h20V12.276L12 3 2 12.276z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M15 22v-6a3 3 0 00-6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);


export const BottomNav = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, key: "home", link: "/" },
    { id: 'search', icon: SearchIcon, key: "search", link: "/search" },
    { id: 'profile', icon: UserIcon, key: "profile", link: "/booking" },
  ];
  const [active, setActive] = useState("home");



  return (
    <div className="sticky bottom-4 left-4 right-4 h-15 bg-white/70 dark:bg-gray-700/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/20">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map(item => {
          // const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.key)}
              className={`relative flex flex-col items-center justify-center space-y-1 transition-all duration-300 transform ${active === item.key ? 'text-yellow-200' : 'text-gray-400 hover:text-yellow-200'
                }`}
            ><NavLink to={item.link} >


                <Icon />
                {active === item.key && <div className="absolute -bottom-1.5 left-2.5 w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>}
              </NavLink>
            </button>
          );
        })}
      </div>
    </div>
  );
};
