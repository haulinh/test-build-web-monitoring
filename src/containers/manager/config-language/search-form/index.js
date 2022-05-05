import { Button, Col, Form, Input, Row, Select } from 'antd'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { DEVICE } from '..'

const { Option } = Select

function i18n() {
  return {
    all: translate('dataSearchFrom.form.all'),
    devicePlaceholder: translate('dataSearchFrom.form.device.placeholder'),
    search: translate('dataSearchFrom.form.search'),
  }
}

const FIELDS = {
  DEVICE: 'device',
  PATTERN: 'pattern',
}

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
class DataSearchForm extends React.Component {
  static propTypes = {
    listLanguage: PropTypes.array,
    language: PropTypes.string,
    onSubmit: PropTypes.func,
    isExcel: PropTypes.bool,
  }

  state = {
    isLoading: false,
  }

  onSubmit = e => {
    if (e) {
      e.preventDefault()
    }
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (!values.pattern) delete values.locale

      if (this.props.onSubmit) this.props.onSubmit(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form style={{ marginTop: '8px' }} onSubmit={this.onSubmit}>
        <Row gutter={8}>
          <Col span={8}>
            {getFieldDecorator(FIELDS.PATTERN)(
              <Input placeholder={i18n().search} style={{ width: '100%' }} />
            )}
          </Col>

          <Col span={8}>
            {getFieldDecorator(FIELDS.DEVICE)(
              <Select placeholder={i18n().devicePlaceholder}>
                <Option value="">{i18n().all}</Option>
                <Option value={DEVICE.MOBILE}>Mobile</Option>
                <Option value={DEVICE.WEB}>Web</Option>
              </Select>
            )}
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon="search"
              htmlType="submit"
              style={{ marginRight: '8px' }}
            />
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create({})(DataSearchForm)
