import { Col, Row } from 'antd'
import { optionsStatusDevice } from 'components/core/select/SelectStatusDevice'
import Text from 'components/elements/text'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { get, keyBy } from 'lodash'
import React from 'react'
import styled from 'styled-components'

const CardInfo = styled.div`
  padding: 24px;
  background: #ffffff;
  border: 2px solid #f3f4f6;
  box-shadow: 0px 0px 4px rgba(24, 144, 255, 0.5);
  border-radius: 12px;
  .label {
    color: #6b7280;
  }
`

export const AlarmInfo = ({
  stationName,
  alarmType,
  maxDisconnectionTime,
  alarmDetail,
  qcvnList = [],
}) => {
  const alarmTypeName = {
    [FIELDS.DATA_LEVEL]: 'Cảnh báo vượt ngưỡng',
    [FIELDS.DISCONNECT]: 'Cảnh báo mất tín hiệu',
    [FIELDS.DEVICE]: 'Cảnh báo thiết bị',
  }

  const getOtherInfo = () => {
    const qcvnSelected = qcvnList.find(
      qcvn => qcvn._id === alarmDetail.config.standardId
    )

    const statusDeviceList = keyBy(optionsStatusDevice, 'value')
    const statusDevice = get(alarmDetail, ['config', 'type'])

    return {
      [FIELDS.DATA_LEVEL]: (
        <Row type="flex" justify="space-between" gutter={18}>
          <Col className="label">Quy chuẩn: </Col>
          <Col span={14} style={{ paddingLeft: '4px' }}>
            <Text fontWeight={500} fontSize={16}>
              {get(alarmDetail, ['config', 'name'])}
            </Text>
            <Text
              style={{ wordBreak: 'normal', color: '#374151' }}
              fontWeight={500}
              fontSize={16}
            >
              {get(qcvnSelected, ['name'])}
            </Text>
          </Col>
        </Row>
      ),
      [FIELDS.DISCONNECT]: (
        <Row type="flex" gutter={27}>
          <Col className="label">Thời gian mất tín hiệu: </Col>
          <Col>
            <Text fontWeight={700} fontSize={16}>
              {maxDisconnectionTime / 60} phút
            </Text>
          </Col>
        </Row>
      ),
      [FIELDS.DEVICE]: (
        <Row type="flex" gutter={27}>
          <Col className="label">Trạng thái thiết bị: </Col>
          <Col>
            <Text fontWeight={700} fontSize={16}>
              {get(statusDeviceList, [`${statusDevice}`, 'label'])}
            </Text>
          </Col>
        </Row>
      ),
    }
  }

  const otherInfo = getOtherInfo()

  return (
    <CardInfo>
      <Row style={{ marginBottom: 13 }}>
        <Text className="label" fontSize={16}>
          Trạm
        </Text>
        <Text fontWeight={700} fontSize={16}>
          {stationName}
        </Text>
      </Row>
      <Row type="flex" gutter={27} style={{ marginBottom: 6 }}>
        <Col className="label" style={{ width: '148px' }}>
          Loại cảnh báo:
        </Col>
        <Col>
          <Text fontWeight={500} fontSize={16}>
            {alarmTypeName[alarmType]}
          </Text>
        </Col>
      </Row>

      {otherInfo[alarmType]}
    </CardInfo>
  )
}