import { Form, Icon, message, Tabs } from 'antd'
import { dataRoutes, dataShareApiApi } from 'api/ShareApiApi'
import Clearfix from 'components/elements/clearfix'
import Text from 'components/elements/text'
import Example from 'containers/api-sharing/component/Example'
import TableParams from 'containers/api-sharing/component/TableParams'
import { FIELDS, i18n } from 'containers/api-sharing/constants'
import Search from 'containers/api-sharing/component/Search'
import {
  generateGetUrl,
  getDataExample,
  isCreate,
} from 'containers/api-sharing/util'
import { withShareApiContext } from 'containers/api-sharing/withShareApiContext'
import { isEqual } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import Condition from '../Condition'
import DataTable from './DataTable'

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
    const fieldsValue = data.config.reduce((base, current) => {
      let value = current.value
      if (
        [
          FIELDS.WEATHER.PARAMNETER,
        ].includes(current.fieldName)
      ) {
        value = current.value.split(',')
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

    const fieldsParams = data.config
      .map(field => ({
        fieldName: field.fieldName,
        value: field.value,
      }))
      .filter(field => field.value && field.fieldName !== 'rangeTime')

    const urlParams = fieldsParams
      .map(field => `${field.fieldName}=${field.value}`)
      .join('&')

    const url = [dataRoutes.getWeatherFuture(), `id=${params.id}`].join('?')

    const urlQuery = [url, urlParams].join('&')

    return urlQuery
  }

  handleOnSearch = async () => {
    const queryParams = this.getQueryParams()

    this.setState({ loadingSearch: true })
    try {
      const res = await dataShareApiApi.getWeatherNewest(queryParams)
      if (res) {
        this.setState({ dataTable: res.data })
      }
    } catch (error) {
    }
    this.setState({ loadingSearch: false })
  }

  getQueryParams = () => {
    const { form, data } = this.props
    const { config: fieldsValue } = form.getFieldsValue()

    let parameterList = fieldsValue.parameterList
    if (Array.isArray(parameterList)) parameterList = parameterList.join(',')

    const queryParams = {
      id: data._id,
      ...fieldsValue,
      parameterList,
    }
    return queryParams
  }

  render() {
    const { form, rule, location, menuApiSharingList } = this.props
    const { dataTable, loadingSearch } = this.state
    const dataExample = getDataExample(menuApiSharingList, location)
    const { config: { parameterList = [] } = {} } = form.getFieldsValue()

    return (
      <React.Fragment>
        <Search onSearch={this.handleOnSearch} loading={loadingSearch}>
          <Condition isQuery form={form} rule={rule} />
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
              parameterList={parameterList}
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
