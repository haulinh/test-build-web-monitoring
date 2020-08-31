import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorError: translate('common.deviceStatus.sensorError'),
  measurings: translate('common.measures'),

}

export default function SensorErrorCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.sensorError} </BoldTextWrap>
      {i18n.station}
      <span> {cellContent.title} </span>
      {i18n.measurings}
      <span> {cellContent.fullBody.replace('Lỗi thiết bị', '')}</span>
    </React.Fragment>
  )

  const icon = {
    // type: 'tool',
    type: 'sensorError',
    color: 'red',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.sensorError}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
