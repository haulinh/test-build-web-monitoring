import { Button, Col, Icon, Row, Switch, Table } from 'antd'
import { Clearfix } from 'components/elements'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import { DropdownMoreAction } from 'containers/alarm/AlarmSetting/components/index'
import { SelectTime } from 'containers/alarm/AlarmSetting/components/index'
import { channels, i18n } from 'containers/alarm/AlarmSetting/constants'
import withAlarmForm from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import { isEqual } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAlarm, deleteAlarm } from 'redux/actions/alarm'
import { v4 as uuidv4 } from 'uuid'
import FormAlarmDetail from '../FormAlarmDetail'
@withAlarmForm
@connect(null, { createAlarm, deleteAlarm })
export default class AlarmDisconnect extends Component {
  componentDidMount = () => {
    const { setFormValues, dataSource } = this.props

    setFormValues(dataSource)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { dataSource, setFormValues } = this.props

    if (!isEqual(prevProps.dataSource, dataSource)) {
      setFormValues(dataSource)
    }
  }

  handleAdd = () => {
    const { createAlarm, stationId } = this.props
    const uuid = uuidv4()
    const newData = {
      _id: uuid,
      isCreateLocal: true,
      maxDisconnectionTime: 1800,
      type: FIELDS.DISCONNECT,
      stationId,
    }
    createAlarm(newData)
  }

  handleDelete = _id => {
    const { deleteAlarm, setIdsDeleted } = this.props
    deleteAlarm(_id)
    setIdsDeleted(_id)
  }

  handleSubmit = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    console.log({ values })
    // handleSubmit()
  }

  handleEdit = alarmDetail => {
    const { handleShowAlarmDetail, setAlarmDetail } = this.props

    setAlarmDetail(alarmDetail)
    handleShowAlarmDetail()
  }

  handleCloseAlarmDetail = () => {
    const { handleCloseAlarmDetail } = this.props
    handleCloseAlarmDetail()
  }

  columns = [
    {
      title: i18n().timeLabel,
      width: '20%',
      align: 'left',
      dataIndex: FIELDS.TIME_DISCONNECT,
      render: (_, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(`${record._id}.${FIELDS.TIME_DISCONNECT}`, {
              // initialValue: 1800,
            })(<SelectTime />)}
          </React.Fragment>
        )
      },
    },
    {
      title: i18n().recipient,
      dataIndex: FIELDS.RECIPIENTS,
      align: 'center',
      width: '50%',
      render: (_, record) => {
        const { users, roles, form } = this.props
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
      width: '13%',
      align: 'center',
      dataIndex: FIELDS.STATUS,
      render: (_, record) => {
        const { form } = this.props
        const channelsFields = channels.map(channel =>
          form.getFieldDecorator(
            `${record._id}.channels.${channel}.${FIELDS.ACTIVE}`,
            { initialValue: true }
          )
        )
        // form.getFieldDecorator(
        //   `${record._id}.channels.${FIELDS.SMS}.${FIELDS.ACTIVE}`,
        //   { initialValue: true }
        // )

        //  form.getFieldDecorator(
        //   `${record._id}.channels.${FIELDS.SMS}.${FIELDS.ACTIVE}`,
        //   { initialValue: true }
        // )
        return (
          <React.Fragment>
            {form.getFieldDecorator(`${record._id}.${FIELDS.STATUS}`, {
              valuePropName: 'checked',
            })(<Switch />)}

            {form.getFieldDecorator(`${record._id}.${FIELDS.ID}`)(<div />)}
            {form.getFieldDecorator(`${record._id}.${FIELDS.IS_CREATE_LOCAL}`)(
              <div />
            )}
            {channelsFields}
          </React.Fragment>
        )
      },
    },
    {
      title: '',
      width: '13%',
      align: 'center',
      render: (_, record) => (
        <DropdownMoreAction
          onDelete={() => this.handleDelete(record._id)}
          onEdit={() => this.handleEdit(record)}
        />
      ),
    },
  ]

  render() {
    const {
      dataSource,
      visibleAlarmDetail,
      stationName,
      form,
      alarmDetail,
    } = this.props

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          bordered
          dataSource={dataSource}
          pagination={false}
          footer={() => (
            <Button
              type="link"
              style={{ fontWeight: 'bold' }}
              onClick={this.handleAdd}
            >
              <Icon type="plus" />
              {i18n().button.add}
            </Button>
          )}
        />
        <Clearfix height={24} />
        <Row type="flex" justify="end">
          <Col span={5}>
            <Button
              type="primary"
              block
              size="large"
              onClick={this.handleSubmit}
            >
              Lưu
            </Button>
          </Col>
        </Row>
        <FormAlarmDetail
          visible={visibleAlarmDetail}
          onClose={this.handleCloseAlarmDetail}
          alarmDetail={alarmDetail}
          form={form}
          stationName={stationName}
          alarmType={FIELDS.DISCONNECT}
          // showTimeRepeat
        />
      </React.Fragment>
    )
  }
}

AlarmDisconnect.defaultProps = {
  dataSource: ALARM_LIST_INIT.DISCONNECT,
}
