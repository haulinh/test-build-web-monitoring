import React from 'react'

import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataExeeded: translate('common.deviceStatus.dataExceeded'),
}

export default function DataExceededCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.dataExeeded} </BoldTextWrap>
      {i18n.station}
      <BoldTextWrap> {cellContent.title} </BoldTextWrap>
      {i18n.measurings}
      <BoldTextWrap> {cellContent.fullBody}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
    icon={`${warningLevelImages}.dataExceeded`}
      content={content}
      data={cellContent}
    />
  )
}