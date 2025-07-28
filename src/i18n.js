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