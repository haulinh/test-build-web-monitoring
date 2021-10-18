import { Form } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { Filter } from './Filter'
import { HistoryList } from './HistoryList'
import { Search, BoxShadow, Clearfix } from 'components/layouts/styles'
import { getTimes, getTimesUTC } from 'utils/datetime'

export const FIELDS = {
  TIME: 'time',
  STATION_IDS: 'stationIds',
  PROVINCE: 'province',
}

@Form.create()
export default class AlarmHistory extends Component {
  state = {
    visible: false,
    result: {},
    loading: false,
    page: 1,
    total: null,
  }

  handleOnSearch = async () => {
    const params = await this.getParams()
    if (!params) return
    this.setState({ loading: true })
    try {
      // const result = await CalculateApi.getTickets(params)
      // this.setState({ result, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  getParams = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    if (!values) return

    const times = getTimes(values[FIELDS.TIME])
    const { from, to } = getTimesUTC(times)

    const queryParams = {
      from,
      to,
    }

    return queryParams
  }

  render() {
    const { form } = this.props
    const { loading } = this.state
    return (
      <PageContainer>
        <Clearfix height={32} />
        <Search onSearch={this.handleOnSearch} loading={loading}>
          <BoxShadow>
            <Filter form={form} onSearch={this.handleOnSearch} />
          </BoxShadow>
        </Search>
        <HistoryList />
      </PageContainer>
    )
  }
}
