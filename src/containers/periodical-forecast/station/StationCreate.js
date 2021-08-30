import { message } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import Clearfix from 'components/elements/clearfix'
import ROLE from 'constants/role'
/** */
import slug from 'constants/slug'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import StationForm from './StationForm'

const i18n = {
  success: translate('periodicalForecast.message.createSuccess'),
  error: translate('addon.onSave.add.error'),
}
@protectRole(ROLE.STATION_FIXED.CREATE)
@createLanguageHoc
export default class StationCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  handleSubmit = async data => {
    this.setState({ isLoading: true })
    return PeriodicForecastApi.createStation(data)
      .then(values => {
        this.setState({ isLoading: false })
        if (values) {
          message.success(i18n.success)
          this.props.history.push(slug.periodicalForecast.station)
        }
        return values
      })
      .catch(error => {
        this.setState({ isUpdating: false })
        message.error(i18n.error)
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
        <StationForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
