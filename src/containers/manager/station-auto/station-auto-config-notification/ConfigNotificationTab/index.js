import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { autobind } from 'core-decorators'
import OrganizationApi from 'api/OrganizationApi'
import createManagerList from 'hoc/manager-list'
import createLanguageHoc from 'hoc/create-lang'
import Clearfix from 'components/elements/clearfix'
import TableConfig from './TableConfig'

@createManagerList({
  apiList: OrganizationApi.getConfigNotify,
})
@createLanguageHoc
@autobind
export default class ConfigNotificationTab extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */

      cachedData: {} /* commit */,
      dataSource: [] /* working dir */,
      dataSourceOriginal: [] /* index */,

      isSave: false,

      isSamplingIndeterminate: true,
      isSamplingCheckAll: false,
    }
  }

  render() {
    const { dataSource: configNotifyData, isLoading } = this.props
    return (
      <React.Fragment>
        <Spin spinning={isLoading}>
          {configNotifyData.map(configNotify => (
            <React.Fragment key={configNotify.key}>
              <TableConfig title={configNotify.key} data={configNotify} />
              <Clearfix height={20} />
            </React.Fragment>
          ))}
        </Spin>
      </React.Fragment>
    )
  }
}
