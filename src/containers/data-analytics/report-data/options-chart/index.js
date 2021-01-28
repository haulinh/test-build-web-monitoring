import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Tabs, Row, Col } from 'antd'
import styled from 'styled-components'

const i18n = {
  column: 'Cột',
  line: 'Đường',
  table: 'Bảng',
}

const ActiveContainer = styled.div`
  .active {
    color: ${props => (props.isActive ? 'red' : 'undefine')};
  }
`

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

export default class OptionsChart extends Component {
  static propTypes = {
    prop: PropTypes,
  }

  state = {
    optionActive: 'column',
  }

  onChange = optionActive => {
    console.log('log', optionActive)
    this.setState({ optionActive })
  }

  render() {
    const { optionActive } = this.state
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          {groupButton.map(button => (
            <Col span={6}>
              <Button
                style={{ backgroundColor: '#F4F5F7', width: '100%' }}
                onClick={() => this.onChange(button.key)}
              >
                <Icon
                  className="active"
                  type={button.iconType}
                  style={{ fontSize: '16px' }}
                  theme="outlined"
                />
                <span
                  className="active"
                  style={{
                    color: optionActive === button.key ? 'red' : 'undefine',
                  }}
                >
                  {button.title}
                </span>
              </Button>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    )
  }
}
