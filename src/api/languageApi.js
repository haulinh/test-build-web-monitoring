import { getConfigApi } from 'config'
import { getFetch, putFetch } from 'utils/fetch'

export function getLanguageUrl(prefix = '') {
  return getConfigApi().language + '/' + prefix
}

export function getListLanguages() {
  return getFetch(getLanguageUrl('all'))
}

export function updateLanguage(locale, value = {}, isMobile = false) {
  let url = getLanguageUrl(locale)
  return putFetch(url, {
    value: value,
    isMobile,
  })
}

/* #endregion */

/* #region  NOTE  cấu hình WQI-Calculation */

export default {
  getListLanguages,
  updateLanguage,
}
