// redux/reducers/language.js

import update from 'react-addons-update'
import { CHANGE_LANGUAGE, GET_LANGUAGES } from '../actions/languageAction'
import languages from 'languages'
import { getLanguage } from 'utils/localStorage'

const initialState = {
  locale: getLanguage(),
  dataInitial: languages(),
  isLoading: true,
  dataSource: {},
}

export default function createReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return changeLanguage(state, action)
    case GET_LANGUAGES:
      return getListLanguages(state, action)
    default:
      return state
  }
}

export function changeLanguage(state, { locale }) {
  return update(state, {
    locale: {
      $set: locale,
    },
  })
}

function getListLanguages(state, { payload }) {
  window.currentLanguage = languages()[getLanguage()]
  return update(state, {
    dataSource: {
      $set: payload,
    },
    isLoading: {
      $set: false,
    },
  })
}
