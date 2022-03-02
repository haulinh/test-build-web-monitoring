import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'
import TableAlarmDisconnect from './TableAlarmDisconnect'

const dataSourceInit = [
  {
    _id: uuidv4(),
    address: `London, Park Lane no. `,
    maxDisconnectionTime: 30,
  },
  {
    _id: uuidv4(),
    address: `London, Park Lane no. `,
    maxDisconnectionTime: 60,
  },
  {
    _id: uuidv4(),
    address: `London, Park Lane no. `,
    maxDisconnectionTime: 240,
  },
]

export default class AlarmConfig extends Component {
  state = {
    dataSource: [],
  }

  getChannels = () => {
    const { isEdit } = this.props

    const channelCreate = {
      channels: {
        email: {
          status: true,
          template: 'Station: {{station}} disconnected at {{time}}',
          type: 'email',
        },
        mobile: {
          status: true,
          template: 'Station: {{station}} disconnected at {{time}}',
          type: 'mobile',
        },
        sms: {
          active: true,
          template: 'Station: {{station}} disconnected at {{time}}',
          type: 'sms',
        },
        webhook: {
          status: true,
          config: { method: 'POST' },
          template: 'Station: {{station}} disconnected at {{time}}',
          type: 'webhook',
        },
      },
    }

    if (!isEdit) return channelCreate
    return {}
  }

  setInitData = () => {
    const { dataSource } = this.state
    const { form } = this.props

    dataSource.forEach(dataItem => {
      form.setFieldsValue({
        [`${FIELDS.DISCONNECT}.${dataItem._id}.${FIELDS.TIME_DISCONNECT}`]: dataItem.maxDisconnectionTime,
        [`${FIELDS.DISCONNECT}.${dataItem._id}.${FIELDS.STATUS}`]:
          dataItem.status === 'enable' ? true : false,
      })
    })
  }

  handleDelete = id => {
    console.log(id)
    const { dataSource } = this.state

    const newDataSourceDeleted = dataSource.filter(item => item.id !== id)
    this.setState({ dataSource: newDataSourceDeleted })
  }

  handleAdd = () => {
    const { dataSource } = this.state
    const _id = uuidv4()
    const newData = {
      _id,
    }

    this.setState({
      dataSource: [...dataSource, newData],
    })
  }

  componentDidMount = () => {
    const { isEdit, alarmList } = this.props

    if (!isEdit || alarmList.length === 0) {
      this.setState(
        {
          dataSource: dataSourceInit,
        },
        () => this.setInitData()
      )
    } else {
      const alarmsDisconnect = alarmList.filter(
        alarm => alarm.type === FIELDS.DISCONNECT
      )

      this.setState(
        {
          dataSource: alarmsDisconnect,
        },
        () => this.setInitData()
      )
    }
  }

  render() {
    const { dataSource } = this.state
    const { userList, form } = this.props

    return (
      <div>
        <div className="title">Cảnh báo mất tín hiệu</div>

        <TableAlarmDisconnect
          form={form}
          handleDelete={this.handleDelete}
          dataSource={dataSource}
          handleAdd={this.handleAdd}
        />
      </div>
    )
  }
}
