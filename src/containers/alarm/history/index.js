import { Form } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { Search, BoxShadow, Clearfix } from 'components/layouts/styles'
import { getTimes, getTimesUTC } from 'utils/datetime'
import CalculateApi from 'api/CalculateApi'
import HistoryList from './HistoryList'
import { translate as t } from 'hoc/create-lang'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import Filter from './Filter'

const Breadcrumb = createBreadcrumb()

export const FIELDS = {
  TIME: 'time',
  STATION_IDS: 'stationIds',
  PROVINCE: 'province',
  IS_HAPPEN: "isHappen"
}

@Form.create()
export default class AlarmHistory extends Component {
  state = {
    visible: false,
    result: [],
    loading: false,
    page: 1,
    total: null,
  }

  handleOnSearch = async () => {
    const params = await this.getParams()
    if (!params) return
    this.setState({ loading: true })
    try {
      const result = await CalculateApi.getAlarmsLog(params)
      this.setState({ result, loading: false })
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
      stationIdsStr: values[FIELDS.STATION_IDS].join(),
      isHappen: values[FIELDS.IS_HAPPEN]
    }
    return queryParams
  }

  render() {
    const { form } = this.props
    const { loading, result } = this.state
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: t('alarm.menu.history'),
            },
          ]}
        />
        <Clearfix height={32} />
        <Search onSearch={this.handleOnSearch} loading={loading}>
          <BoxShadow>
            <Filter form={form} onSearch={this.handleOnSearch} />
          </BoxShadow>
        </Search>
        <Clearfix height={24} />
        <HistoryList
          data={result}
          onSearch={this.handleOnSearch}
        />
      </PageContainer>
    )
  }
}
