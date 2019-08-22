import React from 'react'
import _ from 'lodash'
import { Row, Col } from 'antd'

import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  device: translate('common.device'),
}

export default function SensorGoodCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{cellContent.shortBody} </BoldTextWrap>
      {i18n.station}
      <BoldTextWrap> {cellContent.title} </BoldTextWrap>
      {i18n.device}
      <BoldTextWrap> {cellContent.fullBody}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
      icon=" https://img.icons8.com/color/2x/ok.png"
      content={content}
      data={cellContent}
    />
  )
}