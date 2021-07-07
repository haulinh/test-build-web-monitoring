import React, { Component } from 'react'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'
import { Button, Col, Row, Form } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { FIELDS, i18n, shareApiList } from 'containers/api-sharing/constants'
import { getTimes } from 'utils/datetime'
import Condition from '../Condition'
import { isCreate, isView } from 'containers/api-sharing/util'
import { withRouter } from 'react-router'

@withRouter
@Form.create()
export default class ConfigTab extends Component {
  state = {
    data: {},
  }
  async componentDidMount() {
    const {
      match: { params },
      rule,
    } = this.props
    if (isCreate(rule)) return

    try {
      const res = await shareApiApi.getApiDetailById(params.id)
      if (res.success) {
        this.setState({ data: res.data }, () => {
          this.setInitFields()
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  setInitFields = () => {
    const { data } = this.state
    const fieldsValue = data.config.reduce((base, current) => {
      let value = current.value
      if (
        [
          FIELDS.STATION_FIXED.HISTORY_DATA.MEASURING_LIST,
          FIELDS.STATION_FIXED.HISTORY_DATA.POINT,
          'phaseIds',
        ].includes(current.fieldName)
      ) {
        value = current.value.split(',')
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
    const key = shareApiList.stationFixed.historyData.key
    const optionParams = fieldsValue.optionParams || []

    const times = getTimes(fieldsValue.config.rangeTime)

    const config = Object.entries(fieldsValue.config).map(([key, value]) => {
      const isDefault = !optionParams.includes(key)

      let valueParams = value
      if (['measuringList', 'stationKeys', 'phaseIds'].includes(key) && value) {
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
    const key = shareApiList.stationFixed.historyData.key
    await shareApiApi.createApiByKey(key, queryParams)
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
              <SettingQuery form={form} rule={rule} data={data} />
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
