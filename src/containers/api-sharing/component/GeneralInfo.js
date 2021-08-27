import { Col, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Clearfix } from 'components/elements'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { getPathname, isView } from 'containers/api-sharing/util'
import React from 'react'
import { withRouter } from 'react-router'
import FormItem from './FormItem'

const GeneralInfo = withRouter(({ form, location, rule }) => {
  const pathname = getPathname(location)
  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.generalInfo}</Header>
      <Clearfix height={12} />
      <Row gutter={12}>
        <Col span={12}>
          <FormItem label={i18n.detailPage.label.apiName}>
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
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={i18n.detailPage.label.apiType}>
            {form.getFieldDecorator('type', {
              initialValue: i18n.titleMenu[pathname] || '',
              rules: [{ required: true }],
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
      <FormItem label={i18n.detailPage.label.description}>
        {form.getFieldDecorator('description')(
          <TextArea disabled={isView(rule)} />
        )}
      </FormItem>
    </BoxShadow>
  )
})

export default GeneralInfo
