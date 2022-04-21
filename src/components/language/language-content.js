import { autobind } from 'core-decorators'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getLanguage } from 'utils/localStorage'

function getContent(
  languageContents,
  { type, itemId, itemKey, field = 'name', value }
) {
  const language = get(languageContents, [
    type,
    itemId || itemKey,
    'language',
    field,
  ])

  const content = get(language, getLanguage())

  return content || value || null
}

@connect(state => ({
  languageContents: get(state, 'language.languageContents'),
}))
class LanguageContent extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['Station', 'StationType', 'Province', 'Measure']),
    itemId: PropTypes.string,
    field: PropTypes.string,
    value: PropTypes.string,
    itemKey: PropTypes.string,
  }
  render() {
    const { languageContents, ...pathParams } = this.props
    return getContent(languageContents, pathParams)
  }
}

export const withLanguageContent = WrappedComponent => {
  @connect(state => ({
    languageContents: get(state, 'language.languageContents'),
  }))
  @autobind
  class LanguageContent extends React.Component {
    handleTranslateContent = pathParams => {
      const { languageContents } = this.props
      return getContent(languageContents, pathParams)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          translateContent={this.handleTranslateContent}
        />
      )
    }
  }

  return LanguageContent
}

export { getContent }

export default LanguageContent
