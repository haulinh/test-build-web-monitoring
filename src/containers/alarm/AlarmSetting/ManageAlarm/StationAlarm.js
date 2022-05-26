import { Tabs, Icon, Row, Collapse } from 'antd'
import React, { Component } from 'react'
import Threshold from 'assets/svg-icons/Threshold'
import AlarmConfigExceed from './Exceed'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import withAlarmForm from '../hoc/withAlarmForm'
import UserApi from 'api/UserApi'
import { get } from 'lodash'
import RoleApi from 'api/RoleApi'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'
import QCVNApi from 'api/QCVNApi'
import { withRouter } from 'react-router'
const { TabPane } = Tabs

@withRouter
@withAlarmForm
export default class StationAlarm extends Component {
  state = {
    activeKey: 'threshold',
    alarmStandard: ALARM_LIST_INIT.DATA_LEVEL,
    users: [],
    roles: [],
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const [qcvnList] = await Promise.all([
      this.getQCVNList(),
      this.getUsers(),
      this.getRoles(),
    ])

    this.setInitValues(qcvnList)
  }

  setInitValues = qcvnList => {
    const { setFormValues } = this.props

    this.setState({ qcvnList })

    setFormValues(FIELDS.DATA_LEVEL, ALARM_LIST_INIT.DATA_LEVEL)
  }

  getUsers = async () => {
    const result = await UserApi.searchUser()
    const users = get(result, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )
    if (result.success) {
      this.setState({ users })
    }
  }

  getRoles = async () => {
    const result = await RoleApi.getRoles()
    if (result.success) {
      this.setState({ roles: result.data })
    }
  }

  getQCVNList = async () => {
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      return result.data
    }
  }

  handleAdd = alarmType => {
    const { alarmStandard } = this.state
    const uuid = uuidv4()
    const newData = {
      _id: uuid,
      isCreateLocal: true,
      maxDisconnectionTime: 1800,
    }

    const actionsAdd = {
      [FIELDS.DATA_LEVEL]: () => {
        const newAlarmList = [...alarmStandard, newData]
        this.setState({
          alarmStandard: newAlarmList,
        })
      },
    }

    actionsAdd[alarmType]()
  }

  handleDelete = (alarmType, id) => {
    const { alarmStandard } = this.state
    const { form, setFormValues } = this.props

    const actionsDelete = {
      [FIELDS.DATA_LEVEL]: () => {
        const newAlarmList = alarmStandard.filter(item => item._id !== id)
        this.setState({ alarmStandard: newAlarmList }, () => {
          setFormValues(
            FIELDS.DATA_LEVEL,
            Object.values(get(form.getFieldsValue(), FIELDS.DATA_LEVEL, {}))
          )
        })
      },
    }

    actionsDelete[alarmType]()
  }

  render() {
    const {
      alarmStandard,
      users,
      roles,
      qcvnList,
      measuringListStation,
    } = this.state
    const { form } = this.props

    return (
      <Tabs defaultActiveKey="threshold">
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="warning" />
              Vượt ngưỡng
            </Row>
          }
          key="threshold"
        >
          <AlarmConfigExceed
            measuringListStation={measuringListStation}
            alarmList={alarmStandard}
            form={form}
            users={users}
            roles={roles}
            onAdd={this.handleAdd}
            onDelete={this.handleDelete}
            qcvnList={qcvnList}
          />
        </TabPane>
        <TabPane tab="Tín hiệu" key="signal">
          Tín hiệu
        </TabPane>
        <TabPane tab="Thiết bị" key="device">
          Thiết bị
        </TabPane>
        <TabPane tab="Nâng cao" key="advanced">
          Nâng cao
        </TabPane>
      </Tabs>
    )
  }
}
