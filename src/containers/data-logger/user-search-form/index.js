import React from 'react'
// import styled from "styled-components";
import { Row, Col, Button, Form, Select, Card, Avatar } from 'antd'
import PropTypes from 'prop-types'
// import createLanguage, { langPropTypes } from "hoc/create-lang";
import { translate } from 'hoc/create-lang'
import UserApi from 'api/UserApi'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date.js'
import RangePickerCustom from 'components/elements/rangePicker'
import { connect } from 'react-redux'

const { Meta } = Card

// import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

const i18n = {
  labelUser: translate('dataLogger.searchForm.user'),
  labelTypeLog: translate('dataLogger.searchForm.typeLog'),
  labelFrom: translate('dataLogger.searchForm.from'),
  labelTo: translate('dataLogger.searchForm.to'),
  download: translate('dataLogger.searchForm.download'),
}

const BACKGROUND_COLORS = [
  '#87d068',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
]

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
class DataLoggerSearchForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isExcel: PropTypes.bool,
  }

  state = {
    isLoading: false,
    dataUsers: [],
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const [resUser] = await Promise.all([UserApi.searchUser()])
    if (resUser.success) {
      const dataSource = _.get(resUser, 'data', [])
      // console.log('dataSource', dataSource)
      this.setState({
        dataUsers: _.map(dataSource, item => {
          return {
            name: item.email,
            value: item.email,
            avatar: item.avatar,
            lastName: item.lastName,
            firstName: item.firstName,
            _id: item._id,
          }
        }),
      })
    }
    // console.log("-----", this.state.dataUsers);
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      // console.log("validateFields", err, values);
      if (err) return
      // const email = _.replace(values.email, "all", undefined);
      if (values.email === 'all') {
        delete values.email
      }
      // console.log("---", email)
      const dataSearch = {
        ...values,
        from:
          values.fromto && values.fromto.length > 0
            ? moment(values.fromto[0])
                .utc()
                .startOf('days')
                .format()
            : undefined,
        to:
          values.fromto && values.fromto.length > 0
            ? moment(values.fromto[1])
                .utc()
                .endOf('days')
                .format()
            : undefined,
      }

      if (this.props.onSubmit) this.props.onSubmit(dataSearch)
    })
  }

  getRealValue() {
    if (this.props.mode === 'multiple') {
      if (!Array.isArray(this.props.value)) return []
    }
    return this.props.value
  }

  getLabelAll = () => {
    return this.props.language === 'en' ? 'All' : 'Tất cả'
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
          <Col span={11}>
            {getFieldDecorator(`email`)(
              <Select
                showSearch
                optionLabelProp="label"
                placeholder={i18n.labelUser}
                value={this.getRealValue()}
              >
                <Select.Option
                  key={'all'}
                  value={'all'}
                  label={this.getLabelAll()}
                >
                  {this.getLabelAll()}
                </Select.Option>

                {this.state.dataUsers.length > 0 &&
                  this.state.dataUsers.map((user, index) => (
                    <Select.Option
                      key={user.value}
                      value={user.value}
                      label={user.value}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            icon="user"
                            src={user.avatar}
                            style={{
                              backgroundColor:
                                BACKGROUND_COLORS[
                                  index % BACKGROUND_COLORS.length
                                ],
                              marginTop: 5,
                            }}
                          />
                        }
                        style={{ padding: '5px 0' }}
                        title={user.value}
                        description={`${user.lastName} ${user.firstName}`}
                      />
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Col>
          {/* <Col span={6}>
            {getFieldDecorator(`typeLog`)(
              <Input placeholder={i18n.labelTypeLog} />
            )}
          </Col> */}

          <Col span={11}>
            {getFieldDecorator(`fromto`)(
              <RangePickerCustom
                formatDate={DD_MM_YYYY}
                size={'default'}
                // style={{ width: "100%" }}
              />
            )}
          </Col>
          {/* <Col span={4}>
            {getFieldDecorator(`from`)(
              <DatePicker
                style={{ width: "100%" }}
                format={DD_MM_YYYY}
                placeholder={i18n.labelFrom}
              />
            )}
          </Col>
          <Col span={4}>
            {getFieldDecorator(`to`)(
              <DatePicker
              format={DD_MM_YYYY}
                style={{ width: "100%" }}
                placeholder={i18n.labelTo}
              />
            )}
          </Col> */}
          <Col span={2}>
            <Button
              shape="circle"
              icon="search"
              htmlType="submit"
              style={{ marginRight: '8px' }}
            />
            {this.props.isExcel && (
              <Button type="primary" icon="download">
                {i18n.download}
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create({})(DataLoggerSearchForm)
