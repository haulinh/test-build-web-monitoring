import React from 'react'
import { Form, Input, Button } from 'antd'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import swal from 'sweetalert2'
import SamplingAPI from 'api/SamplingApi'

const FormItem = Form.Item

const ConfigModBusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 30em;
  justify-content: space-around;
  .ant-input-group-addon {
    width: 10em;
    background-color: #e2e4e9;
    border-radius: 3px 0px 0px 3px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`

const i18n = {
  totalBottles: translate(
    'monitoring.moreContent.sampling.content.config.totalBottles'
  ),
  controlTagName: translate(
    'monitoring.moreContent.sampling.content.config.controlTagName'
  ),
  timeToTakeOneBottle: translate(
    'monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'
  ),
  save: translate('monitoring.moreContent.sampling.content.config.save'),
  alertNull: translate('error.nullValue'),
  alertSuccess: translate('success.text'),
  alertError: translate('error.text'),
  alertSaveConfigError: translate('error.monitoring.saveSampingConfig'),
}

export default class ModBusConfig extends React.PureComponent {
  static propTypes = {
    configSampling: PropTypes.object.isRequired,
    checkErr: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    stationId: PropTypes.string.isRequired,
  }

  state = {
    isSaving: false,
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ isSaving: true })
    const { stationId } = this.props
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSaveConfigError, type: 'error' })
        return
      }

      try {
        SamplingAPI.updateConfig(stationId, {
          configSampling: {
            ...values,
            // protocol: "MODBUS"
          },
        })
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSuccess, type: 'success' })
      } catch (error) {
        console.error(
          error,
          '========Lỗi handleSubmit SamplingConfig modbus========== '
        )
        this.setState({ isSaving: false })
        swal({ title: '', type: 'error' })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isSaving } = this.state
    const {
      modbusTcpAddr,
      modbusPort,
      startAddress,
      totalRegister,
      functionCode,
      coilAddr,
      totalBottles,
    } = this.props.configSampling

    return (
      <Form onSubmit={this.handleSubmit}>
        <ConfigModBusWrapper>
          <FormItem>
            {getFieldDecorator('modbusTcpAddr', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: modbusTcpAddr,
            })(
              <Input
                addonBefore="tcp://"
                placeholder="nhap dia chi data-logger"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('modbusPort', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: modbusPort,
            })(
              <Input addonBefore="Port" placeholder="Nhap port data logger" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('startAddress', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: startAddress,
            })(<Input addonBefore="Địa chỉ bắt đầu" placeholder="" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('totalRegister', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: totalRegister,
            })(<Input addonBefore="Tổng số thanh ghi" placeholder="" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('functionCode', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: functionCode,
            })(<Input addonBefore="Function code" placeholder="" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('coilAddr', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: coilAddr,
            })(
              <Input
                addonBefore="Địa chỉ coil:"
                placeholder="Nhap dia chi coil"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('totalBottles', {
              rules: [
                {
                  required: true,
                  message: i18n.alertNull,
                },
              ],
              initialValue: totalBottles,
            })(
              <Input
                addonBefore="Tổng số chai"
                placeholder="Tong so chai cua may lay mau"
              />
            )}
          </FormItem>
        </ConfigModBusWrapper>
        <Button block type="primary" loading={isSaving} htmlType="submit">
          {i18n.save}
        </Button>
      </Form>
    )
  }
}
