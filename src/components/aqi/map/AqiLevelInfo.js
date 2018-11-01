import React from 'react'
import styled from 'styled-components'
import levels from '../../../constants/aqi-level'

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

  .tooltipAQI {
    position: relative;
  }
  .tooltiptextAQI {
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
}

.tooltiptextAQI::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}

.tooltipAQI:hover .tooltiptextAQI {
    visibility: visible;
    opacity: 1;
}
`

const LevelItem = styled.div`
  // padding: 2px 8px;
  width: 125px;
  height:25px;
  color: #fff;
  background: ${props => props.color || 'green'};
  text-align: center;
`

export default class AqiLevelInfo extends React.PureComponent {
  render() {
    return (
      <LevelWrapper>
        <LevelView>
          {levels.map(({ color, status, level, description }) => (
            <LevelItem color={color} key={status}>
              <div className={'tooltipAQI'}>
                <span style={{ fontSize: 11, fontWeight: 'bold'}}>
                  {level}: {status}
                </span>
                <span className={'tooltiptextAQI'}> {description} </span>
              </div>
            </LevelItem>
          ))}
        </LevelView>
      </LevelWrapper>
    )
  }
}
