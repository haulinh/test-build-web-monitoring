import Clearfix from 'components/elements/clearfix'
import ApiSharingDetail from 'containers/api-sharing/component/ApiSharingDetail'
import { i18n } from 'containers/api-sharing/constants'
import { getPathname, getRouteList } from 'containers/api-sharing/util'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import ConfigTab from './form/config-tab'
import QueryTab from './form/query-tab'
const Breadcrumb = createBreadcrumb()

@withRouter
export class NewestWqiStationFixedEdit extends Component {
  state = {
    name: '',
  }

  setName = name => {
    this.setState({ name })
  }

  render() {
    const { location } = this.props
    const pathname = getPathname(location)
    const routeList = getRouteList(location)
    const { name } = this.state
    return (
      <PageContainer hideBackground={true}>
        <Clearfix height={32} />
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n().titleMenu[pathname],
              href: routeList,
            },
            {
              id: '2',
              name,
            },
          ]}
        />
        <ApiSharingDetail
          rule="edit"
          setName={this.setName}
          queryTab={QueryTab}
          configTab={ConfigTab}
        />
      </PageContainer>
    )
  }
}
