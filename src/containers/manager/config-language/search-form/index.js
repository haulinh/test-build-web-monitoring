import React from 'react'
import { Row, Col, Button, Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { FlagIcon } from 'react-flag-kit'

const InputGroup = Input.Group
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
    listLanguage: PropTypes.array,
    language: PropTypes.string,
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
    this.props.form.validateFields((err, values) => {
      console.log('validateFields', err, values)
      if (err) return
      if (values.isMobile === 'all') delete values.isMobile
      if (!values.pattern) delete values.locale

      if (this.props.onSubmit) this.props.onSubmit(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form style={{ marginTop: '8px' }} onSubmit={this.onSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <InputGroup compact>
              {getFieldDecorator(`locale`, {
                initialValue: this.props.language,
              })(
                <Select>
                  {this.props.listLanguage &&
                    this.props.listLanguage.map((obj, idx) => {
                      return (
                        <Option key={idx} value={obj.locale}>
                          <FlagIcon code={obj.flag} size={20} />
                        </Option>
                      )
                    })}
                </Select>
              )}
              {getFieldDecorator(`pattern`)(<Input style={{ width: '80%' }} />)}
            </InputGroup>
          </Col>

          <Col span={10}>
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
