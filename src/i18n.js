import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './languages/en/english.json';
import uzTranslation from './languages/uz/uzbek.json';
import ruTranslation from './languages/rus/russian.json';

i18n
  
  .use(LanguageDetector)
 
  .use(initReactI18next)
 
  .init({

    fallbackLng: 'uz',
    debug: true,
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      // Browsers/Telegram commonly report regional codes ("en-US", "ru-RU").
      // Normalize to the base language here so i18n.language always matches
      // the "en"/"uz"/"ru" keys used to index localized fields like
      // shop.name[lang] throughout the app.
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
   
    resources: {
      en: {
        translation: enTranslation, 
      },
      uz: {
        translation: uzTranslation,
      },
       ru: {
        translation: ruTranslation,
      },
    },
  
    interpolation: {
      escapeValue: false, 
    },
    
    defaultNS: 'translation',
  });

export default i18n;