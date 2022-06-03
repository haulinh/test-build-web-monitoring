import { Button, Col, Row, Switch, Table } from 'antd'
import { optionsStatusDevice } from 'components/core/select/SelectStatusDevice'
import { Clearfix } from 'components/elements'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import { DropdownMoreAction } from 'containers/alarm/AlarmSetting/components'
import { ALARM_LIST_INIT, i18n } from 'containers/alarm/AlarmSetting/constants'
import withAlarmForm from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { get, isEmpty, isEqual, keyBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createListAlarm } from 'redux/actions/alarm'
import { selectStationById } from 'redux/actions/globalAction'
import FormAlarmDetail from '../FormAlarmDetail'
@withAlarmForm
@connect(
  state => ({
    selectStationById: stationId => selectStationById(state, stationId),
  }),
  { createListAlarm }
)
export default class AlarmStatusDevice extends Component {
  //#region life cycle
  componentDidMount = () => {
    this.handleCreateAlarmInit()
  }
  componentDidUpdate = prevProps => {
    const { dataSource } = this.props

    if (!isEqual(dataSource, prevProps.dataSource)) {
      this.handleCreateAlarmInit()
    }
  }

  //#endregion life cycle

  handleCreateAlarmInit = () => {
    const { dataSource, stationId, createListAlarm } = this.props
    if (!dataSource) {
      createListAlarm(ALARM_LIST_INIT.STATUS_DEVICE, stationId)
    } else {
      const statusDeviceCreated = dataSource.map(dataItem =>
        get(dataItem, ['config', 'type'])
      )

      const statusDeviceNotCreate = ALARM_LIST_INIT.STATUS_DEVICE.filter(
        alarm => !statusDeviceCreated.includes(alarm.config.type)
      )
      createListAlarm(statusDeviceNotCreate, stationId)
    }
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

  handleSubmit = () => {
    const { handleSubmitAlarm, getQueryParamGeneral } = this.props

    const queryParams = getQueryParamGeneral()
    handleSubmitAlarm(queryParams)
  }

  columns = [
    {
      title: 'Trạng thái',
      width: 260,
      align: 'center',
      render: (_, record) => {
        const statusDeviceList = keyBy(optionsStatusDevice, 'value')
        const statusDevice = get(record, ['config', 'type'])

        return <div>{get(statusDeviceList, [`${statusDevice}`, 'label'])}</div>
      },
    },
    {
      title: 'Người nhận',
      dataIndex: FIELDS.RECIPIENTS,
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
        form.getFieldDecorator(`${record._id}.config.type`)
        form.getFieldDecorator(`${record._id}.config.name`)

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
          isEdit && (
            <DropdownMoreAction onEdit={() => this.handleEdit(record)} isEdit />
          )
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
          pagination={false}
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
            alarmType={FIELDS.DEVICE}
            handleSubmit={this.handleSubmit}
            showTimeRepeat
          />
        )}
      </React.Fragment>
    )
  }
}
