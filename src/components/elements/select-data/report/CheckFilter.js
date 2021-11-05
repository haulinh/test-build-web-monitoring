import { Col, Icon, Switch } from 'antd'
import React from 'react'
import styled from 'styled-components'

const Text = styled.div`
  font-size: 16px;
  font-weight: 600px;
`

const CheckFilter = props => {
  return (
    <React.Fragment>
      <Col span={5}>
        <Icon
          style={{
            paddingTop: '10px',
            fontSize: '22px',
            width: '50px',
            height: '50px',
          }}
          type="question-circle"
        />
      </Col>
      <Col span={14}>
        <Text>Kiểm duyệt dữ liệu</Text>
      </Col>
      <Col span={5}>
        <Switch {...props} style={{ marginLeft: '10px' }} />
      </Col>
    </React.Fragment>
  )
}

export default CheckFilter
