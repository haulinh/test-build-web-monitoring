import { Form, Icon, message } from 'antd'
import { dataRoutes } from 'api/ShareApiApi'
import Clearfix from 'components/elements/clearfix'
import Text from 'components/elements/text'
import { generateGetUrl, isCreate } from 'containers/api-sharing/util'
import _, { get, isEqual } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import { getTimes } from 'utils/datetime'
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
export default class QueryTab extends Component {
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
        ['measuringList', 'stationKeys'].includes(current.fieldName) &&
        (value || '').includes(',')
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
      form,
    } = this.props

    const { config: fieldsValue } = form.getFieldsValue()

    let measuringList = _.get(fieldsValue, 'measuringList', '')
    if (Array.isArray(measuringList)) measuringList = measuringList.join(',')

    let stationKeys = _.get(fieldsValue, 'stationKeys', '')
    if (Array.isArray(stationKeys)) stationKeys = stationKeys.join(',')

    const queryParams = {
      ...fieldsValue,
      measuringList,
      stationKeys,
    }

    const urlParamsValid = [
      'province',
      'stationType',
      'measuringList',
      'stationKeys',
      'isExceeded',
      'dataType',
    ]
      .filter(item => queryParams[item])
      .map(item => `${item}=${queryParams[item]}`)
      .join('&')

    const url = [dataRoutes.getStationAutoHistory(), `id=${params.id}`].join(
      '?'
    )

    const urlQuery = [url, urlParamsValid].join('&')

    return urlQuery
  }

  render() {
    const { form, rule } = this.props
    return (
      <React.Fragment>
        <Condition form={form} rule={rule} />
        <Clearfix height={32} />
        <div className="content">
          <Method>GET</Method>
          <Endpoint>
            <Text>{this.getUrl()}</Text>
            <Icon type="copy" onClick={this.copyUrl} />
          </Endpoint>
        </div>
      </React.Fragment>
    )
  }
}