import { Content } from './content.js';

export const ContentApi = {
  langsEnabled() {
    return Content.filter(obj => obj.enabled);
  },
  validateLang(lang) {
    let langContent = Content.filter(obj => (obj.lang === lang && obj.enabled));
    let retLang = lang;
    if (langContent.length === 0) {
      retLang = 'en';
      console.log("Locale language not supported. Defaulting language to English")
    }
    return retLang;
  },
  getContent(language = 'en') {
    language = ContentApi.validateLang(language);
    return Content.filter(obj => obj.lang === language)[0];
  }
};
