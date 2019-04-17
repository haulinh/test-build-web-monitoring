import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import StationFixedApi from 'api/StationFixedApi'
import slug from 'constants/slug'
import StationFixedForm from '../station-fixed-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role/index.backup'

@protectRole(ROLE.STATION_AUTO.CREATE)
@autobind
export default class StationFixedCreate extends React.PureComponent {
  async handleSubmit(data) {
    const res = await StationFixedApi.createStationFixed(data)
    if (res.success) {
      message.info('Add measuring success!')
      this.props.history.push(slug.stationFixed.list)
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <StationFixedForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
