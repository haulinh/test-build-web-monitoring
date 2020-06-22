import React from 'react'

import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataConnected: translate('common.deviceStatus.dataConnected'),
}

export default function DataConnectedCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.dataConnected} </BoldTextWrap>
      <span style={{ fontSize: '16px' }}>{i18n.station}</span>
      <BoldTextWrap> {cellContent.title}</BoldTextWrap>
    </React.Fragment>
  )

  const icon = {
    type: 'smile',
    color: 'green',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataConnected}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
