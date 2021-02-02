import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Row, Col } from 'antd'
import styled from 'styled-components'

export const CHART_TYPE = {
  COLUMN: 'column',
  LINE: 'line',
  TABLE: 'table',
}

const i18n = {
  column: 'Cột',
  line: 'Đường',
  table: 'Bảng',
}

const groupButton = [
  {
    iconType: 'bar-chart',
    title: i18n.column,
    key: 'column',
  },
  {
    iconType: 'line-chart',
    title: i18n.line,
    key: 'line',
  },
  {
    iconType: 'table',
    title: i18n.table,
    key: 'table',
  },
]

const ButtonChart = styled.div`
  background: #eeeeee;
  border-radius: 4px;
  padding: 5px 15px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: ${props => (props.active ? '#2693FC' : 'rgba(0, 0, 0, 0.72)')};
  &:hover {
    opacity: 0.9;
  }
  i {
    margin-right: 10px;
  }
`

export default class ChartType extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      optionActive: props.chartType,
    }
  }

  onChangeChartType = optionActive => {
    const { onChange } = this.props
    this.setState({ optionActive })
    onChange(optionActive)
  }

  render() {
    const { optionActive } = this.state

    return (
      <React.Fragment>
        <Row gutter={12}>
          {groupButton.map(item => (
            <Col span={8} key={item.key}>
              <ButtonChart
                active={item.key === optionActive}
                onClick={() => this.onChangeChartType(item.key)}
              >
                <Icon type={item.iconType} />
                {item.title}
              </ButtonChart>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    )
  }
}
