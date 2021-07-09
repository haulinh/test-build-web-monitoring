import Clearfix from 'components/elements/clearfix'
import { i18n } from 'containers/api-sharing/constants'
import { getPathname } from 'containers/api-sharing/util'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import ApiSharingDetail from './form/ApiSharingDetail'

const Breadcrumb = createBreadcrumb()

@withRouter
export class HistoryDataStationAutoView extends Component {
  render() {
    const pathname = getPathname(this.props.location)
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n.titleMenu[pathname],
            },
          ]}
        />
        <Clearfix height={32} />
        <ApiSharingDetail rule="edit" />
      </PageContainer>
    )
  }
}
