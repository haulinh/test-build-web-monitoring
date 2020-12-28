import React from 'react'
import { connect } from 'react-redux'

@connect(state => ({
  userInfo: state.auth.userInfo,
  languageData: state.language.data[state.auth.userInfo.preferredLanguage],
  languageLocale: state.auth.userInfo.preferredLanguage,
}))
export default class AppContainer extends React.Component {
  componentWillMount() {
    window.currentLanguage = this.props.languageData
  }

  render() {
    return this.props.children
  }
}
