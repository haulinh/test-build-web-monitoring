import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Spin } from 'antd'
import { autobind } from 'core-decorators'
import StationFixedPhaseApi from 'api/station-fixed/StationFixedPhaseApi.js'

import StationFixedPhaseForm from '../station-fixed-phase-form'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'
// import { translate } from 'hoc/create-lang'

// @protectRole(ROLE.STATION_TYPE.EDIT)
@createManagerEdit({
  apiUpdate: StationFixedPhaseApi.updateStationFixedPhase,
  apiGetByKey: StationFixedPhaseApi.getStationFixedPhase,
})
@autobind
export default class StationFixedPhaseEdit extends React.PureComponent {
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
    console.log(data, '---handleSubmit--')
    this.props.onUpdateItem(data)
    //const key = this.props.match.params.key
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    this.props.getItem()
  }

  render() {
    console.log(this.props.data, this.props.isLoaded, '---render--')
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
            <StationFixedPhaseForm
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
