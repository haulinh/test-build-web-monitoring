import { Button, Icon } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/elements'
import ROLE from 'constants/role'
import { translate as t } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import AlarmList from './AlarmList'
import AlarmForm from './form/AlarmForm'

const Breadcrumb = createBreadcrumb()

export const alarmType = {
  disconnect: {
    label: () => t('alarm.alarmType.disconnect.label'),
    value: 'disconnect',
    template: () => t('alarm.alarmType.disconnect.template', undefined, false),
    initialValue: `Station: {{station}} disconnected at {{time}}`,
  },
  exceed: {
    label: () => t('alarm.alarmType.exceed.label'),
    value: 'exceed',
    template: () => t('alarm.alarmType.exceed.template', undefined, false),
    initialValue: `Station: {{station}} - Data exceed the threshold {{measure}} : {{value}} {{unit}} (Threshold: {{config}} {{unit}} ) at {{time}}`,
  },
  device: {
    label: () => t('alarm.alarmType.device.label'),
    value: 'device',
    template: () => t('alarm.alarmType.device.template', undefined, false),
    initialValue: `Station: {{station}} - {{measure}} : {{status}} at {{time}}`,
  },
  advance: {
    label: () => t('alarm.alarmType.advance.label'),
    value: 'advance',
    template: () => t('alarm.alarmType.advance.template', undefined, false),
    initialValue: `{{station}}: ({{time}})
[STATUS_DATA]- {{measure}}: {{value}} {{unit}} ({{sign}} {{config}})
[STATUS_DEVICE]- {{measure}}: Sensor {{status}}`,
  },
  data_level: {
    label: () => t('alarm.alarmType.by_standard.label'),
    value: 'data_level',
    template: () => t('alarm.alarmType.advance.template', undefined, false),
    initialValue: `{{station}}: ({{time}})
    [STATUS_DATA]- {{measure}}: {{value}} {{unit}} ({{sign}} {{config}})
    [STATUS_DEVICE]- {{measure}}: Sensor {{status}}`,
  },
}

export const FIELDS = {
  NAME: 'name',
  TYPE: 'type',
  ORDER: 'order',
  STATION_ID: 'stationId',
  REPEAT_CONFIG: 'repeatConfig',
  CONDITIONS: 'conditions',
  RECIPIENTS: 'recipients',
  CHANNELS: 'channels',
  MAX_DISCONNECTION_TIME: 'maxDisconnectionTime',

  CONFIG: 'config',
  STANDARD_ID: 'standardId',
  ID: '_id',
}

export const i18n = () => ({
  menu: t('alarm.menu.management'),
  message: {
    success: text => text + ' ' + t('ticket.message.configProperties.success'),
    error: t('ticket.message.configProperties.error'),
  },
})

@connect(state => ({
  userInfo: state.auth.userInfo,
}))
export default class AlarmManagement extends Component {
  state = {
    visible: false,
    data: [],
    loading: false,
  }

  async componentDidMount() {
    this.getData()
  }

  getAlarmItem = async id => {
    const result = await CalculateApi.getAlarmById(id)
    this.setState({ alarmItem: result })
  }

  getData = async () => {
    try {
      this.setState({ loading: true })
      const data = await CalculateApi.getAlarms()
      this.setState({ data, loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      currentActive: {},
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  renderButtonAdd = () => {
    return protectRole(ROLE.ALARM_MANAGEMENT.CREATE)(
      <Button onClick={this.showDrawer} type="primary">
        <Icon type="plus" />
        {t('addon.create')}
      </Button>
    )
  }

  render() {
    const { visible, data, loading } = this.state
    return (
      <PageContainer right={this.renderButtonAdd()}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n().menu,
            },
          ]}
        />

        <AlarmForm
          visible={visible}
          onClose={this.onClose}
          showDrawer={this.showDrawer}
          getData={this.getData}
        />

        <Clearfix height={16} />
        <AlarmList
          data={data}
          loading={loading}
          getData={this.getData}
          showDrawer={this.showDrawer}
        />
      </PageContainer>
    )
  }
}
