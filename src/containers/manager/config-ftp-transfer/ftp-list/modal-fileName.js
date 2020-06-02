import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Modal, Input, message, Select, Divider } from 'antd'
import * as _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
const FormItem = Form.Item
const { Option } = Select

@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@autobind
export default class ModalFileName extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    dataConfigFtp: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    modalSave: PropTypes.func,
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.updateData(this.props.data, values)
      }
    })
  }

  async updateData(record, data) {
    const originData = _.get(record, 'options.transferFtp', {})
    const rs = await StationAutoApi.transferFtp(record._id, {
      transferFtp: _.merge(originData, data),
    })
    if (_.get(rs, 'success')) {
      message.info(translate('ftpTranfer.success'))
      if (this.props.modalSave) {
        this.props.modalSave()
      }
    } else {
      message.info(translate('ftpTranfer.error'))
    }
  }

  onChageConfigFtp = key => {
    const { setFieldsValue } = this.props.form
    const item = _.find(this.props.dataConfigFtp, { key: key })
    // console.log(item,"onChageConfigFtp")
    setFieldsValue(item)
  }

  returnInput = () => {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout={'horizontal'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ paddingRight: '8px', minWidth: '100px' }}>
            Mẫu cấu hình:
          </div>

          <Select style={{ width: '100%' }} onChange={this.onChageConfigFtp}>
            {_.map(this.props.dataConfigFtp, item => {
              return (
                <Option key={item.key} value={item.key}>
                  {`ftp://${item.ip}`}
                </Option>
              )
            })}
          </Select>
        </div>
        <Divider type="horizontal" />
        <FormItem>
          {getFieldDecorator('fileName', {
            initialValue: _.get(
              this.props,
              'data.options.transferFtp.fileName',
              ''
            ),
            rules: [
              {
                required: true,
                message: translate('ftpTranfer.formInFoFTP.fileName.message'),
              },
            ],
          })(
            <Input
              placeholder={translate('ftpTranfer.formInFoFTP.fileName.title')}
              addonBefore={translate(
                'ftpTranfer.formInFoFTP.fileName.addonBefore'
              )}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('ip', {
            initialValue: _.get(this.props, 'data.options.transferFtp.ip', ''),
            rules: [
              {
                required: true,
                message: translate('ftpTranfer.formInFoFTP.ipAddress.message'),
              },
            ],
          })(
            <Input
              placeholder={translate('ftpTranfer.formInFoFTP.ipAddress.title')}
              addonBefore={translate(
                'ftpTranfer.formInFoFTP.ipAddress.addonBefore'
              )}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('port', {
            rules: [
              {
                required: true,
                message: translate('ftpTranfer.formInFoFTP.port.message'),
              },
            ],
            initialValue: _.get(
              this.props,
              'data.options.transferFtp.port',
              ''
            ),
          })(
            <Input
              placeholder={translate('ftpTranfer.formInFoFTP.port.title')}
              addonBefore={translate('ftpTranfer.formInFoFTP.port.addonBefore')}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('user', {
            rules: [
              {
                required: true,
                message: translate('ftpTranfer.formInFoFTP.user.message'),
              },
            ],
            initialValue: _.get(
              this.props,
              'data.options.transferFtp.user',
              ''
            ),
          })(
            <Input
              placeholder={translate('ftpTranfer.formInFoFTP.user.title')}
              addonBefore={translate('ftpTranfer.formInFoFTP.user.addonBefore')}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pass', {
            rules: [
              {
                required: true,
                message: translate('ftpTranfer.formInFoFTP.pass.message'),
              },
            ],
            initialValue: _.get(
              this.props,
              'data.options.transferFtp.pass',
              ''
            ),
          })(
            <Input
              placeholder={translate('ftpTranfer.formInFoFTP.pass.title')}
              addonBefore={translate('ftpTranfer.formInFoFTP.pass.addonBefore')}
            />
          )}
        </FormItem>
      </Form>
    )
  }

  render() {
    console.log(this.props.data, this.props.dataConfigFtp, 'dataModal')
    return (
      <Modal
        visible={this.props.showModal}
        title={translate('ftpTranfer.formInFoFTP.fileName.title')}
        onOk={this.props.handleSubmit}
        onCancel={this.props.modalCancel}
        footer={[
          <Button key="back" onClick={this.props.modalCancel}>
            {this.props.lang.t('ftpTranfer.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="button"
            onClick={this.handleSubmit}
          >
            {this.props.lang.t('ftpTranfer.save')}
          </Button>,
        ]}
      >
        {this.returnInput()}
      </Modal>
    )
  }
}
