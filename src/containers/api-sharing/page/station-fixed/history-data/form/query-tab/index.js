import { Form, Icon, message } from 'antd'
import { dataRoutes } from 'api/ShareApiApi'
import Text from 'components/elements/text'
import { FIELDS } from 'containers/api-sharing/constants'
import { generateGetUrl, isCreate } from 'containers/api-sharing/util'
import _, { isEqual } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { copyTextToClipboard } from 'utils/'
import { getTimes } from 'utils/datetime'
import Condition from '../Condition'
import Clearfix from 'components/elements/clearfix'
import TableParams from 'containers/api-sharing/component/TableParams'

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

    const times = getTimes(_.get(fieldsValue, 'rangeTime', 1))
    const from = times.from
      .clone()
      .utc()
      .format()
    const to = times.to
      .clone()
      .utc()
      .format()

    const urlParamsValid = [
      'measuringList',
      'stationKeys',
      'phaseIds',
      'isExceeded',
    ]
      .filter(item => queryParams[item])
      .map(item => `${item}=${queryParams[item]}`)
      .join('&')

    const url = [dataRoutes.getPeriodicHistory(), `id=${params.id}`].join('?')

    const urlParam = [urlParamsValid, `from=${from}`, `to=${to}`].join('&')

    const urlQuery = [url, urlParam].join('&')

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
            {!isCreate(rule) && <Icon type="copy" onClick={this.copyUrl} />}
          </Endpoint>
        </div>
        <Clearfix height={32} />
        <TableParams form={form} />
      </React.Fragment>
    )
  }
}
