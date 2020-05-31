import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form'
import { getUrlReportType1 } from 'api/DataStationAutoApi'
import { connect } from 'react-redux'

@connect(state => ({
  token: state.auth.token,
}))
export default class ReportType1 extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(values) {
    let measuringListStr = ''
    if (values.measuringList)
      measuringListStr = values.measuringList.map(item => item.key).join(',')

    let url = getUrlReportType1(
      this.props.token,
      values.stationAuto,
      values.time.format('MM-YYYY'),
      measuringListStr,
      values.measuringListUnitStr
    )
    console.log('getUrlReportType1', url)
    // window.location.href = url
    window.open(url)
  }
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type1']} />
        <SearchForm cbSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
