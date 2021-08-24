import { Button, Col, Form, message, Row } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import GeneralInfo from 'containers/api-sharing/component/GeneralInfo'
import SettingQuery from 'containers/api-sharing/component/SettingQuery'
import { FIELDS, i18n, shareApiList } from 'containers/api-sharing/constants'
import { isCreate, isEdit, isView } from 'containers/api-sharing/util'
import _ from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Condition from '../Condition'

@withRouter
@Form.create()
export default class ConfigTab extends Component {
  componentDidMount() {
    if (!isCreate(this.props.rule)) {
      this.setInitFields()
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.data, this.props.data)) {
      this.setInitFields()
    }
  }

  setInitFields = () => {
    const { data } = this.props
    const fieldsValue = _.get(data, 'config', []).reduce((base, current) => {
      let value = current.value
      if (
        [
          FIELDS.STATION_FIXED.HISTORY_DATA.MEASURING_LIST,
          FIELDS.STATION_FIXED.HISTORY_DATA.POINT,
        ].includes(current.fieldName) &&
        value &&
        value.includes(',')
      ) {
        value = current.value.split(',')
      }
      const fieldValue = {
        [`config.${current.fieldName}`]: value,
      }
      return { ...base, ...fieldValue }
    }, {})

    const optionParams = _.get(data, 'config', [])
      .filter(field => !field.isDefault)
      .map(field => field.fieldName)

    this.props.form.setFieldsValue({
      ...fieldsValue,
      name: data.name,
      description: data.description,
      optionParams,
    })
  }

  getQueryParams = () => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const key = shareApiList.stationFixed.newestWqi.key
    const optionParams = fieldsValue.optionParams || []

    const config = Object.entries(fieldsValue.config).map(([key, value]) => {
      const isDefault = !optionParams.includes(key)

      let valueParams = value
      if (
        ['measuringList', 'stationKeys'].includes(key) &&
        Array.isArray(value)
      ) {
        valueParams = value.join(',')
      }

      return {
        fieldName: key,
        value: valueParams,
        isDefault,
      }
    })
    const params = {
      key,
      name: fieldsValue.name,
      description: fieldsValue.description,
      config: config,
    }

    return params
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { rule, history, location, form } = this.props
    const values = await form.validateFields()
    if (!values) return

    const queryParams = this.getQueryParams()
    const key = shareApiList.stationFixed.newestWqi.key
    if (isCreate(rule)) {
      const res = await shareApiApi.createApiByKey(key, queryParams)
      message.success(i18n.message.create)
      const urlUpdate = location.pathname.replace(
        'create',
        `edit/${res.data._id}`
      )
      history.push({ pathname: urlUpdate, state: { activeKey: 'QueryTab' } })
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
    const { form, rule, data } = this.props
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Row style={{ background: 'white' }} gutter={[0, 32]}>
            <Col span={24}>
              <GeneralInfo form={form} rule={rule} data={data} />
            </Col>
            <Col span={24}>
              <Condition form={form} rule={rule} data={data} />
            </Col>
            <Col span={24}>
              <SettingQuery form={form} rule={rule} data={data} excludeFields={['stationNames']}/>
            </Col>
            {!isView(rule) && (
              <Col span={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                >
                  {i18n.button.save}
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
