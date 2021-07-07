import { Form, Icon, message } from 'antd'
import { dataRoutes, shareApiApi } from 'api/ShareApiApi'
import Text from 'components/elements/text'
import { FIELDS } from 'containers/api-sharing/constants'
import { generateGetUrl, isCreate } from 'containers/api-sharing/util'
import _ from 'lodash'
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
export default class QueryTab extends Component {
  state = {
    data: {},
  }
  async componentDidMount() {
    const {
      match: { params },
      rule,
    } = this.props
    if (isCreate(rule)) return

    try {
      const res = await shareApiApi.getApiDetailById(params.id)
      if (res.success) {
        this.setState({ data: res.data }, () => {
          this.setInitFields()
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  setInitFields = () => {
    const { data } = this.state
    const fieldsValue = data.config.reduce((base, current) => {
      let value = current.value
      if (
        [
          FIELDS.STATION_FIXED.HISTORY_DATA.MEASURING_LIST,
          FIELDS.STATION_FIXED.HISTORY_DATA.POINT,
          'phaseIds',
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
    console.log(curl)

    const success = copyTextToClipboard(curl)
    if (success) message.success('Success')
  }

  getUrl = () => {
    const {
      match: { params },
      form,
    } = this.props

    const { config: fieldsValue } = form.getFieldsValue()

    const queryParams = {
      ...fieldsValue,
      measuringList: _.get(fieldsValue, 'measuringList', []).join(','),
      stationKeys: _.get(fieldsValue, 'stationKeys', []).join(','),
      phaseIds: _.get(fieldsValue, 'phaseIds', []).join(','),
    }

    const urlParamsValid = [
      'measuringList',
      'stationKeys',
      'phaseIds',
      'isExceeded',
    ]
      .filter(item => queryParams[item])
      .map(item => `${item}=${queryParams[item]}`)
      .join('&')

    const url = [dataRoutes.getPeriodicNewest(), `id=${params.id}`].join('?')

    const urlQuery = [url, urlParamsValid].join('&')

    return urlQuery
  }

  render() {
    const { form, rule } = this.props
    return (
      <React.Fragment>
        <Condition form={form} rule={rule} />
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
