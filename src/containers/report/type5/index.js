import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form'
import { getUrlReportType5 } from 'api/DataStationAutoApi'
import { connect } from 'react-redux'
// import axios from 'axios'

@connect(state => ({
  token: state.auth.token,
}))
export default class ReportType1 extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(values) {
    let measuringListUnitStr = ''
    if (values.measuringList)
      measuringListUnitStr = values.measuringList
        .map(item => encodeURIComponent(item.unit))
        .join(',')

    let measuringListStr = ''
    if (values.measuringList)
      measuringListStr = values.measuringList
        .map(item => encodeURIComponent(item.key))
        .join(',')
    let url = getUrlReportType5(
      this.props.token,
      values.stationAuto,
      values.time.format('MM-YYYY'),
      measuringListStr,
      measuringListUnitStr
    )

    window.open(url)
  }
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type5']} />
        <SearchForm cbSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
