import React from 'react'

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
      {i18n.station}
      <BoldTextWrap> {cellContent.title}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
      icon="https://img.icons8.com/color/2x/wifi.png"
      content={content}
      data={cellContent}
    />
  )
}