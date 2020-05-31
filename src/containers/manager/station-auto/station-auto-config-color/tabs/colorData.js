import React from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import { Button, Table, Form, Input, Typography } from 'antd'
import { translate } from 'hoc/create-lang'
import { updateWarningLevelColorData } from 'redux/actions/config'

const { Text } = Typography

const i18n = {
  columnType: translate('page.config.color.table.column.type'),
  columnTypeAlt: translate('page.config.color.table.column.alternative'),
  columnColor: translate('page.config.color.table.column.color'),
  columnBackgroundColor: translate(
    'page.config.color.table.column.backgroundColor'
  ),
  columnDesc: translate('page.config.color.table.column.desc'),
  save: translate('addon.save'),
}

@connectAutoDispatch(
  state => ({
    colorData: state.config.color.warningLevel.data,
  }),
  { updateWarningLevelColorData }
)
@Form.create({})
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
    isLoaded: false,
    isSubmit: false,
    dataSource: [],
  }

  render() {
    return (
      <React.Fragment>
        <Table
          size="middle"
          pagination={false}
          dataSource={this.props.colorData.value}
          columns={this._getTableColumn()}
        />

        <Button
          onClick={this._saveConfigs}
          loading={this.state.isSubmit}
          block
          type="primary"
          style={{ marginTop: 16 }}
        >
          {i18n.save}
        </Button>
      </React.Fragment>
    )
  }

  _getTableColumn = () => {
    const { getFieldDecorator } = this.props.form

    return [
      {
        title: i18n.columnType,
        dataIndex: 'name',
        key: 'name',
        render(text, record, index) {
          return (
            <React.Fragment>
              <Text>{text}</Text>
              {getFieldDecorator(`[${index}].name`, {
                initialValue: text,
              })(<Input type="hidden" />)}
            </React.Fragment>
          )
        },
      },
      {
        title: i18n.columnTypeAlt,
        dataIndex: 'altName',
        key: 'altName',
        render(text, record, index) {
          return getFieldDecorator(`[${index}].alternative`, {
            initialValue: text,
          })(<Input />)
        },
      },
      {
        title: i18n.columnColor,
        dataIndex: 'color',
        key: 'color',
        align: 'center',
        render(color, record, index) {
          return getFieldDecorator(`[${index}].color`, {
            initialValue: color,
          })(<input type="color" />)
        },
      },
      {
        title: i18n.columnBackgroundColor,
        dataIndex: 'backgroundColor',
        key: 'backgroundColor',
        align: 'center',
        render(backgroundColor, record, index) {
          return getFieldDecorator(`[${index}].backgroundColor`, {
            initialValue: backgroundColor,
          })(<input type="color" />)
        },
      },
      {
        title: i18n.columnDesc,
        dataIndex: 'description',
        key: 'description',
        render(text, record, index) {
          return getFieldDecorator(`[${index}].description`, {
            initialValue: text,
          })(<Input />)
        },
      },
      {
        title: '',
      },
    ]
  }

  _saveConfigs = () => {
    const { validateFields } = this.props.form

    validateFields(async (error, values) => {
      const id = _.get(this.props.colorData, '_id')
      const data = Object.values(values)
      this.setState({ isSubmit: true })
      await this.props.updateWarningLevelColorData(id, data)
      this.setState({ isSubmit: false })
    })
  }
}
