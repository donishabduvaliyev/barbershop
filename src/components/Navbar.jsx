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

// const UserIcon = ({ isActive }) => (
//   <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//   </svg>
// );

const MapIcon = () => (
  <svg
   fill="none" viewBox="0 0 24 24"  stroke="currentColor" className="w-7 h-7"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g><rect height="19.2676" opacity="0" width="20.6738" x="0" y="0"></rect><path d="M1.10352 18.8867C1.34766 18.8867 1.60156 18.7988 1.91406 18.623L6.88477 15.9473L12.2852 18.9746C12.6367 19.1699 13.0176 19.2676 13.3789 19.2676C13.7207 19.2676 14.0625 19.1797 14.3555 19.0137L19.4629 16.1133C20.0488 15.791 20.3125 15.3223 20.3125 14.668L20.3125 1.51367C20.3125 0.791016 19.9121 0.390625 19.209 0.390625C18.9648 0.390625 18.7109 0.46875 18.3887 0.644531L13.2129 3.52539L7.91016 0.273438C7.60742 0.0976562 7.26562 0 6.92383 0C6.57227 0 6.2207 0.0976562 5.91797 0.273438L0.839844 3.16406C0.263672 3.49609 0 3.96484 0 4.61914L0 17.7539C0 18.4766 0.400391 18.8867 1.10352 18.8867ZM6.25 14.3945L1.8457 16.8164C1.79688 16.8359 1.74805 16.8652 1.69922 16.8652C1.62109 16.8652 1.57227 16.8066 1.57227 16.709L1.57227 5C1.57227 4.76562 1.66016 4.59961 1.89453 4.46289L5.89844 2.11914C6.02539 2.05078 6.13281 1.99219 6.25 1.92383ZM7.82227 14.5508L7.82227 2.12891C7.91992 2.1875 8.03711 2.24609 8.13477 2.30469L12.4902 4.96094L12.4902 17.168C12.3535 17.0898 12.207 17.0215 12.0605 16.9434ZM14.0625 17.3438L14.0625 4.86328L18.4668 2.46094C18.5156 2.43164 18.5645 2.41211 18.6035 2.41211C18.6914 2.41211 18.7402 2.4707 18.7402 2.56836L18.7402 14.2773C18.7402 14.5215 18.6426 14.6875 18.418 14.8242L14.502 17.0996C14.3555 17.1875 14.209 17.2754 14.0625 17.3438Z" fillOpacity="0.85"></path></g>
  </svg>
)
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
    { id: 'profile', icon: MapIcon, key: "profile", link: "/map" },
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
