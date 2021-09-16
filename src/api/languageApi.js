import { getConfigApi } from 'config'
import { getFetch, putFetch } from 'utils/fetch'

export function getLanguageUrl(prefix = '') {
  return getConfigApi().language + '/' + prefix
}

export function getListLanguageWeb() {
  return getFetch(getLanguageUrl('web'))
}

export function getListLanguageAll(query) {
  return getFetch(getLanguageUrl(''), query)
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
  getListLanguageWeb,
  getListLanguageAll,
  updateLanguage,
}
