import { Form, Icon, message, Tabs } from 'antd'
import { dataRoutes, dataShareApiApi } from 'api/ShareApiApi'
import Clearfix from 'components/elements/clearfix'
import Text from 'components/elements/text'
import Example from 'containers/api-sharing/component/Example'
import Search from 'containers/api-sharing/component/Search'
import TableParams from 'containers/api-sharing/component/TableParams'
import { FIELDS, i18n } from 'containers/api-sharing/constants'
import {
  generateGetUrl,
  getDataExample,
  getFieldsDefault,
  isCreate,
} from 'containers/api-sharing/util'
import { withShareApiContext } from 'containers/api-sharing/withShareApiContext'
import { isEqual, get } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import { formatQuarter, getTimes, getTimesUTC } from 'utils/datetime'
import Condition from '../Condition'
import DataTable from './DataTable'
import moment from 'moment'
import { MM_YYYY, YYYY } from 'constants/format-date'

const Method = styled.div`
  display: inline-block;
  text-transform: uppercase;
  color: #fff;
  background: #008019;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
`

const Endpoint = styled.div`
  background: #292b36;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .anticon {
    cursor: pointer;
  }
`

@withRouter
@Form.create()
@withShareApiContext
export default class QueryTab extends Component {
  state = {
    loadingSearch: false,
    dataTable: [],
  }

  componentDidMount() {
    if (!isCreate(this.props.rule)) this.setInitFields()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.data, prevProps.data)) {
      this.setInitFields()
    }
  }

  setInitFields = () => {
    const { data } = this.props
    const config = get(data, 'config', [])

    const fieldsValue = config.reduce((base, current) => {
      let value = current.value
      if (
        [FIELDS.STATION_FIXED.HISTORY_DATA.POINT, 'phaseIds'].includes(
          current.fieldName
        ) &&
        value &&
        value.includes(',')
      ) {
        value = current.value.split(',')
      }

      if (current.fieldName === 'rangeTime')
        value = value.map(item => moment(item))

      return {
        ...base,
        [`config.${current.fieldName}`]: value,
      }
    }, {})

    const optionParams = config
      .filter(field => !field.isDefault)
      .map(field => field.fieldName)

    this.props.form.setFieldsValue({
      ...fieldsValue,
      name: data.name,
      description: data.description,
      optionParams,
    })
  }

  copyUrl = async () => {
    const url = this.getUrl()
    const curl = generateGetUrl(url)

    const success = copyTextToClipboard(curl)
    if (success) message.success('Success')
  }

  getUrl = () => {
    const {
      match: { params },
      data,
    } = this.props

    const fieldsParams = get(data, 'config', [])
      .map(field => ({
        fieldName: field.fieldName,
        value: field.value,
      }))
      .filter(field => field.value && field.fieldName !== 'rangeTime')

    const urlParams = fieldsParams
      .map(field => `${field.fieldName}=${field.value}`)
      .join('&')

    const url = [dataRoutes.getPeriodicWQIHistory(), `id=${params.id}`].join(
      '?'
    )

    const urlQuery = [url, urlParams].join('&')

    return urlQuery
  }

  getQueryParams = () => {
    const { form, data } = this.props
    const { config: fieldsValue } = form.getFieldsValue()

    let measuringList = fieldsValue.measuringList
    if (Array.isArray(measuringList)) measuringList = measuringList.join(',')

    let stationKeys = fieldsValue.stationKeys
    if (Array.isArray(stationKeys)) stationKeys = stationKeys.join(',')

    let phaseIds = fieldsValue.phaseIds
    if (Array.isArray(phaseIds)) phaseIds = phaseIds.join(',')

    const times = getTimes(fieldsValue.rangeTime)
    const { from, to } = getTimesUTC(times)

    const queryParams = {
      id: data._id,
      ...fieldsValue,
      measuringList,
      stationKeys,
      phaseIds,
      from,
      to,
    }

    return queryParams
  }

  handleOnSearch = async () => {
    const { rule } = this.props
    const queryParams = this.getQueryParams()

    this.setState({ loadingSearch: true })
    try {
      const data = await dataShareApiApi.getPeriodicWQIHistory(
        queryParams,
        isCreate(rule)
      )
      if (data) {
        this.setState({ dataTable: this.formatData(data) })
      }
    } catch (error) {
      console.log(error)
    }
    this.setState({ loadingSearch: false })
  }

  getTime = (time, type) => {
    if (type === 'year') return moment(time, 'YYYY').format(YYYY)
    if (type === 'quarter') return formatQuarter(moment(time, 'YYYY-[Q]Q'))
    return moment(time, 'YYYY-MM').format(MM_YYYY)
  }

  formatData = list => {
    const data = list.map(item =>
      item.data.map((ele, idx) => ({
        ...ele,
        point: item.point,
        datetime: this.getTime(ele.datetime, 'month'),
        size: idx === 0 ? item.data.length : null,
      }))
    )
    return data.reduce((prev, item) => [...prev, ...item], [])
  }
  render() {
    const { form, rule, location, menuApiSharingList, data } = this.props
    const dataExample = getDataExample(menuApiSharingList, location)
    const { loadingSearch, dataTable } = this.state
    const { config: { measuringList = [] } = {} } = form.getFieldsValue()
    const fieldsDefault = getFieldsDefault(data)

    return (
      <React.Fragment>
        <Search onSearch={this.handleOnSearch} loading={loadingSearch}>
          <Condition
            isQuery
            form={form}
            rule={rule}
            fieldsDefault={fieldsDefault}
          />
        </Search>

        <Clearfix height={32} />
        {!isCreate(rule) && (
          <React.Fragment>
            <div className="content">
              <Method>GET</Method>
              <Endpoint>
                <Text>{this.getUrl()}</Text>
                <Icon type="copy" onClick={this.copyUrl} />
              </Endpoint>
            </div>
            <Clearfix height={32} />
            <TableParams form={form} />
          </React.Fragment>
        )}

        <Clearfix height={32} />
        <Tabs>
          <Tabs.TabPane tab={i18n.tab.list} key="List">
            <DataTable
              measuringList={measuringList}
              dataSource={dataTable}
              loading={loadingSearch}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={i18n.tab.example} key="Example">
            <Example data={dataExample} />
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    )
  }
}
