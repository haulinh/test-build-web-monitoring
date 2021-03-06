import React from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import { translate } from 'hoc/create-lang'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'

function i18n() {
  return {
    okText: translate('addon.ok'),
    addButton: translate('stationAutoManager.create.label'),
    stationType: translate('stationFixedPoint.form.stationType.placeholder'),
    stationName: translate('periodicalForecast.placeholder.stationName'),
    title: translate('stationAutoManager.limit.station.title'),
    callAction: translate('stationAutoManager.limit.station.callAction'),
  }
}

@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@connect(state => ({
  packageInfo: state.auth.userInfo.organization.packageInfo,
}))
@withRouter
@autobind
export default class StationSearch extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes,
    stationLength: PropTypes.number,
  }

  changeSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const data = {}
      if (values.name) data.name = values.name

      // Callback submit form Container Component
      // this.setState({ dataSearch: data }, () => this.props.onChangeSearch(data))
      if (this.props.onChangeSearch) this.props.onChangeSearch(data)
    })
  }

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

              {/* NHẬP TÊN TRẠM */}
              <Col span={9}>
                {getFieldDecorator(`name`)(
                  <Input placeholder={i18n().stationName} />
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
