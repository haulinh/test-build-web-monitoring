import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import PropsTypes from 'prop-types'
import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'
import SelectQCVNExceed from './SelectQCVNExeed'

export default class TableAlarmConfigExceed extends Component {
  static propTypes = {
    initialValues: PropsTypes.object,
  }
  state = {
    dataSource: [
      {
        id: uuidv4(),
      },
      {
        id: uuidv4(),
      },
      {
        id: uuidv4(),
      },
    ],
    standardsVNObject: '',
    standardsVNObjectId: '',
    selectedQCVNList: [],
  }

  columns = [
    {
      title: 'Ngưỡng',
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (value, record, index) => {
        const { form, qcvnList } = this.props
        const { selectedQCVNList } = this.state
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.EXCEED}.${record.id}.${FIELDS.QCVN_EXCEED}`,
              {}
            )(
              <SelectQCVNExceed
                placeholder="Chọn ngưỡng"
                selectedQCVNList={selectedQCVNList}
                qcvnList={qcvnList}
              />
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'user',
      align: 'left',
      width: '40%',
    },
    {
      title: 'Cảnh báo',
      width: '15%',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.EXCEED}.${record.id}.${FIELDS.ACTIVE_EXCEED}`,
              {
                initialValue: value,
                valuePropName: 'checked',
                onChange: this.onChange,
              }
            )(<Checkbox />)}
          </React.Fragment>
        )
      },
    },

    {
      title: '',
      width: '15%',
      render: (text, record) => {
        const { dataSource } = this.state
        const disabled = dataSource.length >= 1
        if (disabled) {
          return (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.id, record._id)}
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

  handleDelete = (id, standardsVNObjectId) => {
    const { dataSource, selectedQCVNList } = this.state
    const { onChangeQCVN } = this.props

    const newDataSource = dataSource.filter(item => item.id !== id)
    const newQcvnList = selectedQCVNList.filter(
      item => item._id !== standardsVNObjectId
    )
    onChangeQCVN(newQcvnList)
    this.setState({
      dataSource: newDataSource,
      qcvnList: newQcvnList,
    })
  }

  handleAdd = () => {
    const { dataSource } = this.state
    const newDataSource = [
      ...dataSource,
      {
        id: uuidv4(),
      },
    ]

    this.setState({
      dataSource: newDataSource,
    })
  }

  render() {
    const { dataSource, selectedQCVNList } = this.state

    return (
      <Table
        columns={this.columns}
        rowKey={record => record.id}
        dataSource={dataSource}
        bordered
        pagination={false}
        footer={() => (
          <Button
            type="link"
            style={{ fontWeight: 'bold' }}
            onClick={this.handleAdd}
            disabled={dataSource.length > 2}
          >
            <Icon type="plus" />
            Thêm
          </Button>
        )}
      />
    )
  }
}
