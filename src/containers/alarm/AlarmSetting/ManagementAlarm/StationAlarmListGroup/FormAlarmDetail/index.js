import { Button, Col, Drawer, Icon, Row, Switch } from 'antd'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import ToolTipHint from 'components/elements/tooltip'
import { Flex } from 'components/layouts/styles'
import SelectFrequency, {
  DEFAULT_VALUE_FREQUENCY,
} from 'containers/alarm/Component/SelectFrequency'
import { get } from 'lodash'
import React, { Component } from 'react'
import { AlarmInfo } from './AlarmInfo'
import ConfigTemplateStation from './ConfigTemplateStation'

const HeaderDrawer = ({ onClose, onSubmit }) => {
  return (
    <Row type="flex" align="middle" justify="space-between">
      <Row type="flex" gutter={8} align="middle">
        <Col>
          <div onClick={onClose} style={{ cursor: 'pointer' }}>
            <Icon type="close" />
          </div>
        </Col>
        <Col style={{ fontWeight: 700 }}>Cấu hình chi tiết</Col>
      </Row>
      <Row type="flex" gutter={8} align="middle">
        <Col>
          <Button type="primary" ghost onClick={onClose}>
            Hủy bỏ
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={onSubmit}>
            Cập nhật
          </Button>
        </Col>
      </Row>
    </Row>
  )
}

export default class FormAlarmDetail extends Component {
  handleOnClose = () => {
    const { onClose } = this.props
    onClose()
  }

  handleOnSubmit = () => {
    const { handleSubmit, onClose } = this.props
    handleSubmit()
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
          qcvnList={qcvnList}
          stationName={stationName}
          alarmType={alarmType}
          dataAlarmStation={alarmDetail}
          maxDisconnectionTime={get(alarmDetail, ['maxDisconnectionTime'])}
        />

        <Clearfix height={33} />
        <Flex justifyContent="space-between" alignItems="center">
          <Row type="flex" gutter={6}>
            <Col>
              <Flex gap={5} alignItems="center">
                <Text fontWeight={500}>Gửi lặp lại</Text>
                <ToolTipHint text="Tooltip lặp lại" />:
              </Flex>
            </Col>
            <Col>
              {form.getFieldDecorator(`${alarmId}.repeatConfig.active`, {
                valuePropName: 'checked',
                initialValue: get(alarmDetail, ['repeatConfig', 'active']),
              })(<Switch />)}
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
