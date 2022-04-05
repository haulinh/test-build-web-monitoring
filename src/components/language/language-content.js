import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {getLanguage} from 'utils/localStorage'

function getContent(languageContents, {type, itemId, field = 'name', value}){
  const language = get(languageContents, `${type}.${itemId}.language.${field}`)
  const content = get(language, getLanguage())
  return content || value || null
}

@connect(
  state => ({
    languageContents: get(state, 'language.languageContents')
  })
)
class LanguageContent extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['Station', 'StationType', 'Province']),
    itemId: PropTypes.string,
    field: PropTypes.string,
    value: PropTypes.string,
  }
  render() {
    const {languageContents, itemId, type, value, field} = this.props
    return getContent(languageContents, {itemId, type, field, value})
  }
}

export {getContent}


export default LanguageContent
