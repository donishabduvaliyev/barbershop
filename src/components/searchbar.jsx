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
    <div className="px-1 py-1">
      <form onSubmit={handleHomeSearch} className="relative flex items-center">
        <div className="absolute left-3.5 z-10 pointer-events-none flex items-center text-accent">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('Search for salons, spas, etc.')}
          className="w-full pl-10 pr-24 py-2.5 text-xs text-text bg-surface-2 border border-border-soft rounded-2xl focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/30 placeholder:text-text-faint transition-all duration-200"
        />
        <div className="absolute right-1.5 flex items-center space-x-1">
          {searchTerm.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-text-faint hover:text-text press-spring cursor-pointer rounded-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="bg-accent text-bg px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-accent-hover press-spring shadow-sm shadow-accent/20 cursor-pointer"
          >
            {t('search')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
