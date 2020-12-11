import React from 'react'
import { Spin } from 'antd'
import { autobind } from 'core-decorators'

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi.js'

import StationFixedForm from '../station-fixed-form'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'
// import { translate } from 'hoc/create-lang'

// @protectRole(ROLE.STATION_TYPE.EDIT)
@createManagerEdit({
  apiUpdate: StationFixedPointApi.updateStationFixedPoint,
  apiGetByKey: StationFixedPointApi.getStationFixedPoint,
})
@autobind
export default class StationFixedEdit extends React.PureComponent {
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
    this.props.onUpdateItem(data)
    //const key = this.props.match.params.key
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    this.props.getItem()
  }

  render() {
    return (
      <PageContainer>
        <Spin spinning={!this.props.isLoaded}>
          <Breadcrumb
            items={[
              'list',
              {
                id: 'edit',
                name: this.props.isLoaded ? this.props.data.name : null,
              },
            ]}
          />
          {this.props.isLoaded && (
            <StationFixedForm
              isEdit
              isLoading={this.props.isUpdating}
              initialValues={
                this.state.dataSource ? this.state.dataSource : this.props.data
              }
              onSubmit={this.handleSubmit}
            />
          )}
        </Spin>
      </PageContainer>
    )
  }
}
