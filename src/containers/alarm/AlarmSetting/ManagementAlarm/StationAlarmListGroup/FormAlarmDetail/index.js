import { Button, Col, Drawer, Icon, Row, Switch, Tooltip } from 'antd'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import { Flex } from 'components/layouts/styles'
import SelectFrequency, {
  DEFAULT_VALUE_FREQUENCY,
} from 'containers/alarm/Component/SelectFrequency'
import { get } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { AlarmInfo } from './AlarmInfo'
import ConfigTemplateStation from './ConfigTemplateStation'
import { updateDetailAlarm } from 'redux/actions/alarm'

const StyledRow = styled(Row)`
  .ant-btn {
    border-color: transparent;
  }
`

const HeaderDrawer = ({ onClose, onSubmit }) => {
  return (
    <Row type="flex" align="middle" justify="space-between">
      <Row type="flex" gutter={8} align="middle">
        <Col>
          <div onClick={onClose} style={{ cursor: 'pointer' }}>
            <Icon type="close" style={{ color: '#A2A7B3', fontSize: '14px' }} />
          </div>
        </Col>
        <Col style={{ fontWeight: 700 }}>Cấu hình chi tiết</Col>
      </Row>
      <StyledRow type="flex" gutter={8} align="middle">
        <Col>
          <Button
            style={{
              backgroundColor: '#E1EDFB',
              color: '#1890FF',
            }}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={onSubmit}>
            Cập nhật
          </Button>
        </Col>
      </StyledRow>
    </Row>
  )
}
@connect(null, { updateDetailAlarm })
export default class FormAlarmDetail extends Component {
  handleOnClose = () => {
    const { onClose } = this.props
    onClose()
  }

  handleOnSubmit = async () => {
    const { onClose, form, alarmDetail, updateDetailAlarm } = this.props

    const formValues = form.getFieldsValue()
    const alarmUpdated = formValues[alarmDetail._id]

    updateDetailAlarm({
      ...alarmDetail,
      repeatConfig: alarmUpdated.repeatConfig,
      channels: alarmUpdated.channels,
    })
    onClose()
  }

  render() {
    const {
      visible,
      onClose,
      alarmDetail,
      form,
      stationName,
      alarmType,
      showTimeRepeat,
      qcvnList,
    } = this.props

    const alarmId = alarmDetail._id

    return (
      <Drawer
        title={
          <HeaderDrawer
            onClose={this.handleOnClose}
            onSubmit={this.handleOnSubmit}
          />
        }
        visible={visible}
        width={450}
        key={visible}
        onClose={onClose}
        closable={false}
        style={{ color: '#1F2937' }}
      >
        <AlarmInfo
          form={form}
          qcvnList={qcvnList}
          stationName={stationName}
          alarmType={alarmType}
          alarmDetail={alarmDetail}
          maxDisconnectionTime={get(alarmDetail, ['maxDisconnectionTime'])}
          statusDevice={get(alarmDetail, ['statusDevice'])}
        />

        <Clearfix height={33} />
        <Flex justifyContent="space-between" alignItems="center">
          <Row type="flex" gutter={6}>
            <Col>
              <Flex gap={5} alignItems="center">
                <Text fontWeight={500}>Gửi lặp lại</Text>
                <Tooltip placement="top" title={'Tooltip lặp lại'}>
                  <Icon type="info-circle" style={{ color: '#A2A7B3' }} />
                </Tooltip>
                <Text fontWeight={500} style={{ color: '#A2A7B3' }}>
                  :
                </Text>
              </Flex>
            </Col>
            <Col>
              {form.getFieldDecorator(`${alarmId}.repeatConfig.active`, {
                valuePropName: 'checked',
                initialValue: get(alarmDetail, ['repeatConfig', 'active']),
              })(<Switch style={{ marginBottom: '4px' }} />)}
            </Col>
          </Row>
          {showTimeRepeat && (
            <Row>
              {form.getFieldDecorator(`${alarmId}.repeatConfig.frequency`, {
                initialValue:
                  get(alarmDetail, ['repeatConfig', 'frequency']) ||
                  DEFAULT_VALUE_FREQUENCY,
              })(<SelectFrequency style={{ width: 170 }} />)}
            </Row>
          )}
        </Flex>
        <Clearfix height={24} />
        <ConfigTemplateStation
          form={form}
          alarmId={alarmId}
          dataAlarmStation={alarmDetail}
        />
      </Drawer>
    )
  }
}
