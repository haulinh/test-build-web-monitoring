import { message } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ROLE from 'constants/role'
/** */
import slug from 'constants/slug'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ConfigForm from './ConfigForm'

function i18n() {
  return {
    success: translate('periodicalForecast.message.createSuccess'),
    error: translate('addon.onSave.add.error'),
    exist: translate('addon.onSave.add.keyExited_error'),
  }
}
@protectRole(ROLE.BILLING_CONFIG.CREATE)
@createLanguageHoc
export default class ConfigCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  handleSubmit = async data => {
    this.setState({ isLoading: true })
    return DataInsight.createConfigBilling(data)
      .then(values => {
        this.setState({ isLoading: false })
        if (values) {
          message.success(i18n().success)
          this.props.history.push(slug.billing.config)
        }
        return values
      })
      .catch(error => {
        if (error.status === 422) {
          message.error(i18n().exist)
          return
        }
        message.error(i18n().error)
        this.setState({ isUpdating: false })
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
        <ConfigForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
