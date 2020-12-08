import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon, Spin } from 'antd'
import { autobind } from 'core-decorators'
import QCVNApi from 'api/QCVNApi'
import Clearfix from 'components/elements/clearfix'
import QCVNForm from '../qcvn-form'
import slug from '/constants/slug'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import { message } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

@protectRole(ROLE.QCVN.EDIT)
@createManagerDelete({
  apiDelete: QCVNApi.deleteQCVN,
})
@createManagerEdit({
  apiUpdate: QCVNApi.updateQCVN,
  apiGetByKey: QCVNApi.getQCVNByID,
})
@autobind
export default class QCVNEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }
  state = {
    dataSource: null,
  }

  async handleSubmit(data) {
    this.setState({
      dataSource: data,
    })

    this.props.onUpdateItem(data).then(() => {
      this.props.history.push(slug.qcvn.list)
    })

    //const key = this.props.match.params.key
  }

  //Su kien truoc khi component duoc tao ra
  async componentDidMount() {
    //const key = this.props.match.params.key
    await this.props.getItem()
   
    if (!this.props.success) {
      message.error(this.props.lang.t('addon.error'))
      this.props.history.push(slug.qcvn.list)
    }
  }

  cleanData() {
    let data = {
      ...this.props.data,
    }

    data.measuringList = this.props.data.measuringList || []
    // data.listMeasuring = this.props.data.listMeasuring || []
    // console.log(data);
    // console.log(data.listMeasuring);
    return data
  }

  deleteQCVN() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.qcvn.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteQCVN}>
          <Icon type="delete" />
          Delete
        </Button>
      </div>
    )
  }

  render() {
    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
        <Clearfix height={16} />
        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name:
                this.props.isLoaded && this.props.success
                  ? this.cleanData().name
                  : null,
            },
          ]}
        />
        <Spin style={{ width: '100%' }} spinning={!this.props.isLoaded}>
          {this.props.isLoaded && this.props.success && (
            <QCVNForm
              isLoading={this.props.isUpdating}
              initialValues={
                this.state.dataSource ? this.state.dataSource : this.cleanData()
              }
              onSubmit={this.handleSubmit}
              isEdit={true}
            />
          )}
        </Spin>
      </PageContainer>
    )
  }
}
