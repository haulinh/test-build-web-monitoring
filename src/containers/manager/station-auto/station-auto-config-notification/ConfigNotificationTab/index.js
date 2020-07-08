import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Collapse } from 'antd'
import OrganizationApi from 'api/OrganizationApi'
import createManagerList from 'hoc/manager-list'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import TableConfig from './TableConfig'

const { Panel } = Collapse

@createManagerList({
  apiList: OrganizationApi.getConfigNotify,
})
@createLanguageHoc
export default class ConfigNotificationTab extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
  }

  render() {
    const { dataSource: configNotifyData, isLoading } = this.props
    return (
      <React.Fragment>
        <Spin spinning={isLoading}>
          <Collapse defaultActiveKey={['DATA_STATUS']}>
            {configNotifyData.map(configNotify => (
              <Panel
                header={translate(
                  `configNotify.headerStatus.${configNotify.key}`
                )}
                key={configNotify.key}
              >
                <TableConfig title={configNotify.key} data={configNotify} />
              </Panel>
            ))}
          </Collapse>
        </Spin>
      </React.Fragment>
    )
  }
}
