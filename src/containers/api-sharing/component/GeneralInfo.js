import { Col, Form, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { getPathname, isView } from 'containers/api-sharing/util'
import React from 'react'
import { withRouter } from 'react-router'

const GeneralInfo = withRouter(({ form, location, rule }) => {
  const pathname = getPathname(location)
  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.generalInfo}</Header>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiName}>
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: i18n.rules.name,
                },
                {
                  max: 64,
                  message: i18n.rules.max,
                },
              ],
            })(<Input disabled={isView(rule)} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiType}>
            {form.getFieldDecorator('type', {
              initialValue: i18n.titleMenu[pathname] || '',
              rules: [{ required: true }],
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={i18n.detailPage.label.description}>
        {form.getFieldDecorator('description')(
          <TextArea disabled={isView(rule)} />
        )}
      </Form.Item>
    </BoxShadow>
  )
})

export default GeneralInfo
