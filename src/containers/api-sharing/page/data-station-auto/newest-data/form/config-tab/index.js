import React, { Component } from 'react'
import Condition from './Condition'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'
import { Button, Col, Row, Form } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { shareApiList } from 'containers/api-sharing/constants'

@Form.create()
export default class ConfigTab extends Component {
  getQueryParams = () => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const key = shareApiList.newestData.key
    const optionParams = fieldsValue.optionParams

    const config = Object.entries(fieldsValue.config).map(([key, value]) => {
      const isDefault = !optionParams.includes(key)

      let valueParams = value
      if (key === 'measuringList') {
        valueParams = value.join(',')
      }

      return {
        key,
        value: valueParams,
        isDefault,
      }
    })

    const params = {
      key,
      name: fieldsValue.name,
      description: fieldsValue.description,
      config,
    }

    return params
  }

  handleSubmit = async e => {
    e.preventDefault()
    const queryParams = this.getQueryParams()
    const key = shareApiList.newestData.key
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
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
