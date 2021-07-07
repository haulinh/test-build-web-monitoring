import React, { Component } from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import { Col, Icon, message, Row } from 'antd'

import slug from 'constants/slug'
import Text from 'components/elements/text'
import { translate as t } from 'hoc/create-lang'

import APIList from './api-list'
import { PublicApis } from './constants'
import ParameterList from './parameter-list'
import { generateGetUrl } from './helper'
import { copyTextToClipboard } from 'utils'

const Wrapper = styled.div`
  .api-detail {
    .header {
      padding: 20px;
      border-bottom: 1px solid #f2f2f2;
    }
    .content {
      padding: 20px;
    }
  }
`

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

const ResponseFormat = styled.pre`
  background: #292b36;
  padding: 10px 20px;
  color: #fff;
  border-radius: 8px;
`

const i18n = {
  parameter: t('global.parameter'),
  example: t('global.example'),
  copySuccess: t('global.copySuccess'),
}

const DEFAULT_HASH = '#StationManagement/stations'
class APISharing extends Component {
  state = { apiDetail: {} }

  componentDidMount() {
    const {
      history,
      location: { hash },
    } = this.props
    this.getAPIDetail(hash)
    if (!hash) {
      history.push(DEFAULT_HASH)
    }
  }

  getAPIDetail = hash => {
    const pathKeys = hash.replace('#', '').split('/')
    pathKeys.splice(1, 0, 'endpoints')
    const apiDetail = get(PublicApis, pathKeys.join('.'))
    this.setState({
      apiDetail: apiDetail || PublicApis.StationManagement.endpoints.stations,
    })
  }

  onChange = e => {
    const { keyPath } = e
    const { history } = this.props
    const hash = `#${keyPath.reverse().join('/')}`
    this.getAPIDetail(hash)
    history.replace(`${slug.apiSharing.base}${hash}`)
  }

  copyUrl = () => {
    const { apiDetail } = this.state
    const url = generateGetUrl(apiDetail)
    const success = copyTextToClipboard(url)
    if (success) message.success(i18n.copySuccess)
  }

  render() {
    const { apiDetail } = this.state
    const {
      location: { hash },
    } = this.props
    const pathKeys = (hash || DEFAULT_HASH).replace('#', '').split('/')
    return (
      <Wrapper>
        <Row type="flex">
          <Col span={6}>
            <APIList
              onClickMenu={this.onChange}
              defaultOpenKeys={pathKeys}
              defaultSelectedKeys={pathKeys[pathKeys.length - 1]}
            />
          </Col>
          <Col span={18} className="api-detail">
            <div className="header">
              <Text fontSize={22} fontWeight={600} color="#3b3b3b">
                {apiDetail.name}
              </Text>
            </div>
            <div className="content">
              <Method>{apiDetail.method}</Method>
              <Endpoint>
                <Text>{apiDetail.endpoint}</Text>
                <Icon type="copy" onClick={this.copyUrl} />
              </Endpoint>
              <Text
                fontSize={20}
                fontWeight={700}
                margin="10px 0"
                color="rgba(0, 0, 0, 0.85)"
              >
                {i18n.parameter}
              </Text>
              <ParameterList parameters={apiDetail.parameters || []} />
              <Text
                fontSize={20}
                fontWeight={700}
                margin="10px 0"
                color="rgba(0, 0, 0, 0.85)"
              >
                {i18n.example}
              </Text>
              <ResponseFormat>
                {JSON.stringify(apiDetail.responseFormat, null, 4)}
              </ResponseFormat>
            </div>
          </Col>
        </Row>
      </Wrapper>
    )
  }
}

export default APISharing
