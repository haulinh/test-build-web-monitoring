import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import createManagerList from 'hoc/manager-list'
import { message, Modal, Skeleton } from 'antd'
import { autobind } from 'core-decorators'
import StationAutoApi from 'api/StationAuto'
import slug from 'constants/slug'
import StationAutoForm from '../station-auto-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { EMAIL, PHONE } from 'constants/info-contact.js'
import { translate } from 'hoc/create-lang'
import {
  Container,
  ContentWrapper,
  Desc,
  Heading,
  Title,
  Wrapper,
  Flex,
  Content,
  Label,
} from './style'

const i18n = {
  okText: translate('addon.ok'),
  addButton: translate('stationAutoManager.create.label'),
  stationType: translate('stationAutoManager.form.stationType.placeholder'),
  stationName: translate('stationAutoManager.form.name.placeholder'),
  title: translate('stationAutoManager.limit.station.title'),
  callAction: translate('stationAutoManager.limit.station.callAction'),
}

@protectRole(ROLE.STATION_AUTO.CREATE)
@createManagerList({
  apiList: StationAutoApi.getStationAutos,
})
@connect(state => ({
  limitTotalStation: _.get(
    state,
    'auth.userInfo.organization.packageInfo.totalStation',
    0
  ),
  totalStationActived: _.get(state, 'stationAuto.totalStationActived', 0),
}))
@autobind
export default class StationAutoCreate extends React.PureComponent {
  state = {
    isRequiredLicense: false,
  }

  async handleSubmit(data) {
    const res = await StationAutoApi.createStationAuto(data)
    if (res.success) {
      message.info('Add measuring success!')
      this.props.history.push(slug.stationAuto.list)
    }
  }

  componentDidMount() {
    this.checkLicenseStation()
  }

  componentDidUpdate = prevProps => {
    if (
      this.props.totalStationActived !== prevProps.totalStationActived ||
      this.props.isLoading !== prevProps.isLoading
    ) {
      this.checkLicenseStation()
    }
  }

  checkLicenseStation = () => {
    const { limitTotalStation, totalStationActived } = this.props
    if (
      totalStationActived >= limitTotalStation &&
      !this.state.isRequiredLicense
    ) {
      Modal.warning({
        icon: null,
        width: '50%',
        title: <Title>{i18n.title}</Title>,
        okText: i18n.okText,
        content: (
          <Container>
            <Desc>
              {translate('stationAutoManager.limit.station.content', {
                totalStation: limitTotalStation,
              })}
            </Desc>
            <ContentWrapper>
              <Heading>{i18n.callAction}</Heading>
              <Wrapper>
                <Flex>
                  <Label>{translate('contact.phone')}</Label>
                  <Content>{PHONE}</Content>
                </Flex>
                <Flex>
                  <Label>{translate('contact.email')}</Label>
                  <Content>{EMAIL}</Content>
                </Flex>
              </Wrapper>
            </ContentWrapper>
          </Container>
        ),
        onCancel() {},
        onOk: this.handleClose,
      })
      this.setState({
        isRequiredLicense: true,
      })
    }
  }

  handleClose = () => {
    this.props.history.push(slug.stationAuto.list)
  }

  render() {
    if (this.props.isLoading) return <Skeleton />
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        {!this.state.isRequiredLicense && (
          <StationAutoForm onSubmit={this.handleSubmit} />
        )}
        {this.state.isRequiredLicense && <Skeleton />}
      </PageContainer>
    )
  }
}
