import React from "react";
const SearchIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> </svg>);
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/context";



const SearchBar = () => {
  const { navigate } = useAppContext();
  const { i18n, t } = useTranslation();
  // const lang = i18n.language || 'en';

  const [searchTerm, setSearchTerm] = useState('');

  const handleHomeSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };




  return (
    <div className="p-4 flex items-center space-x-3">

      <div className="relative flex-grow">
        <div className="absolute z-10 top-[25%]  left-0 pl-3  pointer-events-none"><SearchIcon className="w-5 h-5 text-zinc-400" /></div>
        <form action="" onSubmit={handleHomeSearch}
          className="flex items-center space-x-3 relative">


          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search for salons, spas, etc.')}
            className=" w-full pl-10 pr-4 py-3 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button type="submit"
            className=" absolute right-[5%]    bg-accent text-white px-2 py-1 rounded-xl hover:bg-accent/90 transition-colors duration-200"
          >{t('search')}</button>

        </form>


      </div>
    </div>
  );
};

export default SearchBar;
