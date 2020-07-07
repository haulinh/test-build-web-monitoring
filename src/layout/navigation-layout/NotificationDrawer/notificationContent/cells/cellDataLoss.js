import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataLoss: translate('common.deviceStatus.dataLoss'),
}

export default function DataLossCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <BoldTextWrap>{cellContent.shortBody} </BoldTextWrap>
      {i18n.station}
      <span> {cellContent.title}</span>
    </React.Fragment>
  )

  const icon = {
    // type: 'frown',
    type: 'dataLoss',
    color: 'grey',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataLoss}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
