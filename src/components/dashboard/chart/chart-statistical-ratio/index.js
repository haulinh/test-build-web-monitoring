import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Card } from 'antd'
const ReactHighcharts = require('react-highcharts')

const config = (title, series, type = 'column') => ({
  chart: {
    type
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: ['Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'HCM', 'Cần Thơ']
  },
  yAxis: {
    min: 0,
    title: {
      text: title
    }
  },
  legend: {
    reversed: true
  },
  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  series: [
    {
      name: series[0],
      data: [5, 3, 4, 7, 2]
    },
    {
      name: series[1],
      data: [2, 2, 3, 2, 1],
      color: 'red'
    }
  ],
  tooltip: {
    pointFormat:
      '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
    shared: true
  },
  plotOptions: {
    column: {
      stacking: 'percent'
    }
  }
})

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

@autobind
export default class HeaderView extends React.PureComponent {
  handleItemSelected = value => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    return (
      <WrapperView>
        <Card bordered style={{ flex: 1, marginRight: 8 }}>
          <ReactHighcharts
            config={config(
              'Tỉ lệ nhận dữ liệu theo từng địa phương theo tháng',
              ['Nhận được', 'Không nhận được']
            )}
          />
        </Card>
        <Card bordered style={{ flex: 1, marginLeft: 8 }}>
          <ReactHighcharts
            config={config(
              'Tình trạng hoạt động của trạm',
              ['Hoạt động', 'Không hoạt động'],
              'bar'
            )}
          />
        </Card>
      </WrapperView>
    )
  }
}
