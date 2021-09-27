import React from 'react'
import { Row, Col, Button, Form, Select } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { connect } from 'react-redux'

const { Option } = Select

function i18n() {
  return {
    all: translate('dataSearchFrom.form.all'),
    devicePlaceholder: translate('dataSearchFrom.form.device.placeholder'),
  }
}

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
class DataSearchForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isExcel: PropTypes.bool,
  }

  state = {
    isLoading: false,
  }

  async componentDidMount() {}

  onSubmit = e => {
    if (e) {
      e.preventDefault()
    }
    console.log('----')

    this.props.form.validateFields((err, values) => {
      console.log('validateFields', err, values)
      if (err) return
      if (values.isMobile === 'all') delete values.isMobile

      if (this.props.onSubmit) this.props.onSubmit(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        style={{ marginTop: '8px' }}
        className="fadeIn animated"
        onSubmit={this.onSubmit}
      >
        <Row gutter={8}>
          <Col offset={10} span={12}>
            {getFieldDecorator(`isMobile`)(
              <Select
                placeholder={i18n().devicePlaceholder}
                // onSelect={() => {
                //   this.onSubmit()
                // }}
              >
                <Option value={'all'}>{i18n().all}</Option>
                <Option value={true}>Mobile</Option>
                <Option value={false}>Web</Option>
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
