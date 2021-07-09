import Clearfix from 'components/elements/clearfix'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetail from './form/ApiSharingDetail'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { i18n } from 'containers/api-sharing/constants'
import { getPathname } from 'containers/api-sharing/util'
const Breadcrumb = createBreadcrumb()

@withRouter
export class HistoryDataStationFixedView extends Component {
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
