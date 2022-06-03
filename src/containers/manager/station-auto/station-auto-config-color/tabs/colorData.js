import React from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import { Button, Table, Form, Input, Typography, Col, Row, Modal } from 'antd'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import { updateWarningLevelColorData } from 'redux/actions/config'

const { Text } = Typography

function i18n() {
  return {
    columnType: translate('page.config.color.table.column.type'),
    columnTypeAlt: translate('page.config.color.table.column.alternative'),
    columnColor: translate('page.config.color.table.column.color'),
    columnBackgroundColor: translate(
      'page.config.color.table.column.backgroundColor'
    ),
    columnDesc: translate('page.config.color.table.column.desc'),
    save: translate('addon.save'),
    restore: translate('addon.restore'),
    cancelText: translate('addon.cancel'),
    okText: translate('addon.ok'),
    restoreConfirmMsg: translate('confirm.msg.restore'),
  }
}

@connectAutoDispatch(
  state => ({
    colorData: state.config.color.warningLevel.data,
  }),
  { updateWarningLevelColorData }
)
@Form.create({})
@createLanguageHoc
export default class WarningLevelColorOfSensor extends React.Component {
  static propTypes = {
    colorData: PropTypes.object.isRequired,
  }
  static defaultProps = {
    colorData: {
      value: [],
    },
  }

  state = {
    isLoading: false,
    isSubmit: false,
    isRestore: false,
    dataSource: [],
  }

  render() {
    return (
      <React.Fragment>
        <Table
          loading={this.state.isLoading}
          rowKey="name"
          size="middle"
          pagination={false}
          dataSource={this.props.colorData.value}
          columns={this._getTableColumn()}
        />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button
              onClick={this._restoreConfigs}
              loading={this.state.isRestore}
              block
              style={{ marginTop: 16 }}
            >
              {i18n().restore}
            </Button>
          </Col>
          <Col span={12}>
            <Button
              onClick={this._saveConfigs}
              loading={this.state.isSubmit}
              block
              type="primary"
              style={{ marginTop: 16 }}
            >
              {i18n().save}
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  _getTableColumn = () => {
    const { getFieldDecorator } = this.props.form
    const { t } = this.props.lang

    return [
      {
        title: i18n().columnType,
        dataIndex: 'key',
        key: 'key',
        width: '30%',
        render(text, record, index) {
          return (
            <React.Fragment>
              <Text>{text}</Text>
              {getFieldDecorator(`[${index}].key`, {
                initialValue: text,
              })(<Input type="hidden" />)}
            </React.Fragment>
          )
        },
      },
      {
        title: i18n().columnTypeAlt,
        dataIndex: 'alternative',
        key: 'alternative',
        width: '40%',
        render(text, record, index) {
          return t(`page.config.color.${record.key}`)
        },
      },
      {
        title: i18n().columnBackgroundColor,
        dataIndex: 'backgroundColor',
        key: 'backgroundColor',
        align: 'center',
        width: '15%',
        render(backgroundColor, record, index) {
          return getFieldDecorator(`[${index}].backgroundColor`, {
            initialValue: backgroundColor,
          })(<input type="color" />)
        },
      },
      {
        title: i18n().columnColor,
        dataIndex: 'color',
        key: 'color',
        align: 'center',
        width: '15%',
        render(color, record, index) {
          return getFieldDecorator(`[${index}].color`, {
            initialValue: color,
          })(<input type="color" />)
        },
      },
      // {
      //   title: i18n().columnDesc,
      //   dataIndex: 'description',
      //   key: 'description',
      //   render(text, record, index) {
      //     return getFieldDecorator(`[${index}].description`, {
      //       initialValue: text,
      //     })(<Input />)
      //   },
      // },
      // {
      //   title: '',
      // },
    ]
  }

  _saveConfigs = () => {
    const { validateFields } = this.props.form

    validateFields(async (error, values) => {
      const id = _.get(this.props.colorData, '_id')
      const data = Object.values(values)
      // console.log(values, '--data--')
      this.setState({ isSubmit: true })
      await this.props.updateWarningLevelColorData(id, data)
      this.setState({ isSubmit: false })
    })
  }

  _restoreConfigs = () => {
    const { validateFields } = this.props.form
    const { form } = this.props
    const id = _.get(this.props.colorData, '_id')
    let me = this
    me.setState({ isRestore: true, isLoading: true })

    Modal.confirm({
      title: i18n().restoreConfirmMsg,
      okText: i18n().okText,
      cancelText: i18n().cancelText,
      onOk() {
        validateFields(async (error, values) => {
          const data = Object.values(values)
          // console.log(values, '--data--')
          await me.props.updateWarningLevelColorData(id, data, {
            isRestore: true,
          })
          form.resetFields()
          me.setState({ isRestore: false, isLoading: false })
        })
      },
      onCancel() {
        me.setState({ isRestore: false, isLoading: false })
      },
    })
  }
}
