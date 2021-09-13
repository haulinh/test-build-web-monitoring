import React from 'react'
import { connect } from 'react-redux'
import { getListLanguages } from 'redux/actions/languageAction'

@connect(
  state => ({
    languageData: state.language.dataInitial[state.language.locale],
    languageLocale: state.language.locale,
    isLoading: state.language.isLoading,
  }),
  {
    getListLanguages,
  }
)
export default class AppContainer extends React.Component {
  componentWillMount() {
    this.props.getListLanguages()
  }

  render() {
    return this.props.children
  }
}
