import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/context';
import { useSearchParams } from 'react-router-dom';



const SearchIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> </svg>);

const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);

const AdCarousel = ({ services, lang, navigate }) => { const [currentIndex, setCurrentIndex] = useState(0); const timeoutRef = useRef(null); useEffect(() => { const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; resetTimeout(); timeoutRef.current = setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex === services.length - 1 ? 0 : prevIndex + 1)), 3500); return () => resetTimeout(); }, [currentIndex, services.length]); if (!services || services.length === 0) return null; return (<div className="relative h-48 w-full overflow-hidden"> <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}> {services.map(service => (<div key={service.id} onClick={() => navigate(`/service/${service.id}`)} className="relative w-full flex-shrink-0"> <img src={service.image} alt={service.name[lang]} className="w-full h-full object-cover" /> <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10">Ad</div> <div className="absolute bottom-0 left-0 p-4 text-white"> <h3 className="font-bold text-xl">{service.name[lang]}</h3> <p className="text-sm opacity-80">{service.category}</p> </div> </div>))} </div> <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2"> {services.map((_, idx) => (<div key={idx} className={`w-2 h-2 rounded-full transition-colors ${currentIndex === idx ? 'bg-white' : 'bg-white/50'}`}></div>))} </div> </div>); };

const ServiceCard = ({ service, lang, navigate }) => (<div onClick={() => navigate(`/service/${service.id}`)} className="w-44 flex-shrink-0 group"> <div className="relative rounded-2xl overflow-hidden shadow-sm transition-transform group-hover:-translate-y-1"> <img src={service.image} alt={service.name[lang]} className="w-full h-28 object-cover" /> {service.isEditorsChoice && <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">Editor's Choice</div>} </div> <div className="pt-2 px-1"> <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{service.name[lang]}</h4> <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400"> <span>{service.category}</span> <span className="flex items-center font-medium"><StarIcon /><span className="ml-1">{service.rating}</span></span> </div> </div> </div>);

const HorizontalCarousel = ({ title, services, lang, navigate }) => { if (!services || services.length === 0) return null; return (<div className="my-6"> <h2 className="font-bold text-xl text-gray-900 dark:text-white px-4 mb-3">{title}</h2> <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar"> {services.map(service => <ServiceCard key={service._id} service={service} lang={lang} navigate={navigate} />)} </div> </div>); };

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query');

  const { i18n, t } = useTranslation();
  const { navigate, backEndUrl } = useAppContext();
  const lang = i18n.language || 'en';
  const [searchTerm, setSearchTerm] = useState(queryFromUrl || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [shopLists, setShopLists] = useState({
    advertisedShops: [],
    editorsChoiceShops: [],
    topRatedShops: [],
    bestPriceShops: [],
    nearYouShops: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const debounceTimeout = useRef(null);

  const categories = ['All', 'Barbershop', 'Nail Salon', 'Hair Salon', 'Massage Therapy', 'Beauty Spas'];


  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setIsLoading(true);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const requestBody = {
          searchTerm: searchTerm,
          category: activeCategory === 'All' ? null : activeCategory,
        };


        const response = await fetch(`${backEndUrl}/api/shops/discovery-search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();

        setShopLists(data);
      } catch (error) {
        console.error("Failed to fetch discovery data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout.current);

  }, [searchTerm, activeCategory]);

  const hasResults = Object.values(shopLists).some(list => Array.isArray(list) && list.length > 0);
  console.log(shopLists);

  return (
    <div className="h-screen bg-gray-100 dark:bg-black font-sans overflow-y-auto no-scrollbar">
      <header className="sticky top-0 bg-gray-100/80 dark:bg-black/80 backdrop-blur-xl z-20 border-b border-gray-200 dark:border-zinc-800">

        <div className="p-4 flex items-center space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-yellow-400" /></div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('Search for salons, spas, etc.')}
              className="w-full pl-10 pr-4 py-3 text-purple-400 bg-gray-200 dark:bg-zinc-900 border-transparent rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="pb-3">
          <div className="flex space-x-3 overflow-x-auto px-4 no-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${activeCategory === category ? 'bg-purple-600 text-white' : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {isLoading ? (
        <p className="py-16 text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <AdCarousel services={shopLists.advertisedShops} lang={lang} navigate={navigate} />
          <main className="pb-10">
            {hasResults ? (
              <>
                <HorizontalCarousel title={t("Editor's Choice")} services={shopLists.editorsChoiceShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Top Rated")} services={shopLists.topRatedShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Best Prices")} services={shopLists.bestPriceShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Near You")} services={shopLists.nearYouShops} lang={lang} navigate={navigate} />
              </>
            ) : (
              <p className="py-16 text-center text-gray-500 dark:text-gray-400">
                {t('No results found for')} "{activeCategory}"
                {searchTerm && ` ${t('with')} "${searchTerm}"`}.
              </p>
            )}
          </main>
        </>
      )}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}