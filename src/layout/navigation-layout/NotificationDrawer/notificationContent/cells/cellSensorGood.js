import React from 'react'

import {warningLevelImages} from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorGood: translate('common.deviceStatus.sensorGood'),

}

export default function SensorGoodCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.sensorGood} </BoldTextWrap>
      {i18n.station}
      <BoldTextWrap> {cellContent.title} </BoldTextWrap>
      {i18n.device}
      <BoldTextWrap> {cellContent.fullBody}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
      icon={`${warningLevelImages.sensorGood}`}
      content={content}
      data={cellContent}
    />
  )
}