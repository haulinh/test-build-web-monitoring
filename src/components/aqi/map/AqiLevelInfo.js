import React from 'react'
import styled from 'styled-components'
import levels from '../../../constants/aqi-level'

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: #ffffff;
  border: 1px solid #eee;
  z-index: 2;
`

const LevelView = styled.div`display: flex;`

const LevelItem = styled.div`padding: 4px 8px; color: #fff; background: ${props => props.color || 'green'}`

export default class AqiLevelInfo extends React.PureComponent {
  render () {
    return (
      <LevelWrapper>
        <LevelView>
          {
            levels.map(({color, status, level}) => <LevelItem color={color}>{level}: {status}</LevelItem>) 
          }
        </LevelView>
      </LevelWrapper>
    )
  }
}