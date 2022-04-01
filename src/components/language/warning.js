import React from 'react'
import {WarningWrapper} from './styled'
import dangerIcon from 'assets/svg-icons/danger.svg'
import {translate as t} from 'hoc/create-lang'

const i18n = {
  content: (lang) => t('languageSetup.warningContent', {lang}),
}

export const Warning = ({lang}) => {
  return (
    <WarningWrapper>
      <img src={dangerIcon} alt="" />
      <div dangerouslySetInnerHTML={{__html: i18n.content(lang)}} />
    </WarningWrapper>
  )
} 
