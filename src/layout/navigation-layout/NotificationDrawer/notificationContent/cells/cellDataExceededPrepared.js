import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'


const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measure2'),
  dataExceededPrepare: translate('common.deviceStatus.dataExceededPrepare'),
}

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 22em;
`

export default function DataExceededPreparedCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <div style={{ width: '1em' }}></div>
        <div> {i18n.dataExceededPrepare}</div>
      </TitleWrapper>

      <ul>
        {cellContent.measures.map(mea => {
          return (
            <li>
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
