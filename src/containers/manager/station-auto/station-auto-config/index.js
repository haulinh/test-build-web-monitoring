import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message, Button, Form, Spin } from 'antd'
import { autobind } from 'core-decorators'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import StationAutoConfigForm from './station-auto-configForm'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import { mapPropsToFields } from 'utils/form'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

const FormItem = Form.Item

@protectRole(ROLE.CAU_HINH_KET_NOI.FILE_MAPPING)
@createManagerDelete({
  apiDelete: StationAutoApi.deleteStationAuto
})
@createManagerEdit({
  apiUpdate: StationAutoApi.updateStationAuto,
  apiGetByKey: StationAutoApi.getStationAuto
})
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@autobind
export default class StationAutoEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      isSubmitting: false,
      tabActive: 'OPTION',
      data: {
        options: _.get(props, 'data.options', {}),
        configLogger: _.get(props, 'data.configLogger', {})
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.data, this.props.data)) {
      this.setState({
        data: {
          options: _.get(nextProps, 'data.options', {}),
          configLogger: _.get(nextProps, 'data.configLogger', {})
        }
      })
    }
  }

  async componentWillMount() {
    await this.props.getItem()
  }

  async handleSubmit() {
    this.setState({
      isSubmitting: true
    })
    let data
    this.props.form.validateFields((err, values) => {
      if (err) return

      let dataConfig = this.getDataConfigForm(values)
      const configLogger = _.get(this.state.data, 'configLogger', {})

      data = {
        options: _.get(this.state.data, 'options', {}),
        configLogger: _.merge(configLogger, dataConfig)
      }

      this.updateData(data)
    })

    this.setState({
      isSubmitting: false
    })
  }

  async updateData(data) {
    if (data) {
      const key = this.props.match.params.key
      const res = await StationAutoApi.updateStationAutoConfig(key, data)
      if (res.success) {
        this.setState({ data })
        message.info(
          this.props.lang.t('stationAutoManager.config.message.success')
        )
      } else
        message.error(
          this.props.lang.t('stationAutoManager.config.message.error')
        )
    }
  }

  getDataOptionsForm(values) {
    let data
    data = {
      warning: {
        allowed: values.allowSendWarning ? values.allowSendWarning : false
      },
      sampling: {
        allowed: values.allowSampling ? values.allowSampling : false,
        apiAddress: values.apiAddress
      },
      camera: {
        allowed: values.allowCamera ? values.allowCamera : false,
        list: values.list ? values.list : []
      }
    }
    if (!data.sampling.allowed) delete data.sampling.apiAddress
    if (!data.camera.allowed) delete data.camera.list
    return data
  }

  getDataConfigForm(values) {
    let data
    data = {
      extensionFile: values.extensionFile,
      fileName: values.fileName,
      //path: values.path,
      measuringList: values.measuringList.filter(
        item => item.measuringDes && item.measuringDes !== ''
      )
    }
    return data
  }
  clickTabs = e => {
    this.setState({ tabActive: e })
  }

  handlApproveSave = approve => {
    let dataPost = {
      options: this.state.data.options,
      configLogger: this.state.data.configLogger
    }
    dataPost.options = { ...dataPost.options, approve }
    this.updateData(dataPost)
  }

  renderSubmitButton = () => {
    return (
      <FormItem>
        <Button
          loading={this.state.isSubmitting}
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          onClick={this.handleSubmit}
        >
          {this.props.lang.t('addon.save')}
        </Button>
      </FormItem>
    )
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Spin spinning={!this.props.isLoaded} delay={500}>
          <Breadcrumb
            items={[
              'config',
              {
                id: 'edit',
                name:
                  this.props.isLoaded && this.props.data
                    ? this.props.data.name
                    : null
              }
            ]}
          />
          {this.props.isLoaded && (
            <StationAutoConfigForm
              form={this.props.form}
              ref={comp => (this.configForm = comp)}
              initialValues={
                this.props.data && this.props.data.configLogger
                  ? this.props.data.configLogger
                  : { measuringList: [] }
              }
              measuringListSource={
                this.props.data && this.props.data.measuringList
                  ? this.props.data.measuringList
                  : []
              }
            />
          )}
          {this.renderSubmitButton()}
        </Spin>
      </PageContainer>
    )
  }
}
