import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Card } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { translate } from 'hoc/create-lang'
import ChartRatioView from './ChartRatio'
import ChartStatusView from './ChartStatus'

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

const dataLabels = {
  enabled: true,
  // rotation: -90,
  color: '#FFFFFF',
  y: 12,
  // padding: 10,
  align: 'center',
  allowOverlap: true
}

@autobind
export default class ChartStatisticalView extends React.PureComponent {
  render() {
    return (
      <WrapperView>
        <ChartStatusView data={this.props.data}/>
        <ChartRatioView onChange={this.props.onChange} province={this.props.province} />
      </WrapperView>
    )
  }
}
