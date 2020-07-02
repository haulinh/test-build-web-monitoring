import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import CategoryApi from 'api/CategoryApi'
import slug from 'constants/slug'
import StationTypeForm from '../station-type-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { Clearfix } from 'components/elements'
import { translate } from 'hoc/create-lang'

@protectRole(ROLE.STATION_TYPE.CREATE)
@autobind
export default class StationTypeCreate extends React.PureComponent {
  state = {
    isLoading: false,
  }
  async handleSubmit(data) {
    this.setState({ isLoading: true })
    const res = await CategoryApi.createStationType(data)
    this.setState({ isLoading: false })
    if (res.success) {
      message.success(translate('stationTypeManager.create.success'))
      this.props.history.push(slug.stationType.list)
    }
    return res
  }

  render() {
    return (
      <PageContainer title="Create station type" {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <StationTypeForm
          isLoading={this.state.isLoading}
          onSubmit={this.handleSubmit}
        />
      </PageContainer>
    )
  }
}
