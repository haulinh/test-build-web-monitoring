import React from 'react'
import { Row, Col, Form, Input, Button, Icon } from 'antd'

import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import SelectStationType from 'components/elements/select-station-type'
import { translate } from 'hoc/create-lang'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'

const i18n = {
  addButton: translate('stationAutoManager.create.label'),
  stationType: translate('stationAutoManager.form.stationType.placeholder'),
  stationName: translate('stationAutoManager.form.name.placeholder')
}

@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoSearchForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentWillMount() {}

  changeSearch(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const data = {}
      if (values.address) data.address = values.address
      if (values.name) data.name = values.name
      if (values.stationType) data.stationType = values.stationType

      // Callback submit form Container Component
      this.setState({ dataSearch: data }, () => this.props.onChangeSearch(data))
    })
  }

  changeStationType(stationType) {}

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Row type="flex" align="middle" justify="center">
        <Col span={24}>
          <Form
            className="fadeIn animated"
            onSubmit={this.changeSearch}
            style={{ width: '100%' }}
          >
            <Row gutter={16}>
              {/* CHỌN LOẠI TRẠM */}
              <Col span={11}>
                {getFieldDecorator(`stationType`)(
                  <SelectStationType
                    classNane="select-form-auto"
                    getFieldDecorator={getFieldDecorator}
                    isShowAll
                    // onChangeStationType={this.changeStationType}
                    placeholder={i18n.stationType}
                  />
                )}
              </Col>

              {/* NHẬP TÊN TRẠM */}
              <Col span={11}>
                {getFieldDecorator(`name`)(
                  <Input placeholder={i18n.stationName} />
                )}
              </Col>

              {/* BUTTON SEARCH */}
              <Col span={2} style={{ textAlign: 'center' }}>
                <Button shape="circle" htmlType="submit">
                  <Icon type="search" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}
