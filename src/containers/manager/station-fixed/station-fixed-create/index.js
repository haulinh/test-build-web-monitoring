import { message } from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import Clearfix from 'components/elements/clearfix'
import ROLE from 'constants/role'
/** */
import slug from 'constants/slug'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import StationFixedForm from '../station-fixed-form'

function i18n() {
  return {
    success: translate('stationTypeManager.create.success'),
    error: translate('addon.onSave.add.error'),
  }
}
@protectRole(ROLE.STATION_FIXED.CREATE)
@createLanguageHoc
export default class StationFixedCreateContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  handleSubmit = async data => {
    this.setState({ isLoading: true })
    return StationFixedPeriodic.createStationFixedPeriodic(data)
      .then(values => {
        this.setState({ isLoading: false })
        if (values) {
          message.success(i18n().success)
          this.props.history.push(slug.stationFixed.list)
        }
        return values
      })
      .catch(error => {
        this.setState({ isUpdating: false })
        message.error(i18n().error)
        return {
          ...error,
        }
      })
      .finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <StationFixedForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
