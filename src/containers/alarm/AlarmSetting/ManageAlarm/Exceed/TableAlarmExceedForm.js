import { Button, Checkbox, Icon, Input, Popconfirm, Switch, Table } from 'antd'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import { get, keyBy } from 'lodash'
import React, { Component } from 'react'
import { SelectQCVNExceed } from '../../components/SelectQCVNExceed'
import { i18n } from '../../constants'
import { isDefaultDataLevel } from '../../hoc/withAlarmForm'
import { FIELDS } from '../../index'

export default class TableAlarmConfigExceed extends Component {
  handleOnChangeStandard = record => value => {
    const { form, qcvnList } = this.props
    const qcvnObject = keyBy(qcvnList, '_id')

    const qcvnName = get(qcvnObject, [value, 'name'])

    form.setFieldsValue({
      [`${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.CONFIG}.${FIELDS.NAME}`]: qcvnName,
    })
  }

  columns = [
    {
      title: i18n().threshold,
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (value, record) => {
        const { form, qcvnList, qcvnListSelected } = this.props
        form.getFieldDecorator(
          `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.CONFIG}.${FIELDS.TYPE}`
        )

        const configAlarmType = get(record, 'config.type')

        if (isDefaultDataLevel(configAlarmType)) {
          return <React.Fragment>{i18n()[configAlarmType]}</React.Fragment>
        }

        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.CONFIG}.${FIELDS.STANDARD_ID}`,
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
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.CONFIG}.${FIELDS.NAME}`
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
            {form.getFieldDecorator(
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.RECIPIENTS}`
            )(<TreeSelectUser users={users} roles={roles} />)}
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
            {form.getFieldDecorator(
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.STATUS}`,
              {
                valuePropName: 'checked',
              }
            )(<Switch />)}

            {form.getFieldDecorator(
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.ID}`
            )(<div />)}

            {form.getFieldDecorator(
              `${FIELDS.DATA_LEVEL}.${record._id}.${FIELDS.IS_CREATE_LOCAL}`
            )(<div />)}
          </React.Fragment>
        )
      },
    },
    {
      title: '',
      width: '15%',
      render: (_, record) => {
        const { dataSource, onDelete } = this.props
        const disabled = dataSource.length >= 1
        if (disabled) {
          const configAlarmType = get(record, 'config.type')

          if (isDefaultDataLevel(configAlarmType)) {
            return null
          }

          return (
            <Popconfirm
              title={i18n().popConfirmDelete}
              okText={i18n().button.submit}
              cancelText={i18n().button.cancel}
              onConfirm={() => onDelete(FIELDS.DATA_LEVEL, record._id)}
            >
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <Icon
                  type="delete"
                  style={{ fontSize: '16px', color: 'red' }}
                />
              </div>
            </Popconfirm>
          )
        }
      },
    },
  ]

  render() {
    const { dataSource, onAdd } = this.props

    console.log(dataSource)
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
            onClick={() => onAdd(FIELDS.DATA_LEVEL)}
          >
            <Icon type="plus" />
            {i18n().button.add}
          </Button>
        )}
      />
    )
  }
}
