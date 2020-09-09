import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'


const i18n = {
  station: translate('common.station'),
  measures: translate('common.measures'),
  dataGood: translate('common.deviceStatus.dataGood2'),
}
const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 22em;
`

export default function DataGoodCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <div style={{ width: '1em' }}></div>
        <div> {i18n.dataGood}</div>
      </TitleWrapper>

      <ul>
        {cellContent.measures.map(mea => {
          return (
            <li>
              <b>{mea.key}</b> {mea.value} {mea.unit}
            </li>
          )
        })}
      </ul>
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
