// redux/reducers/lang.js
import { setLanguage } from 'utils/localStorage'
import languageApi from 'api/languageApi'
import CalculateApi from 'api/CalculateApi'

export const CHANGE_LANGUAGE = 'LANGUAGE/change-language'
export const LIST_DICTIONARY_LANGUAGES = 'LANGUAGE/list-dictionary-languages'
export const LIST_LANGUAGES = 'LANGUAGE/list-languages'

export const LIST_LANGUAGE_CONTENTS = 'LANGUAGE/list-contents'
export const UPDATE_LANGUAGE_CONTENT = 'LANGUAGE/update-contents'

export function changeLanguage(locale = 'vi') {
  setLanguage(locale)
  return {
    type: CHANGE_LANGUAGE,
    locale,
  }
}

export function getListLanguageWeb() {
  return async dispatch => {
    // let res = await languageApi.getListLanguageWeb()
    const [response, response2] = await Promise.all([
      languageApi.getListLanguageWeb(),
      languageApi.getListLanguages(),
    ])
    if (!response.success && !response2.success) return
    dispatch({
      type: LIST_DICTIONARY_LANGUAGES,
      payload: response.data,
    })
    dispatch({
      type: LIST_LANGUAGES,
      payload: response2.data,
    })
  }
}

export function getListLanguageContents() {
  return async dispatch => {
    const data = await CalculateApi.getAllLanguageContent()

    dispatch({
      type: LIST_LANGUAGE_CONTENTS,
      payload: data,
    })
  }
}

export function updateLanguageContent(params) {
  return async dispatch => {
    const data = await CalculateApi.updateLanguageContent(params)
    dispatch({
      type: UPDATE_LANGUAGE_CONTENT,
      payload: data,
    })
  }
}
