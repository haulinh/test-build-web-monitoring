import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon, Spin } from 'antd'
import { autobind } from 'core-decorators'
import StationFixedApi from 'api/StationFixedApi'
import StationFixedForm from '../station-fixed-form'
import slug from '/constants/slug'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import { message } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

@protectRole(ROLE.STATION_AUTO.EDIT)
@createManagerDelete({
  apiDelete: StationFixedApi.deleteStationFixed,
})
@createManagerEdit({
  apiUpdate: StationFixedApi.updateStationFixed,
  apiGetByKey: StationFixedApi.getStationFixed,
})
@autobind
export default class StationFixedEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }

  async handleSubmit(data) {
    this.props.onUpdateItem(data)
    //const key = this.props.match.params.key
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    await this.props.getItem()
    if (!this.props.success) {
      message.error(this.props.lang.t('addon.error'))
      this.props.history.push(slug.stationFixed.list)
    }
  }

  cleanData() {
    let data = {
      ...this.props.data,
    }

    data.measuringList = this.props.data.measuringList || []
    return data
  }

  deleteStationAuto() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.stationFixed.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteStationAuto}>
          <Icon type="delete" />
          Delete
        </Button>
      </div>
    )
  }

  render() {
    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
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
            <StationFixedForm
              initialValues={this.cleanData()}
              onSubmit={this.handleSubmit}
              isEdit={true}
            />
          )}
        </Spin>
      </PageContainer>
    )
  }
}
