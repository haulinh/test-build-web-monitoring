import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import Breadcrumb from 'containers/auth/breadcrumb'
import moment from 'moment-timezone'
import { SHAPE } from 'themes/color'
import { Row, Col, Typography, Skeleton } from 'antd'
import * as _ from 'lodash'
import Clearfix from 'components/elements/clearfix'
import { connect } from 'react-redux'
import { DD_MM_YYYY } from 'constants/format-date'
import UserApi from 'api/UserApi'

const { Title, Text } = Typography

const InfoLicenseWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  .info--package__col {
    .info--package__col__title {
    }
    .info--package__col__content {
      padding-left: 8px;
      line-height: 2rem;
      .info--package__col__content--padding {
        float: left;
        width: 200px;
      }
    }
  }
`

const i18n = {
  title1: translate('infoLicense.title1'),
  title2: translate('infoLicense.title2'),
  title3: translate('infoLicense.title3'),
  text1: translate('infoLicense.text1'),
  text2: translate('infoLicense.text2'),
  text4: translate('infoLicense.text4'),
  text5: translate('infoLicense.text5'),
  text6: translate('infoLicense.text6'),
  text7: translate('infoLicense.text7'),
  dateUnlimited: translate('infoLicense.dateUnlimited'),
}

@connect(state => ({
  organization: _.get(state, 'auth.userInfo.organization', {}),
  totalStationActived: _.get(state, 'stationAuto.totalStationActived', 0),
}))
@autobind
export class InfoLicenseForm extends PureComponent {
  static propTypes = {
    organization: PropTypes.object,
  }

  state = {
    isLoading: true,
    currentUser: {},
  }

  componentWillMount() {
    try {
    } finally {
      this.setState({
        isLoading: false,
      })
    }
  }

  async componentDidMount() {
    const currentUser = await UserApi.getTotalCount()
    this.setState({
      currentUser,
    })
  }

  render() {
    const { organization, totalStationActived } = this.props
    const { currentUser } = this.state

    let dateCreate,
      dateExp,
      totalDays,
      limitTotalStation,
      totalUser,
      phone,
      email,
      deploymenType

    if (organization) {
      const createdAt = _.get(organization, 'createdAt')
        ? moment(_.get(organization, 'createdAt'))
        : ''
      const expirationDate = _.get(
        organization,
        'packageInfo.contractExpiredDate'
      )
        ? moment(_.get(organization, 'packageInfo.contractExpiredDate'))
        : ''

      if (expirationDate) {
        totalDays = moment(expirationDate).diff(moment(), 'days')
        dateExp = expirationDate.format(DD_MM_YYYY)
      }
      dateCreate = createdAt.format(DD_MM_YYYY)

      phone = _.get(organization, [
        'packageInfo',
        'saler',
        'phone',
        'phoneNumber',
      ])
      email = _.get(organization, ['packageInfo', 'saler', 'email'])

      limitTotalStation = _.get(organization, ['packageInfo', 'totalStation'])
      totalUser = _.get(organization, ['packageInfo', 'totalUser'])
      deploymenType = _.get(organization, ['packageInfo', 'organizationType'])
    }

    const isOnPremises = deploymenType === 'ON_PREMISES' ? true : false

    return (
      <InfoLicenseWrapper>
        {this.state.isLoading && <Skeleton avatar paragraph={{ rows: 4 }} />}
        {!this.state.isLoading && (
          <div>
            <Row gutter={8}>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}>{i18n.title1}</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text1}
                    </Text>
                    <Text disabled>{dateCreate}</Text>
                    <br />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text2}
                    </Text>
                    <Text disabled>
                      {isOnPremises ? i18n.dateUnlimited : dateExp}
                    </Text>
                    <br />
                    {!isOnPremises && totalDays > 0 && (
                      <Text
                        type="warning"
                        style={{
                          color: SHAPE.PRIMARY,
                        }}
                      >
                        {translate('infoLicense.text3', { total: totalDays })}
                      </Text>
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}> {i18n.title2}</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text4}
                    </Text>
                    <Text
                      disabled
                    >{`${totalStationActived}/${limitTotalStation}`}</Text>
                    <Clearfix height={8} />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text5}
                    </Text>
                    <Text disabled>{`${currentUser.data}/${totalUser}`}</Text>
                    <Clearfix height={8} />
                  </div>
                </div>
              </Col>
            </Row>
            <Clearfix height={16} />
            <Row gutter={8}>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}>{i18n.title3}</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text6}
                    </Text>
                    <Text
                      style={{
                        color: SHAPE.PRIMARY,
                      }}
                    >
                      {phone}
                    </Text>
                    <Clearfix height={8} />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      {i18n.text7}
                    </Text>
                    <Text
                      style={{
                        color: SHAPE.PRIMARY,
                      }}
                    >
                      {email}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </InfoLicenseWrapper>
    )
  }
}

@autobind
export default class ProfileUser extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      isLoaded: false,
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['infoLicense']} />
        <InfoLicenseForm />
      </PageContainer>
    )
  }
}
