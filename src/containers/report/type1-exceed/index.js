import { Form } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment'
import React, { Component } from 'react'
import styled from 'styled-components'
import { getTimeUTC } from 'utils/datetime'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'

const Text = styled.div`
  font-size: 16px;
  font-weight: 600px;
`

export const FIELDS = {
  reportType: 'reportType',
  time: 'time',
  province: 'province',
  stationKey: 'stationKeys',
  selectTime: 'selectTime',
  isFilter: 'isFilter',
}

@Form.create()
export default class ReportExceed extends Component {
  state = {
    resultReport: {},
    loading: false,
  }

  getQueryParams = async () => {
    const { form } = this.props
    const values = await form.getFieldsValue()
    const type = values.reportType
    const params = values.reportType === 'year' ?
      {
        time: getTimeUTC(moment(values.time, 'YYYY').startOf('year')),
        isFilter: values.isFilter,
        stationKeys: values.stationKeys.join(','),
      }
      :
      {
        time: values.time.clone().utc().format(),
        isFilter: values.isFilter,
        stationKeys: values.stationKeys.join(','),
      }
    return { params , type }
  }

  handleOnSearch = async () => {
    const data = await this.getQueryParams()
    console.log(data.type)
    try {
      const results = await DataInsight.getExceedData(data.type, data.params)
      console.log(results)
    }
    catch (err) {
      console.log(err)
    }
  }

  render() {
    const { form } = this.props
    const { loading} = this.state

    return (
      <PageContainer>
        <div style={{ height: '100vh' }}>
          <Clearfix height={16} />
          <Breadcrumb items={['type1_exceed']} />
          <Search loading={loading} onSearch={this.handleOnSearch}>
            <BoxShadow>
              <Filter form={form} />
            </BoxShadow>
          </Search>
          <Clearfix height={32} />
        </div>
      </PageContainer>
    )
  }
}
