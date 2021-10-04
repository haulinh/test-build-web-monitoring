import { Col, DatePicker, Row, Tooltip } from 'antd'
import SelectStatus from 'components/elements/select-data/ticket/SelectStatus'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { get, isEmpty } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { incidentType } from '../../index'
import { DynamicContainer } from './DynamicContainer'
import { Fields } from '../index'

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

const RightContent = ({
  form,
  record,
  categories,
  updateTicket,
  updateCategoryTicket,
}) => {
  const stationNames = get(record, 'stations', [])
    .map(item => item.name)
    .join(',')

  const measures = get(record, 'measures', [])

  const handleUpdateField = async (fieldName, value) => {
    const defaultValue = form.getFieldValue(fieldName)
    const values = await form.validateFields()
    if (!values) return
    updateTicket({ [fieldName]: value || defaultValue })
  }

  const handleUpdateDynamicField = async (fieldName, value) => {
    const defaultValue = form.getFieldValue(fieldName)

    console.log('update')

    return updateCategoryTicket({ [fieldName]: value || defaultValue })
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
          <Clearfix height={16} />
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
          <Clearfix height={16} />
          <Row>
            <Col span={12}>
              <Title>Thông số liên quan</Title>
            </Col>
            <Col span={12}>----------------</Col>
          </Row>
        </React.Fragment>
      )}

      <Clearfix height={16} />
      <Row>
        <Col span={12}>
          <Title>Loại sự cố</Title>
        </Col>
        <Col span={12}>{incidentType()[get(record, 'type')]}</Col>
      </Row>

      <Clearfix height={16} />
      <Row>
        <Col span={12}>
          <Title>Thời gian bắt đầu</Title>
        </Col>
        <Col span={12}>
          <FormItem>
            {form.getFieldDecorator(Fields.timeStart, {
              rules: [{ required: true }],
            })(
              withUpdate(DatePicker, value =>
                handleUpdateField(Fields.timeStart, value)
              )()
            )}
          </FormItem>
        </Col>
      </Row>

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

      <Clearfix height={16} />
      <DynamicContainer
        record={record}
        form={form}
        categories={categories}
        updateDynamicField={handleUpdateDynamicField}
      />
    </React.Fragment>
  )
}

export default RightContent
