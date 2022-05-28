import { Col, Row } from 'antd'
import Text from 'components/elements/text'
import React from 'react'
import styled from 'styled-components'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'

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

export const AlarmInfo = ({ stationName, alarmType, maxDisconnectionTime }) => {
  const alarmTypeName = {
    [FIELDS.DATA_LEVEL]: 'Cảnh báo vượt ngưỡng',
    [FIELDS.DISCONNECT]: 'Cảnh báo mất tín hiệu',
    [FIELDS.DEVICE]: 'Cảnh báo thiết bị',
  }

  const getOtherInfo = () => {
    return {
      [FIELDS.DATA_LEVEL]: 'Cảnh báo vượt ngưỡng',
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
      [FIELDS.DEVICE]: 'Cảnh báo thiết bị',
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
        <Col className="label">Loại cảnh báo: </Col>
        <Col>
          <Text fontWeight={700} fontSize={16}>
            {alarmTypeName[alarmType]}
          </Text>
        </Col>
      </Row>

      {otherInfo[alarmType]}
    </CardInfo>
  )
}
