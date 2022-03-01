import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'
import SelectTime from './SelectTime'

export default class AlarmConfig extends Component {
  state = {
    dataSource: [],
  }

  onChange = e => {}

  onCheckAllChange = e => {
    console.log(e.target.checked)
  }

  columns = [
    {
      title: 'Thời gian mất tín hiệu (phút)',
      dataIndex: 'timeDisconnect',
      width: '15%',
      align: 'center',
      render: (value, record, index) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record.id}.${FIELDS.TIME_DISCONNECT}`,
              {
                initialValue: value || 30,
              }
            )(<SelectTime />)}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'address',
      align: 'center',
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
              `${FIELDS.DISCONNECT}.${record.id}.${FIELDS.ACTIVE}`,
              {
                initialValue: value || false,
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
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => this.handleDelete(record.id)}
          >
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <Icon type="delete" style={{ fontSize: '16px', color: 'red' }} />
            </div>
          </Popconfirm>
        ) : null,
    },
  ]

  handleDelete = id => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.id !== id) })
  }

  handleAdd = () => {
    const { dataSource } = this.state
    const id = uuidv4()
    const newData = {
      id,
    }

    this.setState({
      dataSource: [...dataSource, newData],
    })
  }

  dataSourceInit = [
    {
      id: uuidv4(),
      address: `London, Park Lane no. `,
      timeDisconnect: 30,
      isActive: false,
    },
    {
      id: uuidv4(),
      address: `London, Park Lane no. `,
      timeDisconnect: 60,
      isActive: true,
    },
    {
      id: uuidv4(),
      address: `London, Park Lane no. `,
      timeDisconnect: 240,
      isActive: true,
    },
  ]

  componentDidMount = () => {
    //isEdit call api set init dataSource

    const { isEdit } = this.props
    if (!isEdit)
      this.setState({
        dataSource: this.dataSourceInit,
      })
  }

  render() {
    const { dataSource } = this.state
    const { userList } = this.props

    console.log('userList----> ', { userList })

    return (
      <div>
        <div className="title">Cảnh báo mất tín hiệu</div>

        <Table
          columns={this.columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          footer={() => (
            <Button
              type="link"
              style={{ fontWeight: 'bold' }}
              onClick={this.handleAdd}
            >
              <Icon type="plus" />
              Thêm
            </Button>
          )}
        />
      </div>
    )
  }
}
