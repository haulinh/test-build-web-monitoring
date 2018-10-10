import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'

import ChartRatioView from './ChartRatio'
import ChartStatusView from './ChartStatus'

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

@autobind
export default class ChartStatisticalView extends React.PureComponent {
  render() {
    return (
      <WrapperView>
        <ChartStatusView data={this.props.data} />
        <ChartRatioView
          onChange={this.props.onChange}
          province={this.props.province}
        />
      </WrapperView>
    )
  }
}
