import { Button, Col, Icon, Row, Switch, Table } from 'antd'
import { Clearfix } from 'components/elements'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import {
  DropdownMoreAction,
  SelectTime,
} from 'containers/alarm/AlarmSetting/components/index'
import { ALARM_LIST_INIT, i18n } from 'containers/alarm/AlarmSetting/constants'
import withAlarmForm from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAlarm, deleteAlarm, createListAlarm } from 'redux/actions/alarm'
import { selectStationById } from 'redux/actions/globalAction'
import { v4 as uuidv4 } from 'uuid'
import FormAlarmDetail from '../FormAlarmDetail'

@withAlarmForm
@connect(
  state => ({
    selectStationById: stationId => selectStationById(state, stationId),
  }),
  { createAlarm, deleteAlarm, createListAlarm }
)
export default class AlarmDisconnect extends Component {
  //#region life cycle
  componentDidMount = () => {
    const { dataSource, stationId, createListAlarm } = this.props
    if (!dataSource) {
      const alarmInit = ALARM_LIST_INIT.DISCONNECT.map(dataItem => ({
        ...dataItem,
        stationId,
      }))
      createListAlarm(alarmInit, stationId)
    }
  }
  //#endregion life cycle

  //#region management
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

  handleEdit = alarmDetail => {
    const { handleShowAlarmDetail, setAlarmDetail } = this.props

    setAlarmDetail(alarmDetail)
    handleShowAlarmDetail()
  }
  //#endregion management

  handleSubmit = () => {
    const { handleSubmitAlarm, getQueryParamGeneral } = this.props
    const queryParams = getQueryParamGeneral()
    handleSubmitAlarm(queryParams)
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
      // align: 'center',
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
        const { form, setHiddenFields, stationId } = this.props
        setHiddenFields(record, FIELDS.DISCONNECT)
        form.getFieldDecorator(`${record._id}.stationId`, {
          initialValue: stationId,
        })

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
      width: '13%',
      align: 'center',
      render: (_, record) => {
        const { isCreateLocal } = record
        const isEdit = !isCreateLocal
        return (
          <DropdownMoreAction
            onDelete={() => this.handleDelete(record._id)}
            onEdit={() => this.handleEdit(record)}
            isEdit={isEdit}
            isDelete
          />
        )
      },
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
          rowKey={record => record._id}
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
        {!isEmpty(alarmDetail) && (
          <FormAlarmDetail
            visible={visibleAlarmDetail}
            onClose={this.handleCloseAlarmDetail}
            alarmDetail={alarmDetail}
            form={form}
            stationName={stationName}
            alarmType={FIELDS.DISCONNECT}
          />
        )}
      </React.Fragment>
    )
  }
}
