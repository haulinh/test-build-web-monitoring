import React from 'react'
import { connect } from 'react-redux'
import { getListLanguageWeb } from 'redux/actions/languageAction'

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
  componentWillMount() {
    this.props.getListLanguageWeb()
  }

  render() {
    return this.props.children
  }
}
