import SelectStatus from 'components/elements/select-data/ticket/SelectStatus'
import React from 'react'
import { Col, DatePicker, Divider, Row, Tooltip } from 'antd'
import { get } from 'lodash-es'
import styled from 'styled-components'
import { incidentType } from '../index'
import { Fields } from './index'

const Title = styled.div`
  color: #8c8c8c;
`

export const RightContent = ({ form, record }) => {
  const stationNames = get(record, 'stations', [])
    .map(item => item.name)
    .join(',')

  return (
    <React.Fragment>
      {form.getFieldDecorator('status')(<SelectStatus />)}
      <Divider />
      <b>Thông tin chi tiết</b>
      <Row gutter={[0, 12]}>
        <Col span={12}>
          <Title>Tên trạm</Title>
        </Col>
        <Col span={12}>
          <Tooltip title={stationNames}>
            <div
              style={{
                maxWidth: 300,
                fontSize: 14,
                color: '#262626',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre',
                overflow: 'hidden',
              }}
            >
              {stationNames}
            </div>
          </Tooltip>
        </Col>

        <Col span={12}>
          <Title>Thông số liên quan</Title>
        </Col>
        <Col span={12}>----------------</Col>

        <Col span={12}>
          <Title>Loại sự cố</Title>
        </Col>
        <Col span={12}>{incidentType()[get(record, 'type')]}</Col>

        <Col span={12}>
          <Title>Thời gian bắt đầu</Title>
        </Col>
        <Col span={12}>
          {form.getFieldDecorator(Fields.timeStart)(<DatePicker showTime />)}
        </Col>

        <Col span={12}>
          <Title>Thời gian kết thúc</Title>
        </Col>
        <Col span={12}>
          {form.getFieldDecorator(Fields.timeStart)(<DatePicker showTime />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}
