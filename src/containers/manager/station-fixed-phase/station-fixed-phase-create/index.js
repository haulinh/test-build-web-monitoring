import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import StationFixedPhaseApi from 'api/station-fixed/StationFixedPhaseApi.js'

import slug from 'constants/slug'
import StationFixedPhaseForm from '../station-fixed-phase-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { Clearfix } from 'components/elements'
import { translate } from 'hoc/create-lang'

@protectRole(ROLE.STATION_FIXED_PHASE.CREATE)
@autobind
export default class StationFixedPhaseCreate extends React.PureComponent {
  state = {
    isLoading: false,
  }
  async handleSubmit(data) {
    this.setState({ isLoading: true })
    return  StationFixedPhaseApi.createStationFixedPhase(data)
      .then(values => {
        this.setState({ isLoading: false })
        if (values) {
          message.success(translate('stationTypeManager.create.success'))
          this.props.history.push(slug.stationFixedPhase.list)
        }
        return values
      })
      .catch((error) => {
        return {
          ...error
        }
      }).finally(()=>{
        this.setState({ isLoading: false })
      })
    
  }

  render() {
    return (
      <PageContainer title="Create station type" {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <StationFixedPhaseForm
          isLoading={this.state.isLoading}
          onSubmit={this.handleSubmit}
        />
      </PageContainer>
    )
  }
}
