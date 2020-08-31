import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorGood: translate('common.deviceStatus.sensorGood'),
  measurings: translate('common.measures'),

}

export default function SensorGoodCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.sensorGood} </BoldTextWrap>
      {i18n.station}
      <span> {cellContent.title} </span>
      {i18n.measurings}
      <span> {cellContent.fullBody.replace('Thiết bị tốt', '')}</span>
    </React.Fragment>
  )

  const icon = {
    // type: 'tool',
    type: 'good',
    color: 'red',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.sensorGood}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
