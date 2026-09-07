import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/context';
import { useSearchParams } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';



const SearchIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> </svg>);

const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);

const BoltIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.983 1.907a.75.75 0 00-1.292-.657L4.42 10.108a.75.75 0 00.585 1.217h4.077l-1.056 6.85a.75.75 0 001.292.657l6.271-8.858a.75.75 0 00-.585-1.217h-4.077l1.056-6.85z" clipRule="evenodd" /></svg>);

// Bottom sheet where the customer picks a service + date + hour and
// searches every shop for an open slot — reuses the exact portal +
// slideUp pattern already proven in Booking.jsx's time picker (that file's
// comment explains a prior stacking-context bug this pattern fixes).
const AvailableNowSheet = ({ open, onClose, onSearch, isSearching, t, lang }) => {
  const [queryText, setQueryText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const dates = React.useMemo(() => [...Array(4)].map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  }), []);

  // Reset to a fresh default (today, first future hour) every time the
  // sheet opens, rather than lingering on whatever was picked last time.
  useEffect(() => {
    if (!open) return;
    setSelectedDate(dates[0]);
    setSelectedHour(null);
  }, [open, dates]);

  const hours = React.useMemo(() => {
    if (!selectedDate) return [];
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const startHour = isToday ? now.getHours() + 1 : 8;
    const list = [];
    for (let h = Math.max(startHour, 8); h <= 23; h++) list.push(h);
    return list;
  }, [selectedDate]);

  useEffect(() => {
    if (hours.length > 0 && (selectedHour === null || !hours.includes(selectedHour))) {
      setSelectedHour(hours[0]);
    }
  }, [hours, selectedHour]);

  if (!open) return null;

  const canSearch = queryText.trim().length > 0 && selectedDate && selectedHour !== null && !isSearching;

  const submit = () => {
    if (!canSearch) return;
    const requestedDate = new Date(selectedDate);
    requestedDate.setHours(selectedHour, 0, 0, 0);
    onSearch(queryText.trim(), requestedDate);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-end" onClick={onClose}>
      <div
        className="bg-surface/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-lg w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-border-soft flex justify-between items-center shrink-0">
          <h3 className="font-semibold text-lg text-text flex items-center gap-1.5"><BoltIcon className="w-5 h-5 text-accent" />{t('FindAvailableNow')}</h3>
          <button className="text-text-muted hover:bg-surface-2 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold" onClick={onClose}>&times;</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-text-muted mb-2">{t('WhatServiceNeeded')}</p>
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={t('ServiceQueryPlaceholder')}
              autoFocus
              className="w-full px-4 py-2.5 text-text bg-surface-2 border-transparent rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted mb-2">{t('PickADate')}</p>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
              {dates.map((date) => {
                const engDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const translatedDayName = t(`days.${engDayName}`, engDayName);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 rounded-lg border text-sm min-w-[92px] text-center transition-all ${isSelected ? 'bg-accent text-black border-accent font-semibold shadow-md' : 'bg-surface-2/70 text-text-muted border-border hover:border-accent/60'}`}
                  >
                    <div className="font-semibold">{translatedDayName}</div>
                    <div className="text-xs">{date.toLocaleDateString(lang, { month: 'short', day: 'numeric' })}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted mb-2">{t('PickATime')}</p>
            {hours.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hours.map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHour(h)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${selectedHour === h ? 'bg-accent text-black border-accent font-semibold shadow-sm' : 'bg-surface-2/70 text-text-muted border-border hover:border-accent/60'}`}
                  >
                    {String(h).padStart(2, '0')}:00
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">{t('No available time slots for this day.')}</p>
            )}
          </div>

          <button
            onClick={submit}
            disabled={!canSearch}
            className="w-full py-3 px-4 bg-accent text-black font-semibold rounded-md hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? t('Searching...') : t('SearchAvailability')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const AvailableShopResultCard = ({ shop, lang, navigate, presetDate, presetHour, t }) => (
  <div className="flex gap-3 p-3 rounded-2xl bg-surface shadow-sm">
    <img
      src={shop.image}
      alt={shop.name?.[lang]}
      className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
      onClick={() => navigate(`/service/${shop.shopId}`)}
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm text-text truncate cursor-pointer" onClick={() => navigate(`/service/${shop.shopId}`)}>{shop.name?.[lang]}</h4>
        <span className="flex items-center gap-1 text-xs font-medium text-text-muted shrink-0"><StarIcon /><span>{shop.rating}</span></span>
      </div>
      <p className="text-xs text-text-muted truncate">{shop.category} · {shop.address}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {shop.matchedServices.map((service) => (
          <button
            key={service.serviceId}
            onClick={() => navigate(`/booking/${shop.shopId}`, {
              state: { presetDate, presetHour, presetServiceId: service.serviceId },
            })}
            className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors"
          >
            {service.name?.[lang]} · {service.price?.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const AdCarousel = ({ services, lang, navigate }) => { const [currentIndex, setCurrentIndex] = useState(0); const timeoutRef = useRef(null); useEffect(() => { const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; resetTimeout(); timeoutRef.current = setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex === services.length - 1 ? 0 : prevIndex + 1)), 3500); return () => resetTimeout(); }, [currentIndex, services.length]); if (!services || services.length === 0) return null; return (<div className="relative h-48 w-full overflow-hidden"> <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}> {services.map(service => (<div key={service.id} onClick={() => navigate(`/service/${service.id}`)} className="relative w-full flex-shrink-0"> <img src={service.image} alt={service.name[lang]} className="w-full h-full object-cover" /> <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full z-10 backdrop-blur-sm">Ad</div> <div className="absolute bottom-0 left-0 p-4 text-white"> <h3 className="font-bold text-xl">{service.name[lang]}</h3> <p className="text-sm opacity-80">{service.category}</p> </div> </div>))} </div> <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2"> {services.map((_, idx) => (<div key={idx} className={`w-2 h-2 rounded-full transition-colors ${currentIndex === idx ? 'bg-white' : 'bg-white/50'}`}></div>))} </div> </div>); };

const ServiceCard = ({ service, lang, navigate }) => (<div onClick={() => navigate(`/service/${service._id}`)} className="w-44 flex-shrink-0 group cursor-pointer"> <div className="relative rounded-2xl overflow-hidden shadow-sm transition-transform group-hover:-translate-y-1"> <img src={service.image} alt={service.name[lang]} className="w-full h-28 object-cover" /> {service.isEditorsChoice && <div className="absolute top-2 left-2 bg-accent text-black text-xs font-bold px-2 py-1 rounded-full">Editor's Choice</div>} <FavoriteButton shopId={service._id} className="absolute top-2 right-2 w-7 h-7 bg-black/30" /> </div> <div className="pt-2 px-1"> <h4 className="font-semibold text-sm text-text truncate">{service.name[lang]}</h4> <div className="flex items-center justify-between mt-1 text-xs text-text-muted"> <span>{service.category}</span> <span className="flex items-center font-medium"><StarIcon /><span className="ml-1">{service.rating}</span></span> </div> </div> </div>);

const HorizontalCarousel = ({ title, services, lang, navigate }) => { if (!services || services.length === 0) return null; return (<div className="my-6"> <h2 className="font-bold text-xl text-text px-4 mb-3">{title}</h2> <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar"> {services.map(service => <ServiceCard key={service._id} service={service} lang={lang} navigate={navigate} />)} </div> </div>); };

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query');
  const categoryFromUrl = searchParams.get('category');

  const { i18n, t } = useTranslation();
  const { navigate, backEndUrl, showNotification } = useAppContext();
  const lang = i18n.language || 'en';
  const [searchTerm, setSearchTerm] = useState(queryFromUrl || '');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'All');

  // "Find available now" — a separate cross-shop search from the
  // name/category browsing above. `availableNowResults` is null when
  // inactive; once a search runs, its results replace the normal
  // carousels below until the customer clears it.
  const [isAvailableSheetOpen, setIsAvailableSheetOpen] = useState(false);
  const [isAvailableNowLoading, setIsAvailableNowLoading] = useState(false);
  const [availableNowResults, setAvailableNowResults] = useState(null);
  const [availableNowMeta, setAvailableNowMeta] = useState(null);

  // Keep the selected category in sync when navigated here with a different
  // ?category= (e.g. tapping "See All" on another category from Home).
  useEffect(() => {
    if (categoryFromUrl) setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);
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

  const handleAvailableNowSearch = async (serviceQuery, requestedDate) => {
    setIsAvailableNowLoading(true);
    try {
      const response = await fetch(`${backEndUrl}/api/shops/available-now`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceQuery, requestedTime: requestedDate.toISOString() }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Search failed.');
      }
      const data = await response.json();
      setAvailableNowResults(data.results || []);
      setAvailableNowMeta({
        query: serviceQuery,
        presetDate: requestedDate.toISOString(),
        presetHour: `${String(requestedDate.getHours()).padStart(2, '0')}:00`,
        timeLabel: requestedDate.toLocaleString(lang, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      });
      setIsAvailableSheetOpen(false);
    } catch (error) {
      console.error('Failed to search availability:', error);
      showNotification(t('AvailableNowFetchError'), 'error');
    } finally {
      setIsAvailableNowLoading(false);
    }
  };

  const clearAvailableNow = () => {
    setAvailableNowResults(null);
    setAvailableNowMeta(null);
  };

  return (
    <div className="h-screen bg-bg font-sans overflow-y-auto no-scrollbar">
      <header className="sticky top-0 bg-bg/80 backdrop-blur-xl z-20 border-b border-border-soft">

        <div className="p-4 flex items-center space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-text-faint" /></div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('Search for salons, spas, etc.')}
              className="w-full pl-10 pr-4 py-3 text-text bg-surface-2 border-transparent rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
        <div className="pb-3">
          <div className="flex space-x-3 overflow-x-auto px-4 no-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${activeCategory === category ? 'bg-accent text-black' : 'bg-surface text-text-muted shadow-sm'}`}
              >
                {t(category)}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-3">
          <button
            onClick={() => setIsAvailableSheetOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/15 transition-colors"
          >
            <BoltIcon className="w-4 h-4" />
            {t('FindAvailableNow')}
          </button>
        </div>
      </header>

      {availableNowMeta ? (
        <main className="pb-28 px-4 pt-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <p className="text-sm text-text-muted">
              {t('AvailableNowResultsTitle', { count: availableNowResults?.length || 0, query: availableNowMeta.query })}
              {' · '}{availableNowMeta.timeLabel}
            </p>
            <button onClick={clearAvailableNow} className="text-xs font-semibold text-accent shrink-0">{t('ClearSearch')}</button>
          </div>
          {availableNowResults?.length > 0 ? (
            <div className="space-y-3">
              {availableNowResults.map((shop) => (
                <AvailableShopResultCard
                  key={shop.shopId}
                  shop={shop}
                  lang={lang}
                  navigate={navigate}
                  presetDate={availableNowMeta.presetDate}
                  presetHour={availableNowMeta.presetHour}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-text-muted">
              {t('NoAvailableShopsFound', { query: availableNowMeta.query })}
            </p>
          )}
        </main>
      ) : isLoading ? (
        <p className="py-16 text-center text-text-muted">{t('Loading')}</p>
      ) : (
        <>
          <AdCarousel services={shopLists.advertisedShops} lang={lang} navigate={navigate} />
          <main className="pb-28">
            {hasResults ? (
              <>
                <HorizontalCarousel title={t("Editor's Choice")} services={shopLists.editorsChoiceShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Top Rated")} services={shopLists.topRatedShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Best Prices")} services={shopLists.bestPriceShops} lang={lang} navigate={navigate} />
                <HorizontalCarousel title={t("Near You")} services={shopLists.nearYouShops} lang={lang} navigate={navigate} />
              </>
            ) : (
              <p className="py-16 text-center text-text-muted">
                {t('NoResults')} "{activeCategory}"
                {searchTerm && ` ${t('with')} "${searchTerm}"`}.
              </p>
            )}
          </main>
        </>
      )}
      <AvailableNowSheet
        open={isAvailableSheetOpen}
        onClose={() => setIsAvailableSheetOpen(false)}
        onSearch={handleAvailableNowSearch}
        isSearching={isAvailableNowLoading}
        t={t}
        lang={lang}
      />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}