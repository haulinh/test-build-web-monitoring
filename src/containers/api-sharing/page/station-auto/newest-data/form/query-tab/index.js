import { Form, Icon, message } from 'antd'
import { dataRoutes } from 'api/ShareApiApi'
import Clearfix from 'components/elements/clearfix'
import Text from 'components/elements/text'
import Example from 'containers/api-sharing/component/Example'
import TableParams from 'containers/api-sharing/component/TableParams'
import { Header } from 'containers/api-sharing/layout/styles'
import {
  generateGetUrl,
  getDataExample,
  isCreate,
} from 'containers/api-sharing/util'
import withShareApiContext from 'containers/api-sharing/withShareApiContext'
import _, { get, isEqual } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import Condition from '../Condition'

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
class QueryTab extends Component {
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
    const fieldsValue = _.get(data, 'config', []).reduce((base, current) => {
      let value = current.value
      if (
        ['measuringList', 'stationKeys'].includes(current.fieldName) &&
        value &&
        value.includes(',')
      ) {
        value = get(current, 'value', '').split(',')
      }
      const fieldValue = {
        [`config.${current.fieldName}`]: value,
      }
      return { ...base, ...fieldValue }
    }, {})

    this.props.form.setFieldsValue(fieldsValue)
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
      .filter(field => field.value && field.fieldName !== 'rangeTime')

    const urlParams = fieldsParams
      .map(field => `${field.fieldName}=${field.value}`)
      .join('&')

    const url = [dataRoutes.getStationAutoNewest(), `id=${params.id}`].join('?')

    const urlQuery = [url, urlParams].join('&')

    return urlQuery
  }

  render() {
    const { form, rule, location, menuApiSharingList } = this.props
    const dataExample = getDataExample(menuApiSharingList, location)
    return (
      <React.Fragment>
        <Condition form={form} rule={rule} />
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
        <Header>Ví dụ</Header>
        <Example data={dataExample} />
      </React.Fragment>
    )
  }
}

export default withShareApiContext(QueryTab)
