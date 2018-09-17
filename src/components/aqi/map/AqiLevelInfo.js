import React from 'react'
import styled from 'styled-components'
import levels from '../../../constants/aqi-level'

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: #ffffff;
  border: 1px solid #cdcdcd;
  border-radius: 3px;
  z-index: 2;
`

const LevelView = styled.div`
  display: flex;
`

const LevelItem = styled.div`
  padding: 2px 8px;
  color: #fff;
  background: ${props => props.color || 'green'};
`

export default class AqiLevelInfo extends React.PureComponent {
  render() {
    return (
      <LevelWrapper>
        <LevelView>
          {levels.map(({ color, status, level }) => (
            <LevelItem color={color} key={status}>
              {level}: {status}
            </LevelItem>
          ))}
        </LevelView>
      </LevelWrapper>
    )
  }
}
