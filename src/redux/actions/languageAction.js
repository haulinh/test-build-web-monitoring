// redux/reducers/lang.js
import { setLanguage } from 'utils/localStorage'
import languageApi from 'api/languageApi'

export const CHANGE_LANGUAGE = 'LANGUAGE/change-language'
export const GET_LANGUAGES = 'LANGUAGE/list-languages'

export function changeLanguage(locale = 'vi') {
  setLanguage(locale)
  return {
    type: CHANGE_LANGUAGE,
    locale,
  }
}

export function getListLanguages() {
  return async dispatch => {
    let res = await languageApi.getListLanguages()
    let { success, data } = res
    if (!success) return
    dispatch({
      type: GET_LANGUAGES,
      payload: data,
    })
  }
}
