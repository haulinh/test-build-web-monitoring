import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

import { translate as t } from 'hoc/create-lang'

import iconDisconnected from 'assets/svg-icons/Disconnected.svg'
import iconExceed from 'assets/svg-icons/Exceeded.svg'
import iconGood from 'assets/svg-icons/Good.svg'
import iconTendToExceed from 'assets/svg-icons/Tend-To-Exceed.svg'
import iconError from 'assets/svg-icons/Error.svg'
import iconCalibration from 'assets/svg-icons/Calibration.svg'
import iconDeviceGood from 'assets/svg-icons/Device-status-good.svg'

const Container = styled.div`
  width: 450px;
  background: white;
  padding: 10px 16px;
  padding-top: 5px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  .title {
    margin: 10px 0;
  }
`

const Text = styled.div`
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || 'normal'};
  margin: ${props => props.margin};
`

function i18n() {
  return {
    disconnected: t('dashboard.status.disconnected'),
    exceeded: t('dashboard.status.exceeded'),
    exceededPreparing: t('dashboard.status.exceededPreparing'),
    good: t('dashboard.status.good'),
    newNotification: t('dashboard.newNotification'),
    maintenance: t('monitoring.deviceStatus.maintenance'),
    sensorError: t('monitoring.deviceStatus.sensorError'),
    goodDevice: t('monitoring.deviceStatus.good'),
    statusData: t('common.statusData'),
    statusSensor: t('common.statusSensor'),
    description: {
      disconnected: t('dashboard.statusDescription.disconnected'),
      good: t('dashboard.statusDescription.good'),
      exceededPreparing: t('dashboard.statusDescription.exceededPreparing'),
      exceeded: t('dashboard.statusDescription.exceeded'),
      maintenance: t('dashboard.statusDescription.maintenance'),
      sensorError: t('dashboard.statusDescription.sensorError'),
      goodDevice: t('dashboard.statusDescription.goodDevice'),
    },
  }
}

const Helper = () => {
  const renderMenu = list =>
    list.map(item => (
      <Row type="flex" gutter={[10, 20]}>
        <Col>
          <span>{item.icon}</span>
        </Col>
        <Col>
          <Text fontSize={14} fontWeight={500}>
            {item.status}
          </Text>
          <Text fontSize={12}>{item.desc}</Text>
        </Col>
      </Row>
    ))
  return (
    <Container>
      <Text className="title" fontSize={16} fontWeight={600}>
        {i18n().statusData}
      </Text>
      {renderMenu([
        {
          icon: <img src={iconDisconnected} alt="" />,
          status: i18n().disconnected,
          desc: i18n().description.disconnected,
        },
        {
          icon: <img src={iconGood} alt="" />,
          status: i18n().good,
          desc: i18n().description.good,
        },
        {
          icon: <img src={iconTendToExceed} alt="" />,
          status: i18n().exceededPreparing,
          desc: i18n().description.exceededPreparing,
        },
        {
          icon: <img src={iconExceed} alt="" />,
          status: i18n().exceeded,
          desc: i18n().description.exceeded,
        },
      ])}
      <Text className="title" fontSize={16} fontWeight={600}>
        {i18n().statusSensor}
      </Text>
      {renderMenu([
        {
          icon: <img src={iconError} alt="" />,
          status: i18n().sensorError,
          desc: i18n().description.sensorError,
        },
        {
          icon: <img src={iconCalibration} alt="" />,
          status: i18n().maintenance,
          desc: i18n().description.maintenance,
        },
        {
          icon: <img src={iconDeviceGood} alt="" />,
          status: i18n().goodDevice,
          desc: i18n().description.goodDevice,
        },
      ])}
    </Container>
  )
}

Helper.propTypes = {}

export default Helper
