import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Result, Typography } from 'antd'
import { SHAPE } from 'themes/color'
import { EMAIL, PHONE } from 'constants/info-contact.js'
import { translate } from 'hoc/create-lang'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date.js'
import queryString from 'query-string'

const { Title, Text } = Typography

const PageExpLicenseInfoWrapper = styled.div`
  .ant-result-extra {
    display: flex;
    justify-content: center;
    .content {
      width: fit-content;
      text-align: left;
      line-height: 2rem;
      .content--text__padding {
        float: left;
        width: 200px;
      }
    }
  }
`
const i18n = {
  title: translate('expLicenseInfo.title'),
  subtitle2: translate('expLicenseInfo.subtitle2'),
  text1: translate('expLicenseInfo.text1'),
  text2: translate('expLicenseInfo.text2'),
  text3: translate('expLicenseInfo.text3'),
}

@connect(state => ({
  expirationDate: _.get(
    state,
    'auth.userInfo.organization.license.expirationDate',
    null
  ),
}))
export default class PageExpLicenseInfo extends PureComponent {
  render() {
    const parsedQuery = queryString.parse(this.props.location.search)

    let limitDate = ''
    if (!_.isEmpty(parsedQuery)) {
      limitDate = moment(parsedQuery.expDate).format(DD_MM_YYYY)
    }
    console.log(parsedQuery, limitDate, 'this.props.match.params')
    return (
      <PageExpLicenseInfoWrapper>
        <Result
          //   status="404"
          icon={<img src="/images/license/subscription-expired.png" alt="" />}
          title={<Title level={3}>{i18n.title}</Title>}
          subTitle={
            <div>
              {translate('expLicenseInfo.subtitle1', {
                totalDate: limitDate,
              })}
              <br /> {i18n.subtitle2}
            </div>
          }
          extra={
            <div className="content">
              <Text
                type="warning"
                style={{
                  color: SHAPE.PRIMARY,
                  fontWeight: 'bold',
                }}
              >
                {i18n.text2}
              </Text>
              <br />
              <Text className="content--text__padding" strong>
                {i18n.text1}
              </Text>
              <Text
                style={{
                  color: SHAPE.PRIMARY,
                }}
              >
                {PHONE}
              </Text>
              <br />
              <Text className="content--text__padding" strong>
                {i18n.text3}
              </Text>
              <Text
                style={{
                  color: SHAPE.PRIMARY,
                }}
              >
                {EMAIL}
              </Text>
            </div>
          }
        />
      </PageExpLicenseInfoWrapper>
    )
  }
}
