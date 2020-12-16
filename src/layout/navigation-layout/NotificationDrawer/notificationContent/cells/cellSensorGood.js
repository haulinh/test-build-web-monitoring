import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'
import _ from 'lodash'

const i18n = {
  station: translate('common.station'),
  device: translate('common.device'),
  sensorGood: translate('common.deviceStatus.sensorGood'),
  measurings: translate('common.measures'),
}
const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default function SensorGoodCell(props) {
  const { cellContent } = props
  const measures = _.get(props, 'cellContent.measures', [])

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <span>&nbsp; {i18n.sensorGood}</span>
      </TitleWrapper>

      <ul>
        {measures.map(mea => {
          return (
            <li key={mea.key} style={{ listStyleType: 'disc' }}>
              <b>{mea.key}</b>
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
