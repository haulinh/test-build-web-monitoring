import styled from 'styled-components'
import React from 'react'
const ExandaleComponentWrapper = styled.div`
  display: flex;
  /* justify-content: space-around; */
  flex-wrap: wrap;
  padding-left: 7em;
  padding-right: 7em;
  width: 100%;
`
const BottleStatusWrapper = styled.div`
  width: 14%;
`

const BaseTag = ({ bottleIndex, status }) => {
  const BaseTagWrapper = styled.div`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 8px;
  `
  const statusStyle = {
    paddingLeft: '2em',
    paddingRight: '2em',
    paddingBottom: '1em',
    paddingTop: '4px',
    // fontFamily: "SF Pro Text",
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '12px',
    lineHeight: '14px',
  }
  const headerStyle = {
    textAlign: 'center',
    width: '10em',
    paddingTop: '1em',
    paddingLeft: '2em',
    paddingRight: '2em',
    // fontFamily: "SF Pro Text",
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '14px',
    color: '#000000',
  }
  return (
    <BaseTagWrapper
      style={{
        backgroundColor:
          status === 'SUCCESS' ? '#DCF3D1' : 'rgba(255, 56, 56, 0.2)',
      }}
    >
      <b style={headerStyle}>Binh so {bottleIndex}</b>
      <div
        style={{
          ...statusStyle,
          color: status === 'SUCCESS' ? '#52C41A' : '#F5222D',
        }}
      >
        {status}
      </div>
    </BaseTagWrapper>
  )
}

const ExpandedComponent = ({ data, dataExapand }) => {
  return (
    <ExandaleComponentWrapper>
      {dataExapand.map(bottle => {
        switch (bottle.status) {
          case 'SUCCESS':
            return (
              <BottleStatusWrapper>
                <BaseTag
                  key={bottle.index}
                  bottleIndex={bottle.index}
                  status={bottle.status}
                />
              </BottleStatusWrapper>
            )
          case 'FAILED':
            return (
              <BottleStatusWrapper>
                <BaseTag
                  key={bottle.index}
                  bottleIndex={bottle.index}
                  status={bottle.status}
                />
              </BottleStatusWrapper>
            )
          default:
            return (
              <BottleStatusWrapper>
                <BaseTag
                  key={bottle.index}
                  bottleIndex={bottle.index}
                  status={bottle.status}
                />
              </BottleStatusWrapper>
            )
        }
        // return <div>fasdfasdf</div>;
      })}
    </ExandaleComponentWrapper>
  )
}

export default ExpandedComponent
