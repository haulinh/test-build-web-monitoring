import React from 'react'
import {
  Form,
  Button,
  Modal,
  Input,
  message
} from 'antd'
import * as _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
const FormItem = Form.Item
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class ModalFileName extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.updateData(this.props.data, values)
      }
    });
    
  }

  updateData = async (record, data) => { 
    const originData = _.get(record, 'options.transferFtp', {})
    const rs = await StationAutoApi.transferFtp(record._id, {transferFtp: _.merge(originData, data)})
    if (_.get(rs, 'success')) {
      message.info(translate('ftpTranfer.success'))
      this.props.modalSave()
    } else {
      message.info(translate('ftpTranfer.error'))
    }
  }

  returnInput = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem
        >
          {getFieldDecorator('fileName', {
            initialValue: _.get(this.props, 'data.options.transferFtp.fileName', ''),
            rules: [
              { required: true,  message: translate('ftpTranfer.formInFoFTP.fileName.message') }
            ]
          })(
            <Input placeholder={translate('ftpTranfer.formInFoFTP.fileName.title')} addonBefore={translate('ftpTranfer.formInFoFTP.fileName.addonBefore')}/>
          )}
        </FormItem>
      </Form>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.showModal}
        title={translate('ftpTranfer.formInFoFTP.fileName.title')}
        onOk={this.props.handleSubmit}
        onCancel={this.props.modalCancel}
        footer={[
          <Button key="back" onClick={this.props.modalCancel}>
            {this.props.lang.t(
              'ftpTranfer.cancel'
            )}
          </Button>,
          <Button key="submit" type="primary" htmlType="button" onClick={this.handleSubmit}>
            {this.props.lang.t(
              'ftpTranfer.save'
            )}
          </Button>
        ]}
      >
       {this.returnInput()}
      </Modal>
    )
  }
}
