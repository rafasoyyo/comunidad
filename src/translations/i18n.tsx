import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import components_en from "./en/components";
import forms_en from "./en/form";
import global_en from "./en/global";
import pages_en from "./en/pages";
import routes_en from "./en/routes";

import components_es from "./es/components";
import forms_es from "./es/form";
import global_es from "./es/global"
import pages_es from "./es/pages";
import routes_es from "./es/routes";

const resources = {
    en: {
        translation: {
            ...components_en,
            ...forms_en,
            ...global_en,
            ...pages_en,
            ...routes_en
        }
    },
    es: {
        translation: {
            ...components_es,
            ...forms_es,
            ...global_es,
            ...pages_es,
            ...routes_es
        }
    },
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: 'es',
        // debug: true,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources
    });

// export default i18n;
