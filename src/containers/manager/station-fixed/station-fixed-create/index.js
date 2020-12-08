import React from 'react'

/** */
import Breadcrumb from '../breadcrumb'
import StationFixedForm from '../station-fixed-form'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Clearfix from 'components/elements/clearfix'


export default class StationFixedCreateContainer extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <StationFixedForm />
      </PageContainer>
    )
  }
}
