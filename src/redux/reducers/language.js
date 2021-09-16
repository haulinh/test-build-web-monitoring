// redux/reducers/language.js

import update from 'react-addons-update'
import { CHANGE_LANGUAGE, GET_LANGUAGES } from '../actions/languageAction'
import languages from 'languages'
import { getLanguage } from 'utils/localStorage'
import * as _ from 'lodash'

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
      return getListLanguageWeb(state, action)
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

function getListLanguageWeb(state, { payload }) {
  const data = getLanguageChoice(state.dataInitial, payload, state.locale)
  window.currentLanguage = data
  return update(state, {
    dataSource: {
      $set: payload,
    },
    isLoading: {
      $set: false,
    },
  })
}

function getLanguageChoice(dataInitial, dataSource, language) {
  let data = _.get(dataInitial, `${language}`)
  data = {
    ...data,
    ..._.get(dataSource, `${language}`),
  }
  return data
}
