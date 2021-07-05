import React, { Component } from 'react'
import Condition from './Condition'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'
import { Button, Col, Row, Form } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { i18n, shareApiList } from 'containers/api-sharing/constants'
import { getTimes } from 'utils/datetime'

@Form.create()
export default class ConfigTab extends Component {
  getQueryParams = () => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    console.log({ fieldsValue })
    const key = shareApiList.newestData.key
    const optionParams = fieldsValue.optionParams || []

    const times = getTimes(fieldsValue['rangeTime'])

    const config = Object.entries(fieldsValue.config)
      .filter(([key]) => key !== 'rangeTime')
      .map(([key, value]) => {
        const isDefault = !optionParams.includes(key)

        let valueParams = value
        if (key === 'measuringList' && value) {
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
    console.log({ queryParams })
    const key = shareApiList.historyData.key
    await shareApiApi.createApiByKey(key, queryParams)
  }

  render() {
    const { form, edit } = this.props
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Row style={{ background: 'white' }} gutter={[0, 32]}>
            <Col span={24}>
              <GeneralInfo form={form} />
            </Col>
            <Col span={24}>
              <Condition form={form} />
            </Col>
            <Col span={24}>
              <SettingQuery form={form} />
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
