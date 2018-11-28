import React from 'react'
// import PropTypes from 'prop-types'
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
import AuthApi from 'api/AuthApi'
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
        this.updateData (this.state.organization._id, data)
      }
    });
  }

  updateData =  async (id, transferFtpInfo) => {
    const rs = await organizationAPI.updatetransferFtpInfo(id, { transferFtpInfo })
    if(rs.success){
      message.info('Cập nhật thành công')
      this.getDataOganization()
    } else {
      message.info('Lỗi..!')
    } 
  }

   
  componentDidMount() {
    this.getDataOganization()
  }

  async getDataOganization (){
    const record = await AuthApi.getMe()
    this.setState({ organization: _.get(record, 'data.organization', {}) })
   
  }

  render() {
    console.log(this.state.organization)
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('ip', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.ipAddress.message') }],
            initialValues: _.get(this.state.organization, 'transferFtpInfo.ip', '')
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.ipAddress.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.ipAddress.addonBefore')}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('port', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.port.message') }],
            initialValues: _.get(this.state.organization, 'transferFtpInfo.port', '')
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
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.user.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.user.addonBefore')}
           //   value = {_.get(this.state.organization, 'transferFtpInfo.user', '')}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pass', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.pass.message') }],
          })(
            <Input 
              placeholder={translate('ftpTranfer.formInFoFTP.pass.title')} 
              addonBefore={translate('ftpTranfer.formInFoFTP.pass.addonBefore')}
            //  value = {_.get(this.state.organization, 'transferFtpInfo.pass', '')}
            />
          )}
        </FormItem>
        {/* <FormItem>
          {getFieldDecorator('path', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.path.message') }],
          })(
            <Input placeholder={translate('ftpTranfer.formInFoFTP.path.title')} addonBefore={translate('ftpTranfer.formInFoFTP.path.addonBefore')}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pathImported', {
            rules: [{ required: true, message: translate('ftpTranfer.formInFoFTP.pathImported.message') }],
          })(
            <Input placeholder={translate('ftpTranfer.formInFoFTP.pathImported.title')} addonBefore={translate('ftpTranfer.formInFoFTP.pathImported.addonBefore')}/>
          )}
          </FormItem> */}
          {/* <Button type="primary" htmlType="submit" className="login-form-button">
            Save
          </Button> */}
        <FormItem>
          <Button  style={{ width: '100%' }} type="primary" htmlType="submit">
             {translate('addon.save')}
          </Button>
        </FormItem>
      </Form>
    );
  }

}
