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
      <span> {cellContent.title} </span>
      {i18n.measurings}
      <span> {cellContent.fullBody}</span>
    </React.Fragment>
  )

  const icon = {
    type: 'frown',
    color: 'red',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataExceeded}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
