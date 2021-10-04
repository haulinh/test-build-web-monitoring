import { Col, DatePicker, Row, Tooltip } from 'antd'
import SelectStatus from 'components/elements/select-data/ticket/SelectStatus'
import { Clearfix } from 'components/layouts/styles'
import { get, isEmpty } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { incidentType } from '../index'
import { DynamicContainer } from './DynamicContainer'
import { Fields } from './index'

export const Title = styled.div`
  color: #8c8c8c;
`

const styledText = {
  maxWidth: 300,
  fontSize: 14,
  color: '#262626',
  textOverflow: 'ellipsis',
  whiteSpace: 'pre',
  overflow: 'hidden',
}

const withUpdate = (Component, update) => {
  return props => {
    const onChange = value => {
      let valueUpdate = value
      if (moment.isMoment(value)) valueUpdate = value.toDate()
      update(valueUpdate)
    }
    const newProps = {
      ...props,
      onChange,
    }
    return <Component {...newProps} />
  }
}

export const RightContent = ({ form, record, categories, updateTicket }) => {
  const stationNames = get(record, 'stations', [])
    .map(item => item.name)
    .join(',')

  const measures = get(record, 'measures', [])

  const handleUpdateField = (fieldName, value) => {
    const defaultValue = form.getFieldValue(fieldName)
    updateTicket({ [fieldName]: value || defaultValue })
  }

  return (
    <React.Fragment>
      {form.getFieldDecorator('statusId')(
        withUpdate(SelectStatus, value =>
          handleUpdateField(Fields.status, value)
        )()
      )}

      {stationNames && (
        <React.Fragment>
          <Clearfix height={12} />
          <Row gutter={[0, 12]}>
            <Col span={12}>
              <Title>Tên trạm</Title>
            </Col>
            <Col span={12}>
              <Tooltip title={stationNames}>
                <div style={styledText}>{stationNames}</div>
              </Tooltip>
            </Col>
          </Row>
        </React.Fragment>
      )}

      {!isEmpty(measures) && (
        <React.Fragment>
          <Clearfix height={12} />
          <Row>
            <Col span={12}>
              <Title>Thông số liên quan</Title>
            </Col>
            <Col span={12}>----------------</Col>
          </Row>
        </React.Fragment>
      )}

      <Clearfix height={12} />
      <Row>
        <Col span={12}>
          <Title>Loại sự cố</Title>
        </Col>
        <Col span={12}>{incidentType()[get(record, 'type')]}</Col>
      </Row>

      <Clearfix height={12} />
      <Row>
        <Col span={12}>
          <Title>Thời gian bắt đầu</Title>
        </Col>
        <Col span={12}>
          {form.getFieldDecorator(Fields.timeStart)(
            withUpdate(DatePicker, value =>
              handleUpdateField(Fields.timeStart, value)
            )()
          )}
        </Col>
      </Row>

      <Clearfix height={12} />
      <Row>
        <Col span={12}>
          <Title>Thời gian kết thúc</Title>
        </Col>
        <Col span={12}>
          {form.getFieldDecorator(Fields.timeEnd)(
            withUpdate(DatePicker, value =>
              handleUpdateField(Fields.timeEnd, value)
            )()
          )}
        </Col>
      </Row>
      <DynamicContainer form={form} categories={categories} />
    </React.Fragment>
  )
}
