import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'

const MeasuringItemWrapper = styled.div`
  display: flex;
  padding: 8px 8px;
  height: 64px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  border: solid 1px ${props => props.color};
  background-color: ${props => props.color};
  &:hover {
    cursor: pointer;
  }
`

const MeasuringName = styled.span`
  padding: 0 5px 0 5px;
  display: flex;
  font-size: 14px;
  color: #ffffff;  
  border-radius: 3px;
`

@autobind
export default class MeasuringItem extends React.PureComponent {
  
  getStatusColor() {
    const { statusDevice } = this.props
    switch (statusDevice){
      case 0:
        return colorLevels.GOOD

      case 1: 
        return colorLevels.EXCEEDED_PREPARING

      default:
       return colorLevels.EXCEEDED
    }
  }

  render() {
    return (
      <MeasuringItemWrapper
        onClick={this.props.onClick}
        color={this.getStatusColor()}
      >
        <MeasuringName>{this.props.name}</MeasuringName>
      </MeasuringItemWrapper>
    )
  }
}
