import React from 'react'

// import { warningLevelImages } from 'constants/assets'
import { translate } from 'hoc/create-lang'
import DefaultCell from './_defaultCell'
import { BoldTextWrap } from './_helperComponent'
import styled from 'styled-components'

const i18n = {
  station: translate('common.station'),
  measurings: translate('common.measures'),
  dataExeeded: translate('common.deviceStatus.dataExceeded'),
}

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 22em;
`

export default function DataExceededCell(props) {
  const { cellContent } = props

  const content = (
    <React.Fragment>
      <TitleWrapper>
        <BoldTextWrap>
          {i18n.station} {cellContent.station}
        </BoldTextWrap>
        <div style={{ width: '1em' }}></div>
        <div> {i18n.dataExeeded}</div>
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
    // type: 'frown',
    type: 'exceeded',
    color: 'red',
  }

  return <DefaultCell icon={icon} content={content} data={cellContent} />
}
