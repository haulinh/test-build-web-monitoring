// redux/reducers/language.js

import update from 'react-addons-update'
import {
  CHANGE_LANGUAGE,
  LIST_DICTIONARY_LANGUAGES,
  LIST_LANGUAGES,
  LIST_LANGUAGE_CONTENTS,
} from '../actions/languageAction'
import languages from 'languages'
import { getLanguage } from 'utils/localStorage'
import * as _ from 'lodash'

const LIST_LANGUAGE = [
  {
    flag: 'US',
    locale: 'en',
    name: 'English',
  },
  {
    flag: 'VN',
    locale: 'vi',
    name: 'Vietnamese',
  },
]

const initialState = {
  locale: getLanguage(),
  dataInitial: languages(),
  isLoading: true,
  dataSource: {},
  listLanguage: [],
  languageContents: []
}

export default function createReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return changeLanguage(state, action)
    case LIST_DICTIONARY_LANGUAGES:
      return getListDictionaryLanguageWeb(state, action)
    case LIST_LANGUAGES:
      return getListLanguages(state, action)
    case LIST_LANGUAGE_CONTENTS:
      return getListLanguageContents(state, action)
    default:
      return state
  }
}

export function getListLanguageContents(state, { payload }) {
  const groupData = payload.reduce(
    (prev, item) => ({
      ...prev,
      [item.type]: {
        ...prev[item.type],
        [item.itemId]: item
      }
    }), {})

  return update(state, {
    languageContents: {
      $set: groupData,
    },
  })
}

export function getListLanguages(state, { payload }) {
  return update(state, {
    listLanguage: {
      $set: payload || LIST_LANGUAGE,
    },
  })
}

export function changeLanguage(state, { locale }) {
  return update(state, {
    locale: {
      $set: locale,
    },
  })
}

function getListDictionaryLanguageWeb(state, { payload }) {
  let data = {}
  data = getLanguageChoice(state.dataInitial, payload, state.locale)

  if (
    process.env.NODE_ENV !== 'production' &&
    state.dataInitial[state.locale]
  ) {
    data = state.dataInitial[state.locale]
  }
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
