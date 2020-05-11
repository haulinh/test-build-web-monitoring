import React from "react"
import PropTypes from "prop-types"
import { Form, Input, Button, message, Table, Divider, Popconfirm } from "antd"
import Link from "components/elements/link"
import * as _ from "lodash"
import { mapPropsToFields } from "utils/form"
import createLanguageHoc, { translate } from "hoc/create-lang"
import organizationAPI from "api/OrganizationApi"
import { Clearfix } from "components/elements"
import moment from "moment"
const FormItem = Form.Item
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
export default class OptionModalConfig extends React.Component {
  static propTypes = {
    transferFtpInfo: PropTypes.array,
    _id: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      organization: {},
      dataConfig: [],
      itemEdit: null,
      isLoaded: true,
      statusForm: {
        isVisibleForm: false,
        isAdd: false
      }
    }
    this.handlDelete = this.handlDelete.bind(this)
  }

  componentDidMount = () => {
    this.setState({
      dataConfig: _.isArray(this.props.transferFtpInfo)
        ? this.props.transferFtpInfo
        : []
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isLoaded: false })
        const item = _.pick(values, ["ip", "port", "user", "pass"])

        let data
        if (this.state.statusForm.isAdd) {
          data = _.concat(this.state.dataConfig, {
            key: this.state.itemEdit.key,
            ...item
          })
        } else {
          const itemEdit = {
            ...this.state.itemEdit,
            ...item
          }
          data = _.map(this.state.dataConfig, itemMap => {
            if (itemMap.key === itemEdit.key) {
              return itemEdit
            }
            return itemMap
          })
        }
        // console.log(data, "data")
        const rs = await organizationAPI.updatetransferFtpInfo(this.props._id, {
          transferFtpInfo: data
        })
        if (rs.success) {
          message.info(translate("ftpTranfer.success"))

          this.setState({
            itemEdit: null,
            dataConfig: data,
            isLoaded: true,
            statusForm: {
              isVisibleForm: false,
              isAdd: null
            }
          })
          this.props.onSaveFtpConfig()
        } else {
          message.info(translate("ftpTranfer.error"))
        }
      }
    })
  }

  handleEdit = item => {
    this.setState(
      {
        itemEdit: null,
        statusForm: {
          isVisibleForm: false,
          isAdd: null
        }
      },
      () => {
        this.setState({
          itemEdit: item,
          statusForm: {
            isVisibleForm: true,
            isAdd: false
          }
        })
      }
    )
  }

  async handlDelete(item) {
    let data = _.map(this.state.dataConfig, itemMap => {
      if (itemMap.key === item.key) {
        return null
      }
      return itemMap
    })

    // console.log(_.compact(data), "_.compact(data)")

    const rs = await organizationAPI.updatetransferFtpInfo(this.props._id, {
      transferFtpInfo: _.compact(data)
    })
    if (rs.success) {
      message.info(translate("ftpTranfer.success"))
      this.setState({
        itemEdit: null,
        dataConfig: _.compact(data),
        statusForm: {
          isVisibleForm: false,
          isAdd: null
        }
      })
    } else {
      message.info(translate("ftpTranfer.error"))
    }
  }

  handleAddConfig = () => {
    this.setState({
      isLoaded: false
    })
    const item = {
      key: moment().format("YYYYMMDDHHmmss"),
      ip: "",
      port: "",
      user: "",
      pass: ""
    }
    this.setState({
      itemEdit: item,
      statusForm: {
        isVisibleForm: true,
        isAdd: true
      }
    })
  }

  render() {
    // console.log(this.state.dataConfig, "dataConfig")
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        {this.state.statusForm.isVisibleForm && (
          <Form className="login-form">
            <FormItem
            >
              {getFieldDecorator("ip", {
                initialValue: _.get(this.state, "itemEdit.ip", ""),
                rules: [
                  {
                    required: true,
                    message: translate(
                      "ftpTranfer.formInFoFTP.ipAddress.message"
                    )
                  }
                ]
              })(
                <Input
                  placeholder={translate(
                    "ftpTranfer.formInFoFTP.ipAddress.title"
                  )}
                  addonBefore={translate(
                    "ftpTranfer.formInFoFTP.ipAddress.addonBefore"
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("port", {
                rules: [
                  {
                    required: true,
                    message: translate("ftpTranfer.formInFoFTP.port.message")
                  }
                ],
                initialValue: _.get(this.state, "itemEdit.port", "")
              })(
                <Input
                  placeholder={translate("ftpTranfer.formInFoFTP.port.title")}
                  addonBefore={translate(
                    "ftpTranfer.formInFoFTP.port.addonBefore"
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("user", {
                rules: [
                  {
                    required: true,
                    message: translate("ftpTranfer.formInFoFTP.user.message")
                  }
                ],
                initialValue: _.get(this.state, "itemEdit.user", "")
              })(
                <Input
                  placeholder={translate("ftpTranfer.formInFoFTP.user.title")}
                  addonBefore={translate(
                    "ftpTranfer.formInFoFTP.user.addonBefore"
                  )}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("pass", {
                rules: [
                  {
                    required: true,
                    message: translate("ftpTranfer.formInFoFTP.pass.message")
                  }
                ],
                initialValue: _.get(this.state, "itemEdit.pass", "")
              })(
                <Input
                  placeholder={translate("ftpTranfer.formInFoFTP.pass.title")}
                  addonBefore={translate(
                    "ftpTranfer.formInFoFTP.pass.addonBefore"
                  )}
                />
              )}
            </FormItem>
            
            <FormItem>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="button"
                onClick={this.handleSubmit}
              >
                {translate("addon.save")}
              </Button>
            </FormItem>
          </Form>
        )}

        <div>
          <Button
            type="primary"
            disabled={this.state.statusForm.isVisibleForm}
            onClick={this.handleAddConfig}
          >
            {translate("ftpTranfer.add")}
          </Button>
        </div>
        <Clearfix height={8} />
        <div>
          {this.state.isLoaded && (
            <Table
              bordered
              pagination={false}
              dataSource={this.state.dataConfig}
              columns={[
                {
                  title: "IP",
                  dataIndex: "ip"
                },
                {
                  title: "Port",
                  dataIndex: "port"
                },
                {
                  title: "User",
                  dataIndex: "user"
                },
                {
                  title: "Pass",
                  dataIndex: "pass"
                },
                {
                  title: "Acction",
                  render: record => {
                    return (
                      <div>
                        <Link to="#" onClick={() => this.handleEdit(record)}>
                          {translate("ftpTranfer.edit")}
                        </Link>
                        <Divider type="vertical" />
                        <Popconfirm
                          title={translate("ftpTranfer.confirmTitle")}
                          onConfirm={() => {
                            this.handlDelete(record)
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Link to="#">{translate("ftpTranfer.delete")}</Link>
                        </Popconfirm>
                      </div>
                    )
                  }
                }
              ]}
            />
          )}
        </div>
      </div>
    )
  }
}
