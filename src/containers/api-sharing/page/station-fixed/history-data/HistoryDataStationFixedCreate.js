import Clearfix from 'components/elements/clearfix'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import ApiSharingDetail from './form/ApiSharingDetail'
import { withRouter } from 'react-router'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { i18n } from 'containers/api-sharing/constants'
import { getPathname } from 'containers/api-sharing/util'
const Breadcrumb = createBreadcrumb()

@withRouter
export class HistoryDataStationFixedCreate extends Component {
  render() {
    const pathname = getPathname(this.props.location)
    return (
      <PageContainer hideBackground={true}>
        <Clearfix height={32} />
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n.titleMenu[pathname],
            },
            {
              id: '2',
              name: i18n.titleMenu.create,
            },
          ]}
        />
        <ApiSharingDetail rule="create" />
      </PageContainer>
    )
  }
}
