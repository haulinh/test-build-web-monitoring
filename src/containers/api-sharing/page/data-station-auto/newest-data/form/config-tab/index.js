import React, { Component } from 'react'
import Condition from './Condition'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'
import { Button, Col, Row, Form } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { shareApiList } from 'containers/api-sharing/constants'

@Form.create()
export default class ConfigTab extends Component {
  handleSubmit = async e => {
    e.preventDefault()
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const key = shareApiList.newestData
    const params = {
      ...fieldsValue,
      key,
    }
    await shareApiApi.createApiByKey(key, params)
  }

  render() {
    const { form } = this.props
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
