import { Button, Col, Row } from 'antd'
import { Clearfix } from 'components/elements'
import React, { Component } from 'react'
import TableAlarmSignal from './TableAlarmSignal'

export default class AlarmSignal extends Component {
  render() {
    const { users, roles } = this.props

    return (
      <React.Fragment>
        <TableAlarmSignal users={users} roles={roles} />
        <Clearfix height={24} />
        <Row type="flex" justify="end">
          <Col span={6}>
            <Button type="primary" block size="large">
              Lưu
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
