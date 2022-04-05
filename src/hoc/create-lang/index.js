/*eslint-disable*/
import React from 'react'
import PropTypes from 'prop-types'
import objectPath from 'object-path'
import { connectAutoDispatch } from 'redux/connect'
import { changeLanguage, updateLanguageContent } from 'redux/actions/languageAction'
import { autobind } from 'core-decorators'
import dot from 'dot'

// window.currentLanguage = languages()[getLanguage()]
// eslint-disable-next-line
export const langPropTypes = PropTypes.shape({
  t: PropTypes.func,
  changeLanguage: PropTypes.func,
})

export const normalizeString = str => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

// NOTE apply ES6
export function removeAccents(language, str) {
  if (!str) {
    return str
  }
  if (language === 'en') {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }
  return str
}

export function removeAccentsSort(str) {
  if (!str) {
    return str
  }
  return normalizeString(str)
}

export function translate(key, params = {}, isParse = true) {
  try {
    const languageData =
      typeof window !== 'undefined'
        ? window.currentLanguage
        : global.currentLanguage

    let translated = objectPath.get(languageData, key)

    if (translated && isParse) {
      const tempFn = dot.template(translated)
      return tempFn(params)
    } else return translated ? translated : ''
  } catch (ex) {
    return ' -- '
  }
}

const createLanguageHoc = Component => {
  @connectAutoDispatch(
    state => ({
      languageRaw: state.language.dataInitial,
      languageData: state.language.dataSource[state.language.locale]
        ? state.language.dataSource[state.language.locale]
        : state.language.dataInitial[state.language.locale],
      languageLocale: state.language.locale,
    }),
    { changeLanguage, updateLanguageContent}
  )
  @autobind
  class LanguageHoc extends React.Component {
    static propTypes = {
      changeLanguage: PropTypes.func,
    }

    translate(key, params = {}, isParse = true) {
      let translated = objectPath.get(this.props.languageData, key)
      if (translated && isParse) {
        const tempFn = dot.template(translated)
        return tempFn(params)
      } else return translated ? translated : ''
    }

    translateManual(key, params = {}, isParse = true, locale) {
      let translated = objectPath.get(this.props.languageRaw[locale], key)
      if (translated && isParse) {
        const tempFn = dot.template(translated)
        return tempFn(params)
      } else return translated ? translated : ''
    }

    changeLanguage(lang) {
      this.props.changeLanguage(lang)
    }

    createNameSpace(namespace) {
      return (key, params, isParse) => {
        return this.translate(`${namespace}.${key}`, params, isParse)
      }
    }

    render() {
      const langProps = {
        t: this.translate,
        translateManual: this.translateManual,
        createNameSpace: this.createNameSpace,
        locale: this.props.languageLocale,
        changeLanguage: this.changeLanguage,
      }
      return <Component {...this.props} ref={this.props.ref} lang={langProps} />
    }
  }
  return LanguageHoc
}
export default createLanguageHoc
