import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataLoss: translate('common.deviceStatus.dataLoss'),
}
const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default function DataLossCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <span>&nbsp; {i18n.dataLoss}</span>
      </TitleWrapper>
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
