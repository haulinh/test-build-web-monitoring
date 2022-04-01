import get from 'lodash/get'
import React from 'react'
import {connect} from 'react-redux'
import {getLanguage} from 'utils/localStorage'

function getContent(languageContents, {type, itemId, field, value}){
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
  render() {
    const {languageContents, itemId, type, field, value} = this.props
    return getContent(languageContents, {itemId, type, field, value})
  }
}

export {getContent}


export default LanguageContent
