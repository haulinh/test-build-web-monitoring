import { Button, Col, Form, message, Row } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { i18n, shareApiList } from 'containers/api-sharing/constants'
import { isCreate, isEdit } from 'containers/api-sharing/util'
import { get, isEqual } from 'lodash-es'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { getTimes } from 'utils/datetime'
import Condition from '../Condition'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'

@withRouter
@Form.create()
export default class ConfigTab extends Component {
  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.data, prevProps.data)) {
      this.setInitFields()
    }
  }

  setInitFields = () => {
    const { data } = this.props
    const fieldsValue = data.config.reduce((base, current) => {
      let value = current.value
      if (
        ['measuringList'].includes(current.fieldName) &&
        (value || '').includes(',')
      ) {
        value = get(current, 'value', '').split(',')
      }
      const fieldValue = {
        [`config.${current.fieldName}`]: value,
      }
      return { ...base, ...fieldValue }
    }, {})

    this.props.form.setFieldsValue({
      ...fieldsValue,
      name: data.name,
      description: data.description,
    })
  }

  getQueryParams = () => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const key = shareApiList.stationAuto.historyData.key
    const optionParams = fieldsValue.optionParams || []

    const times = getTimes(fieldsValue['rangeTime'])

    const config = Object.entries(fieldsValue.config).map(([key, value]) => {
      const isDefault = !optionParams.includes(key)

      let valueParams = value
      if (['measuringList'].includes(key) && value) {
        valueParams = value.join(',')
      }

      return {
        fieldName: key,
        value: valueParams,
        isDefault,
      }
    })

    const isDefaultRangeTime = !optionParams.includes('rangeTime')
    const from = {
      fieldName: 'from',
      value: times.from
        .clone()
        .utc()
        .format(),
      isDefault: isDefaultRangeTime,
    }
    const to = {
      fieldName: 'to',
      value: times.to
        .clone()
        .utc()
        .format(),
      isDefault: isDefaultRangeTime,
    }

    const newConfig = [...config, from, to]

    const params = {
      key,
      name: fieldsValue.name,
      description: fieldsValue.description,
      config: newConfig,
    }

    return params
  }

  handleSubmit = async e => {
    e.preventDefault()
    const queryParams = this.getQueryParams()
    const key = shareApiList.stationAuto.historyData.key
    const { rule, history, location } = this.props
    if (isCreate(rule)) {
      const res = await shareApiApi.createApiByKey(key, queryParams)
      message.success(i18n.message.create)
      const urlUpdate = location.pathname.replace(
        'create',
        `edit/${res.data._id}`
      )
      history.push(urlUpdate)
      return
    }

    if (isEdit(rule)) {
      const {
        match: { params },
        updateData,
      } = this.props
      await shareApiApi.updateApiDetailById(params.id, queryParams)
      const res = await shareApiApi.getApiDetailById(params.id)
      if (updateData && res.success) {
        updateData(res.data)
        message.success(i18n.message.edit)
      }
    }
  }

  render() {
    const { form, rule } = this.props
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Row style={{ background: 'white' }} gutter={[0, 32]}>
            <Col span={24}>
              <GeneralInfo form={form} rule={rule} />
            </Col>
            <Col span={24}>
              <Condition form={form} rule={rule} />
            </Col>
            <Col span={24}>
              <SettingQuery form={form} rule={rule} />
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                {i18n.button.save}
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
