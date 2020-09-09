import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'


const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorError: translate('common.deviceStatus.sensorError'),
  measurings: translate('common.measures'),

}

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 22em;
`

export default function SensorErrorCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <div style={{ width: '1em' }}></div>
        <div> {i18n.sensorError}</div>
      </TitleWrapper>

      <ul>
        {cellContent.measures.map(mea => {
          return (
            <li>
              <b>{mea.key}</b>
            </li>
          )
        })}
      </ul>
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
