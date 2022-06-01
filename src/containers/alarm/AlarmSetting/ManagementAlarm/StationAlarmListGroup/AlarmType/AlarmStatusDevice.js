import React, { Component } from 'react'
import { ALARM_LIST_INIT, i18n } from 'containers/alarm/AlarmSetting/constants'
import { Button, Col, Icon, Row, Switch, Table } from 'antd'
import { Clearfix } from 'components/elements'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import withAlarmForm from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { DropdownMoreAction } from 'containers/alarm/AlarmSetting/components'
import { get, isEmpty, keyBy } from 'lodash'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import FormAlarmDetail from '../FormAlarmDetail'
import { optionsStatusDevice } from 'components/core/select/SelectStatusDevice'

@withAlarmForm
export default class AlarmStatusDevice extends Component {
  componentDidMount = () => {
    const { setFormValues, dataSource } = this.props

    setFormValues(dataSource)
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

        return <div>{statusDeviceList[record.config.type].label}</div>
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
        return (
          <DropdownMoreAction onEdit={() => this.handleEdit(record)} isEdit />
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

AlarmStatusDevice.defaultProps = {
  dataSource: ALARM_LIST_INIT.STATUS_DEVICE,
}
