import { Col, DatePicker, Row, Tooltip, Divider } from 'antd'
import SelectStatus from 'components/elements/select-data/ticket/SelectStatus'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import { get, isEmpty } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { i18n, incidentType } from '../../index'
import { Fields } from '../index'
import { DynamicContainer } from './DynamicContainer'

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
      style: { width: '100%' },
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
  updatedAt,
}) => {
  const stationNames = get(record, 'stations', [])
    .map(item => item.name)
    .join(',')

  const provinceNames = get(record, 'stations', [])
    .map(item => get(item.province, 'name'))
    .filter(item => item)
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

      <Divider />

      {stationNames && (
        <React.Fragment>
          <Clearfix height={16} />
          <Row gutter={[0, 12]}>
            <Col span={12}>
              <Title>{i18n().stationName}</Title>
            </Col>
            <Col span={12}>
              <Tooltip title={stationNames}>
                <div style={styledText}>{stationNames}</div>
              </Tooltip>
            </Col>
          </Row>
        </React.Fragment>
      )}

      {provinceNames && (
        <React.Fragment>
          <Clearfix height={16} />
          <Row gutter={[0, 12]}>
            <Col span={12}>
              <Title>{i18n().provinceName}</Title>
            </Col>
            <Col span={12}>
              <Tooltip title={provinceNames}>
                <div style={styledText}>{provinceNames}</div>
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
              <Title>{i18n().measure}</Title>
            </Col>
            <Col span={12}>
              <div style={styledText}>{measures.join(',')}</div>
            </Col>
          </Row>
        </React.Fragment>
      )}

      <Clearfix height={16} />
      <Row type="flex" align="middle">
        <Col span={12}>
          <Title>{i18n().incidentType}</Title>
        </Col>
        <Col span={12}>
          <div style={styledText}>{incidentType()[get(record, 'type')]}</div>
        </Col>
      </Row>

      <Clearfix height={16} />
      <Row type="flex" align="middle">
        <Col span={12}>
          <Title>{translate('avgSearchFrom.selectTimeRange.startTime')}</Title>
        </Col>
        <Col span={12}>
          <FormItem marginBottom="0px">
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

      <Clearfix height={16} />
      <Row type="flex" align="middle">
        <Col span={12}>
          <Title>{translate('avgSearchFrom.selectTimeRange.endTime')}</Title>
        </Col>
        <Col span={12}>
          {form.getFieldDecorator(Fields.timeEnd)(
            withUpdate(DatePicker, value =>
              handleUpdateField(Fields.timeEnd, value)
            )()
          )}
        </Col>
      </Row>

      {!_.isEmpty(categories) && (
        <React.Fragment>
          <Divider />
          <Clearfix height={16} />
          <DynamicContainer
            record={record}
            form={form}
            categories={categories}
            updateDynamicField={handleUpdateDynamicField}
          />
        </React.Fragment>
      )}

      <Divider />
      <Clearfix height={16} />
      <div>
        {translate('ticket.label.incident.createdAt', {
          time: moment(record.createdAt).format('hh:mm'),
          date: moment(record.createdAt).format('DD/MM/YYYY'),
        })}
      </div>
      <div>
        {translate('ticket.label.incident.updatedAt', {
          time: moment(updatedAt).format('hh:mm'),
          date: moment(updatedAt).format('DD/MM/YYYY'),
        })}
      </div>
    </React.Fragment>
  )
}

export default RightContent
