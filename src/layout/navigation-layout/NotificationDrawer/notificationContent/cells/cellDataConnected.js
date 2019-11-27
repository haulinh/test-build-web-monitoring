import React from 'react'
import _ from 'lodash'
import { Row, Col } from 'antd'

import {warningLevelImages} from 'constants/assets'
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
      icon={`${warningLevelImages.dataConnected}`}
      content={content}
      data={cellContent}
    />
  )
}