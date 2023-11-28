import i18next from 'i18next';
import English from './English.json';
import Chinese from './Chinese.json';
import { initReactI18next } from 'react-i18next';
import { StorageManager } from '../services';

const { getData, storageKeys, setData } = StorageManager;


const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: any) => {
        try {
            const data = await getData(storageKeys.LANGUAGE);
            if(data) {
                callback(data);
            } else {
                callback('chinese');
            }
        } catch(error) {
            callback('chinese');
        }
    },
    init: () => { },
    cacheUserLanguage: (locale: any) => {
        setData(storageKeys.LANGUAGE, locale);
    },
};

i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            english: { translation: English },
            chinese: { translation: Chinese },
        },
        react: {
            useSuspense: false,
        },
    });

export default i18next;
