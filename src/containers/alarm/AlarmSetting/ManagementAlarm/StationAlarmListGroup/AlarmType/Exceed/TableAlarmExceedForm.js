import { Button, Icon, Input, Switch, Table } from 'antd'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import { i18n } from 'containers/alarm/AlarmSetting//constants'
import DropdownMoreAction from 'containers/alarm/AlarmSetting/components/DropdownMoreAction'
import { SelectQCVNExceed } from 'containers/alarm/AlarmSetting/components/SelectQCVNExceed'
import { isDefaultDataLevel } from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { get, keyBy } from 'lodash'
import React, { Component } from 'react'

export default class TableAlarmConfigExceed extends Component {
  handleOnChangeStandard = record => value => {
    const { form, qcvnList } = this.props
    const qcvnObject = keyBy(qcvnList, '_id')

    const qcvnName = get(qcvnObject, [value, 'name'])

    form.setFieldsValue({
      [`${record._id}.${FIELDS.CONFIG}.${FIELDS.NAME}`]: qcvnName,
    })
  }

  columns = [
    {
      title: i18n().threshold,
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (_, record) => {
        const { form, qcvnList, qcvnListSelected } = this.props
        form.getFieldDecorator(`${record._id}.${FIELDS.CONFIG}.${FIELDS.TYPE}`)

        const configAlarmType = get(record, 'config.type')

        if (isDefaultDataLevel(configAlarmType)) {
          return <React.Fragment>{i18n()[configAlarmType]}</React.Fragment>
        }

        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${record._id}.${FIELDS.CONFIG}.${FIELDS.STANDARD_ID}`,
              { onChange: this.handleOnChangeStandard(record) }
            )(
              <SelectQCVNExceed
                placeholder={i18n().selectThreshold}
                qcvnList={qcvnList}
                selectedQCVNList={qcvnListSelected}
              />
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: i18n().nameThreshold,
      render: (_, record) => {
        const { form } = this.props

        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${record._id}.${FIELDS.CONFIG}.${FIELDS.NAME}`
            )(<Input />)}
          </React.Fragment>
        )
      },
    },
    {
      title: i18n().recipient,
      dataIndex: 'recipients',
      align: 'center',
      width: '30%',
      render: (_, record) => {
        const { form, users, roles } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(`${record._id}.${FIELDS.RECIPIENTS}`)(
              <TreeSelectUser users={users} roles={roles} />
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: i18n().alarm,
      width: '15%',
      align: 'center',
      dataIndex: 'isActive',
      render: (_, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(`${record._id}.${FIELDS.STATUS}`, {
              valuePropName: 'checked',
            })(<Switch />)}

            {form.getFieldDecorator(`${record._id}.${FIELDS.ID}`)(<div />)}

            {form.getFieldDecorator(`${record._id}.${FIELDS.IS_CREATE_LOCAL}`)(
              <div />
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: '',
      width: '15%',
      align: 'center',
      render: (_, record) => {
        const { dataSource, onDelete } = this.props
        const disabled = dataSource.length >= 1
        if (disabled) {
          const configAlarmType = get(record, 'config.type')

          if (isDefaultDataLevel(configAlarmType)) {
            return null
          }
          return (
            <DropdownMoreAction
              onDelete={() => {
                onDelete(record._id)
              }}
            />
          )
        }
      },
    },
  ]

  render() {
    const { dataSource, onAdd } = this.props

    return (
      <Table
        columns={this.columns}
        rowKey={record => record._id}
        dataSource={dataSource}
        bordered
        pagination={false}
        footer={() => (
          <Button
            type="link"
            style={{ fontWeight: 'bold' }}
            onClick={() => onAdd()}
          >
            <Icon type="plus" />
            {i18n().button.add}
          </Button>
        )}
      />
    )
  }
}
