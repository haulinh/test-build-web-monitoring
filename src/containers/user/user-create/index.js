import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message, Modal, Skeleton } from 'antd'
import { autobind } from 'core-decorators'
import UserApi from 'api/UserApi'
import slug from 'constants/slug'
import UserForm from '../user-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'
import { EMAIL, PHONE } from 'constants/info-contact.js'
import Clearfix from 'components/elements/clearfix'
import {
  Container,
  ContentWrapper,
  Desc,
  Heading,
  Title,
  Wrapper,
  Flex,
  Label,
  Content,
} from './style'

const i18n = {
  title: translate('userManager.modal.title'),
  callAction: translate('userManager.modal.callAction'),
  back: translate('userManager.modal.back'),
}

@protectRole(ROLE.USER.CREATE)
@connect(state => ({
  limitTotalUser: _.get(
    state,
    'auth.userInfo.organization.packageInfo.totalUser',
    0
  ),
}))
@autobind
export default class UserCreate extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isLicense: false,
    }
  }

  handleSubmit = async data => {
    this.setState({
      isLoading: true,
      totalUserActive: 0,
      isLicense: false,
    })
    const res = await UserApi.registerUser(data)
    this.setState({ isLoading: false }, () => {
      if (res.success) {
        message.success('Register User success!')
        this.props.history.push(slug.user.list)
      }
    })
    return res
  }

  componentDidMount = async () => {
    const res = await UserApi.getTotalCount()
    if (res.success) {
      this.setState(
        {
          totalUserActive: _.get(res, 'data', 0),
        },
        () => {
          this.checkLicenseStation()
        }
      )
    }
  }

  checkLicenseStation = () => {
    const { limitTotalUser } = this.props
    const { totalUserActive } = this.state
    if (totalUserActive >= limitTotalUser) {
      Modal.warning({
        icon: null,
        width: '50%',
        title: <Title>{i18n.title}</Title>,
        okText: i18n.okText,
        content: (
          <Container>
            <Desc
              dangerouslySetInnerHTML={{
                __html: translate('userManager.modal.text', {
                  total: totalUserActive,
                }),
              }}
            />
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
        isLicense: true,
      })
    }
    this.setState({ isLoading: false })
  }

  handleClose = () => {
    this.props.history.push(slug.user.list)
  }

  render() {
    return (
      <PageContainer title="Create station type" {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        {this.state.isLoading ? (
          <Skeleton />
        ) : !this.state.isLicense ? (
          <UserForm
            onSubmit={this.handleSubmit}
            isLoading={this.state.isLoading}
          />
        ) : (
          <Skeleton />
        )}
      </PageContainer>
    )
  }
}
