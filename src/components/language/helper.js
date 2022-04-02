import {getLanguage} from "utils/localStorage";
import {translate as t} from 'hoc/create-lang'
import get from 'lodash/get'

const i18n = {
  lang: {
    vi: t('language.list.colVI'),
    en: t('language.list.colEN'),
    tw: t('language.list.colTW'),
  }
}

export const LangConfig = [
  {lang: 'vi', code: 'VN', label: i18n.lang.vi },
  {lang: 'en', code: 'US', label: i18n.lang.en},
  {lang: 'tw', code: 'TW', label: i18n.lang.tw } 
] 

export function getLanguageContents(values, fields = ['name']) {
  const currentLang = getLanguage();
  const contents = get(values, 'language');

  const getContent = (field, value, lang) => {
    const isSetupLanguage = !!get(contents, field);
    if (currentLang === lang) return value
    return isSetupLanguage ? get(contents, `${field}.${lang}`, '').trim() : value;
  }

  const results = fields.reduce((prev, field) => {
    const inputValue = get(values, field, '').trim();
    prev[field] = LangConfig.reduce((p, {lang}) => ({
      ...p,
      [lang]: getContent(field, inputValue, lang)
    }), {})
    return prev
  }, {})

  return results
}
