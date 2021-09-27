import React from 'react'
import { connect } from 'react-redux'
import { getListLanguageWeb } from 'redux/actions/languageAction'
import languageApi from 'api/languageApi'
import slug from 'constants/slug'
import languages from 'languages'
import * as _ from 'lodash'

@connect(
  state => ({
    languageData: state.language.dataInitial[state.language.locale],
    languageLocale: state.language.locale,
  }),
  {
    getListLanguageWeb,
  }
)
export default class AppContainer extends React.Component {
  async componentWillMount() {
    if (window.location.pathname !== slug.login.loginWithEmail) {
      this.initialLanguage()
      this.props.getListLanguageWeb()
    }
  }

  async initialLanguage() {
    // initial language
    const response = await languageApi.versionLastedLanguage()
    let { success, data } = response
    const version = _.get(window.config, 'apps.version', '')

    if (success && _.get(data, 'version') !== version) {
      const keys = _.keys(languages())
      keys.forEach(locale => {
        const data = {
          value: languages()[locale],
          version: version,
          locale,
        }
        languageApi.initialLanguage(data)
      })
    }
  }

  render() {
    return this.props.children
  }
}
