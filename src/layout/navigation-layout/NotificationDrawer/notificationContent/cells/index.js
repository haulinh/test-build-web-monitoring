import React from 'react'
import { Col, List, Row } from 'antd'
import styled from 'styled-components'
import { translate as t } from 'hoc/create-lang'

import { NOTIFY_TYPE } from 'constants/notification'
import iconDisconnected from 'assets/svg-icons/Disconnected.svg'
import iconExceed from 'assets/svg-icons/Exceeded.svg'
import iconGood from 'assets/svg-icons/Good.svg'
import iconTendToExceed from 'assets/svg-icons/Tend-To-Exceed.svg'
import iconError from 'assets/svg-icons/Error.svg'
import iconCalibration from 'assets/svg-icons/Calibration.svg'
import iconDeviceGood from 'assets/svg-icons/Device-status-good.svg'

import { default as NotificationItem } from './_defaultCell'

const Text = styled.div`
  font-size: ${props => props.fontSize || 15}px;
  font-weight: ${props => props.fontWeight || 'normal'};
  display: ${props => props.display || 'inline-block'};
`

const ListItem = styled.span`
  display: list-item;
  list-style: disc;
  list-style-position: inside;
  margin-right: 10px;
`

const ListNoti = styled(List)`
  .ant-list-items{
    padding: 0 12px;
  }
`

const i18n = {
  station: t('common.station'),
  measurings: t('common.measures'),
  dataConnected: t('common.deviceStatus.dataConnected'),
  dataExeeded: t('common.deviceStatus.dataExceeded'),
  dataExceededPrepare: t('common.deviceStatus.dataExceededPrepare'),
  dataGood: t('common.deviceStatus.dataGood2'),
  dataLoss: t('common.deviceStatus.dataLoss'),
  sensorAdjust: t('common.deviceStatus.sensorMaintain'),
  sensorError: t('common.deviceStatus.sensorError'),
  sensorGood: t('common.deviceStatus.sensorGood'),
}

const getNotificationInfo = status => {
  switch (status) {
    case NOTIFY_TYPE.SENSOR_GOOD:
      return {
        icon: iconDeviceGood,
        statusText: i18n.sensorGood,
      }
    case NOTIFY_TYPE.SENSOR_ERROR:
      return {
        icon: iconError,
        statusText: i18n.sensorError,
      }
    case NOTIFY_TYPE.DATA_CONNECTED:
      return {
        icon: iconGood,
        statusText: i18n.dataConnected,
      }
    case NOTIFY_TYPE.DATA_EXCEEDED:
      return {
        icon: iconExceed,
        statusText: i18n.dataExeeded,
      }
    case NOTIFY_TYPE.DATA_EXCEEDED_PREPARED:
      return {
        icon: iconTendToExceed,
        statusText: i18n.dataExceededPrepare,
      }
    case NOTIFY_TYPE.SENSOR_ADJUST:
      return {
        icon: iconCalibration,
        statusText: i18n.sensorAdjust,
      }
    case NOTIFY_TYPE.DATA_GOOD:
      return {
        icon: iconGood,
        statusText: i18n.dataGood,
      }
    case NOTIFY_TYPE.DATA_LOSS:
      return {
        icon: iconDisconnected,
        statusText: i18n.dataLoss,
      }
    default:
      return {
        icon: '',
        statusText: '',
      }
  }
}

const NotificationContent = ({ notification, statusText, inline }) => {
  // console.log("NotificationConten=====?")
  // console.log(notification.status, '==notification.status==')
  return (
    < Row type={inline ? 'flex' : ''} gutter={12} >
      <Col>
        <Text>
          {i18n.station} <b>{notification.station}</b> {statusText}
        </Text>
      </Col>
      <Col>
        {
          notification.status === NOTIFY_TYPE.DATA_GOOD &&
          (
            <Row className="list" type={inline ? 'flex' : ''} gutter={10}>
              {(notification.measures || []).map(mea => (
                <ListItem key={mea.key} className="list-item">
                  <b>{mea.key}</b> {mea.value} {mea.unit}
                </ListItem>
              ))}
            </Row>
          )
        }
        {
          [NOTIFY_TYPE.DATA_EXCEEDED, NOTIFY_TYPE.DATA_EXCEEDED_PREPARED].includes(notification.status) &&
          (
            <Row className="list" type={inline ? 'flex' : ''} gutter={10}>
              {(notification.measures || []).map(mea => (
                <ListItem key={mea.key} className="list-item">
                  <b>{mea.key}</b> {mea.value} {mea.unit} {mea.moreContent || ''}
                </ListItem>
              ))}
            </Row>
          )
        }
        {
          ![NOTIFY_TYPE.DATA_EXCEEDED, NOTIFY_TYPE.DATA_EXCEEDED_PREPARED, NOTIFY_TYPE.DATA_GOOD].includes(notification.status) &&
          (
            <Row className="list" type={inline ? 'flex' : ''} gutter={10}>
              {(notification.measures || []).map(mea => (
                <ListItem key={mea.key} className="list-item">
                  <b>{mea.key}</b>
                </ListItem>
              ))}
            </Row>
          )
        }

      </Col>
    </Row >)
}

export default function Cells(props) {
  const { dataSource, inline } = props
  const list = (dataSource || []).map(notification => {
    const { icon, statusText } = getNotificationInfo(notification.status)
    return (
      <NotificationItem
        key={notification._id}
        data={notification}
        icon={icon}
        content={
          <NotificationContent
            inline={inline}
            notification={notification}
            statusText={statusText}
          />
        }
      />
    )
  })

  return <ListNoti dataSource={list} renderItem={item => item} />
}
