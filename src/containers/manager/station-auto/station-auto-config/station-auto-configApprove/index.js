import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Table, Button } from 'antd'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'

@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoConfigApprove extends React.Component {
  static propTypes = {
    onApproveSave: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    measuringListSource: PropTypes.array,
    options: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      allowed: _.get(props, 'options.approve.allowed', false),
      listRuleChange: _.get(props, 'options.approve.rules', {})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      _.isEqual(nextProps.allowed, this.props.allowed) ||
      _.isEqual(nextProps.listRuleChange, this.props.listRuleChange)
    ) {
      this.setState({
        allowed: _.get(nextProps, 'options.approve.allowed', false),
        listRuleChange: _.get(nextProps, 'options.approve.rules', {})
      })
    }
  }

  onChangeCheckboxAuto = event => {
    this.setState({ allowed: event.target.checked })
  }

  onChangeCheckbox = e => {
    const { checked, data, name } = e.target
    const listRuleChange = this.state.listRuleChange
    if (checked) {
      listRuleChange[data.key] = _.union(
        _.get(listRuleChange, [data.key], []),
        [name]
      )
    } else {
      listRuleChange[data.key] = _.filter(
        _.get(listRuleChange, [data.key], []),
        item => !_.isEqual(item, name)
      )
    }

    this.setState({ listRuleChange })
  }
  isItemChecked = (key, value) => {
    return _.includes(_.get(this.state, ['listRuleChange', key], []), value)
  }
  getColums = () => {
    return [
      {
        title: this.props.lang.t(
          'stationAutoManager.options.allowApprove.parameters'
        ),
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        render: value => value
      },
      {
        title: this.props.lang.t(
          'stationAutoManager.options.allowApprove.rules'
        ),
        children: [
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.zero'
            ),
            dataIndex: '',
            key: 'ZERO',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                name="ZERO"
                data={row}
                checked={this.isItemChecked(row.key, 'ZERO')}
                onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.negative'
            ),
            dataIndex: '',
            key: 'NEGATIVE',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                checked={this.isItemChecked(row.key, 'NEGATIVE')}
                name="NEGATIVE"
                data={row}
                onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.outOfRange'
            ),
            dataIndex: '',
            key: 'OUT_RANGE',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                checked={this.isItemChecked(row.key, 'OUT_RANGE')}
                name="OUT_RANGE"
                data={row}
                onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.deviceStatus'
            ),
            dataIndex: '',
            key: 'DEVICE_STATUS',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                checked={this.isItemChecked(row.key, 'DEVICE_STATUS')}
                name="DEVICE_STATUS"
                data={row}
                onChange={this.onChangeCheckbox}
              />
            )
          }
        ]
      }
    ]
  }

  onSave = () => {
    this.props.onApproveSave({
      allowed: this.state.allowed,
      rules: this.state.listRuleChange
    })
  }
  render() {
    return (
      <div>
        <Table
          bordered
          title={() => (
            <Checkbox
              checked={this.state.allowed}
              name="allowed"
              onChange={this.onChangeCheckboxAuto}
            >
              {this.props.lang.t(
                'stationAutoManager.options.allowApprove.label'
              )}
            </Checkbox>
          )}
          footer={() =>
            this.props.lang.t('stationAutoManager.options.allowApprove.note')
          }
          rowKey="key"
          size="small"
          columns={this.getColums()}
          dataSource={this.props.measuringListSource}
        />
        <Button
          onClick={this.onSave}
          style={{ width: '100%' }}
          type="primary"
          htmlType="button"
        >
          {this.props.lang.t('addon.save')}
        </Button>
      </div>
    )
  }
}
