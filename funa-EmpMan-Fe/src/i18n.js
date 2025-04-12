import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import vi from './locales/vi';
import zh from './locales/zh';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            vi,
            zh
        },
        lng: 'vi', // Mặc định là tiếng Việt
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
