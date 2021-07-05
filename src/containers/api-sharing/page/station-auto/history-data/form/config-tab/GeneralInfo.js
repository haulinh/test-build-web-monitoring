import { Col, Form, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { i18n } from 'containers/api-sharing/constants'
import React from 'react'
import { withRouter } from 'react-router'

import { Header, BoxShadow } from '../styles'

const GeneralInfo = withRouter(({ form, location }) => {
  const getPathname = () => {
    const pathname = location.pathname.split('/')
    return pathname[2]
  }
  const pathname = getPathname()
  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.generalInfo}</Header>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiName}>
            {form.getFieldDecorator('name')(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiType}>
            <Input disabled value={i18n.titleMenu[pathname] || ''} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={i18n.detailPage.label.description}>
        {form.getFieldDecorator('description')(<TextArea />)}
      </Form.Item>
    </BoxShadow>
  )
})

export default GeneralInfo
