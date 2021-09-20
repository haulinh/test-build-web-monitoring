import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'
import _ from 'lodash'

function i18n() {
  return {
    station: translate('common.station'),
    measurings: translate('common.measure2'),
    dataExceededPrepare: translate('common.deviceStatus.dataExceededPrepare'),
  }
}

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default function DataExceededPreparedCell(props) {
  const { cellContent } = props
  const measures = _.get(props, 'cellContent.measures', [])

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n().station} {cellContent.station}
        </BoldTextWrap>
        <span>&nbsp; {i18n().dataExceededPrepare}</span>
      </TitleWrapper>

      <ul>
        {measures.map(mea => {
          return (
            <li key={mea.key} style={{ listStyleType: 'disc' }}>
              <b>{mea.key}</b> {mea.value} {mea.unit} {mea.moreContent}
            </li>
          )
        })}
      </ul>
    </React.Fragment>
  )

  const icon = {
    // type: 'meh',
    type: 'exceededPrepared',
    color: 'yellow',
  }

  return (
    <DefaultCell
      // icon={`${warningLevelImages.dataExceededPrepared}`}
      icon={icon}
      content={content}
      data={cellContent}
    />
  )
}
