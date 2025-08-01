import React, { useState } from 'react'
import SearchBar from '../components/searchbar';
import ServiceCarousel from '../components/Carusel';
import ServiceCatalog from '../components/Catalog';
import { useAppContext } from '../context/context.jsx';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../components/languageDropdown.jsx';

const Home = () => {
    const userName = "User";
    const { catalog, booked, setBooked, } = useAppContext();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <div className='bg-black text-white'>
            <div className="px-4 pt-6 flex justify-between items-center">
                <div className='flex gap-5  justify-between '>
                    <h1 className="text-[15px] text-red-200"> {t('welcome_message')} {userName}</h1>
                    <h1 className="text-[15px] font-semibold">{t("greeting")}</h1>
                </div>
                <div>
                    <div>
                        {booked}
                    </div>
                    <div>
                        <LanguageToggleButton />
                    </div>
                </div>

            </div>

            <div>
                <SearchBar />
            </div>
            <div>
                <ServiceCarousel
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>
            <div>
                <ServiceCatalog
                    selectedCategory={selectedCategory}
                />
            </div>
           
        </div>
    )
}

export default Home