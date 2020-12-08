import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from './breadcrumb'
import SearchForm from './search-form'

export class StationFixedReport extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['base']} />
        <SearchForm
            // initialValues={this.props.formData}
            // measuringData={this.props.formData.measuringData}
            // onSubmit={this.handleSubmitSearch}
            // searchNow={this.props.formData.searchNow}
            // onDownload={this.handleDownload}
            // importSuccess={this.importSuccess}
          />
      </PageContainer>
    )
  }
}
