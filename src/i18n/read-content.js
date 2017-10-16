import { Content } from './content.js';

export const Api = {
  validateLang(lang) {
    if (['en', 'es', 'de', 'zh', 'jp'].indexOf(lang) < 0) {
      lang = 'en';
      console.log("Locale language not supported. Defaulting language to English")
    }
    return lang;
  },
  getContent(language = 'en') {
    language = Api.validateLang(language);
    return Content.filter(obj => obj.lang === language)[0];
  }
};
