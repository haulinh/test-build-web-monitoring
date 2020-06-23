import React from 'react'

import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataExceededPrepare: translate('common.deviceStatus.dataExceededPrepare'),
}

export default function DataExceededPreparedCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.dataExceededPrepare} </BoldTextWrap>
      {i18n.station}
      <span> {cellContent.title} </span>
      {i18n.measurings}
      <span> {cellContent.fullBody}</span>
    </React.Fragment>
  )

  const icon = {
    type: 'meh',
    color: 'yellow',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataExceededPrepared}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
