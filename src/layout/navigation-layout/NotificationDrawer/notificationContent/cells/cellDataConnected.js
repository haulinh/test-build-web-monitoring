import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataConnected: translate('common.deviceStatus.dataConnected'),
}
const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export default function DataConnectedCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <span>&nbsp; {i18n.dataConnected}</span>
      </TitleWrapper>
    </React.Fragment>
  )

  const icon = {
    // type: 'smile',
    type: 'good',
    color: 'green',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataConnected}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
