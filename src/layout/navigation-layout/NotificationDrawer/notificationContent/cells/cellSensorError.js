import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorError: translate('common.deviceStatus.sensorError'),
}

export default function SensorErrorCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{i18n.sensorError} </BoldTextWrap>
      {i18n.station}
      <span> {cellContent.title} </span>
      {i18n.device}
      <span> {cellContent.fullBody}</span>
    </React.Fragment>
  )

  const icon = {
    type: 'tool',
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
