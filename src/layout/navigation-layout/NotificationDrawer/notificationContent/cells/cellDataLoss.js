import React from 'react'

import {warningLevelImages} from 'constants/assets'
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
      <BoldTextWrap> {cellContent.title}</BoldTextWrap>
    </React.Fragment>
  )

  return (
    <DefaultCell 
      icon={`${warningLevelImages.dataLoss}`}
      content={content}
      data={cellContent}
    />
  )
}