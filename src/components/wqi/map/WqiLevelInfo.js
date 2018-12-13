import React from 'react'
import styled from 'styled-components'
import levels from '../../../constants/wqi-level'
import { Tooltip } from 'antd'

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 16px;
  background: #ffffff;
  border: 1px solid #cdcdcd;
  border-radius: 3px;
  z-index: 2;
`

const LevelView = styled.div`
  display: flex;
`

const LevelItem = styled.div`
  // padding: 2px 8px;
  width: 125px;
  height: 25px;
  color: #fff;
  background: ${props => props.color || 'green'};
  text-align: center;
`

export default class WqiLevelInfo extends React.PureComponent {
  render() {
    return (
      <LevelWrapper>
        <LevelView>
          {levels.map(({ color, status, level, description }) => (
            <Tooltip placement="top" title={description} key={status}>
              <LevelItem color={color}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 'bold' }}>
                    {level}: {status}
                  </span>
                </div>
              </LevelItem>
            </Tooltip>
          ))}
        </LevelView>
      </LevelWrapper>
    )
  }
}
