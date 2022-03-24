import { Spin } from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import ROLE from 'constants/role'
import { autobind } from 'core-decorators'
import createManagerEdit from 'hoc/manager-edit'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import PropTypes from 'prop-types'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import StationFixedForm from '../station-fixed-form'

@protectRole(ROLE.STATION_FIXED.EDIT)
@createManagerEdit({
  apiUpdate: StationFixedPeriodic.updateStationFixedPeriodic,
  apiGetByKey: StationFixedPeriodic.getStationFixedPeriodic,
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
