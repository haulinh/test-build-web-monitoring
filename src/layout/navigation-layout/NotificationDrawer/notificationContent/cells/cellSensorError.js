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
  sensorError: translate('common.deviceStatus.sensorError'),
  measurings: translate('common.measures'),
}

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default function SensorErrorCell(props) {
  const { cellContent } = props
  const measures = _.get(props, 'cellContent.measures', [])

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <span>&nbsp; {i18n.sensorError}</span>
      </TitleWrapper>

      <ul>
        {measures.map(mea => {
          return (
            <li style={{ listStyleType: 'disc' }}>
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
