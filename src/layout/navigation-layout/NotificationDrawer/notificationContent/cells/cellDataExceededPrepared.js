import React from 'react'
import _ from 'lodash'
import { Row, Col } from 'antd'

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
      <BoldTextWrap> {cellContent.title} </BoldTextWrap>
      {i18n.measurings}
      <BoldTextWrap> {cellContent.fullBody}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
      icon="https://img.icons8.com/color/2x/thermometer.png"
      content={content}
      data={cellContent}
    />
  )
}