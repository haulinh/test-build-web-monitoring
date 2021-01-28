import React from 'react'
import styled from 'styled-components'
// import levels from "../../../constants/aqi-level"
import { Tooltip } from 'antd'

import {sortBy} from 'lodash'

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 24px;
  border-radius: 3px;
  z-index: 2;
`

const LevelView = styled.div`
  display: flex;
`

const LevelItem = styled.div`
  // padding: 2px 8px;
  width: 115px;
  height: 25px;
  color: ${props => props.colorFont || '#fff'};
  background: ${props => props.color || 'green'};
  text-align: center;
`

const LevelLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #000000;
  text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px #ffffff, -1px -1px #fff;
`

export default class WqiLevelInfo extends React.PureComponent {
  render() {
    // console.log(sortBy(this.props.wqiLevel,['min']),"wqiLevel")
    return (
      <LevelWrapper>
        <LevelView>
          {sortBy(this.props.wqiLevel,['min']).map(
            (
              { color, backgroundColor, name, description, min, max },
              index
            ) => {
              // console.log(min, max, name, index , "0------0")
              return (
                <Tooltip key={index} placement="top" title={description}>
                  <LevelLabel>
                    <div>
                      {/* <span>{min}</span> */}
                      <span>{index === 0 ? min : ''}</span>
                    </div>

                    <div>
                      <span>{max}</span>
                    </div>
                  </LevelLabel>
                  <LevelItem
                    color={backgroundColor}
                    key={name}
                    colorFont={color}
                  >
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 'bold' }}>
                        {name}
                      </span>
                    </div>
                  </LevelItem>
                </Tooltip>
              )
            }
          )}
        </LevelView>
      </LevelWrapper>
    )
  }
}
