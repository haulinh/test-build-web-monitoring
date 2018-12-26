import React from 'react'
import {
  Form,
  Input,
  Button,
  message
} from 'antd'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import organizationAPI from 'api/OrganizationApi'
const FormItem = Form.Item
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class OptionModalConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      organization: {}
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = _.pick(values, ['ip', 'port', 'user', 'pass'])
        this.updateData (data)
      }
    });
  }

  updateData = async (transferFtpInfo) => {
    const rs = await organizationAPI.updatetransferFtpInfo(this.props._id, { transferFtpInfo })
    if(rs.success){
      message.info(translate('ftpTranfer.success'))
      this.props.onSaveFtpConfig()
    } else {
      message.info(translate('ftpTranfer.error'))
    } 
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem
          //label={translate('stationAutoManager.config.fileName.label')}
        >
          {getFieldDecorator('ip', {
            initialValue: _.get(this.props, 'transferFtpInfo.ip', ''),
            rules: [
              { required: true,  message: translate('ftpTranfer.formInFoFTP.ipAddress.message') }
            ]
          })(
            <Input placeholder={translate('ftpTranfer.formInFoFTP.ipAddress.title')} addonBefore={translate('ftpTranfer.formInFoFTP.ipAddress.addonBefore')}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('port', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.port.message') }],
            initialValue: _.get(this.props, 'transferFtpInfo.port', '')
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.port.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.port.addonBefore')}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('user', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.user.message') }],
            initialValue: _.get(this.props, 'transferFtpInfo.user', '')
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.user.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.user.addonBefore')}
              
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pass', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.pass.message') }],
            initialValue: _.get(this.props, 'transferFtpInfo.pass', '')
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.pass.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.pass.addonBefore')}
            />
          )}
        </FormItem>
        <FormItem>
          <Button  style={{ width: '100%' }} type="primary" htmlType="button" onClick={this.handleSubmit}>
             {translate('addon.save')}
          </Button>
        </FormItem>
      </Form>
    );
  }

}
