import { Content } from './content.js';

export const Api = {
  getContent(language = 'en') {
    return Content.filter(obj => obj.lang === language)[0];
  }
};
