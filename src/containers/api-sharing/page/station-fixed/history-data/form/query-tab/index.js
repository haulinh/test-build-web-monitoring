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
import _, { isEqual } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import { getTimes, getTimesUTC } from 'utils/datetime'
import Condition from '../Condition'
import DataTable from './DataTable'
import { PermissionPopover } from 'hoc/protect-role'
import ROLE from 'constants/role'

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
    pagination: {
      current: 1,
      pageSize: 10,
    },
    measuringList: [],
  }

  componentDidMount() {
    if (!isCreate(this.props.rule)) {
      this.setInitFields()
      this.handleOnSearch()
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.data, prevProps.data)) {
      this.setInitFields()
      this.handleOnSearch()
    }
  }

  setInitFields = () => {
    const { data } = this.props
    const fieldsValue = _.get(data, 'config', []).reduce((base, current) => {
      let value = current.value
      if (
        [
          FIELDS.STATION_FIXED.HISTORY_DATA.MEASURING_LIST,
          FIELDS.STATION_FIXED.HISTORY_DATA.POINT,
          'phaseIds',
        ].includes(current.fieldName) &&
        value &&
        value.includes(',')
      ) {
        value = current.value.split(',')
      }

      if (current.fieldName === 'measuringList') {
        this.setState({ measuringList: value })
      }

      const fieldValue = {
        [`config.${current.fieldName}`]: value,
      }
      return { ...base, ...fieldValue }
    }, {})

    this.props.form.setFieldsValue({
      ...fieldsValue,
      name: data.name,
      description: data.description,
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

    const fieldsParams = _.get(data, 'config', [])
      .map(field => ({
        fieldName: field.fieldName,
        value: field.value,
      }))
      .filter(
        field =>
          field.value &&
          !['rangeTime', 'stationNames'].includes(field.fieldName)
      )

    const urlParams = fieldsParams
      .map(field => `${field.fieldName}=${field.value}`)
      .join('&')

    const url = [dataRoutes.getPeriodicHistory(), `id=${params.id}`].join('?')

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
    const { form } = this.props

    const values = await form.validateFields()
    if (!values) return

    const queryParams = this.getQueryParams()

    this.setState({ loadingSearch: true })
    try {
      const data = await dataShareApiApi.getPeriodicHistory(queryParams)
      if (data) {
        this.setState({ dataTable: data })
        const { config: { measuringList = [] } = {} } = form.getFieldsValue()
        this.setState({ measuringList })
      }
    } catch (error) {
      console.log(error)
    }
    const initPagination = { current: 1, pageSize: 10 }
    this.setState({ pagination: initPagination, loadingSearch: false })
  }

  setPagination = pagination => {
    this.setState({ pagination })
  }

  render() {
    const { form, rule, location, menuApiSharingList, data } = this.props
    const dataExample = getDataExample(menuApiSharingList, location)
    const { loadingSearch, dataTable, pagination, measuringList } = this.state
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
                <div style={{ width: '95%' }}>
                  <Text>{this.getUrl()}</Text>
                </div>
                <PermissionPopover
                  roles={[
                    ROLE.SHARE_API.CREATE,
                    ROLE.SHARE_API.EDIT,
                    ROLE.SHARE_API.DELETE,
                  ]}
                >
                  <Icon type="copy" onClick={this.copyUrl} />
                </PermissionPopover>
              </Endpoint>
            </div>
            <Clearfix height={32} />
            <TableParams form={form} />
          </React.Fragment>
        )}

        <Clearfix height={32} />
        <Tabs>
          <Tabs.TabPane tab={i18n().tab.list} key="List">
            <DataTable
              pagination={pagination}
              setPagination={this.setPagination}
              measuringList={measuringList}
              dataSource={dataTable}
              loading={loadingSearch}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={i18n().tab.example} key="Example">
            <Example data={dataExample} />
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    )
  }
}
