import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { Row, Col } from 'reactstrap'
import swal from 'sweetalert2'
import { InputLabel, createValidateComponent } from 'components/elements'
import ButtonCustom from 'components/elements/button'
import CalendarCustom from 'components/elements/datetime-picker'
import InputPhoneNumber from 'components/elements/input-phone-number'
import UpdateLoadImage from 'components/elements/upload-image-avatar'
import UpdateLogo from 'components/elements/upload-logo'
import AuthApi from 'api/AuthApi'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import Breadcrumb from 'containers/auth/breadcrumb'
import { fetchUserMe } from 'redux/actions/authAction'
import { connectAutoDispatch } from 'redux/connect'
import moment from 'moment'
import { SHAPE } from 'themes/color'
import { Icon, Button, Card } from 'antd'
import UserApi from 'api/UserApi'
import StationAutoApi from 'api/StationAuto'
import OrganizationApi from 'api/OrganizationApi'
import * as _ from 'lodash'

const FInput = createValidateComponent(InputLabel)
const FCalendar = createValidateComponent(CalendarCustom)
const FInputPhoneNumber = createValidateComponent(InputPhoneNumber)
const FUpdateLoadImage = createValidateComponent(UpdateLoadImage)
// const FUpdateLogo = createValidateComponent(UpdateLogo)

const Clearfix = styled.div`
  height: 24px;
`

const ContainerEmail = styled.div`
  margin-left: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const HeadingIntro = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
  margin-right: 16px;
  margin-top: 16px;
  color: ${SHAPE.PRIMARY};
`

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: #000;
`
const ValueText = styled.span`
  color: #45526b;
`

function validate(values) {
  const errors = {}

  return errors
}

@reduxForm({
  form: 'ProfileUser',
  validate
})
@autobind
export class ProfileUserForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      image: {},
      name: '',
      totalUser: 0,
      totalStation: 0,
      createdUser: 0,
      createdStation: 0,
      isEdit: false
    }
  }

  componentWillMount() {
    if (this.props.initialValues) {
      const { organization, avatar } = this.props.initialValues
      if (organization && organization.packageInfo) {
        this.setState({
          name: organization.name,
          image: {
            url: avatar
          },
          totalUser: organization.packageInfo.totalUser,
          totalStation: organization.packageInfo.totalStation
        })
      } else {
        this.setState({
          name: organization.name,
          image: {
            url: avatar
          }
        })
      }
    }

    this.getUserCount()
    this.getStationCount()
  }

  async getStationCount() {
    const record = await StationAutoApi.getTotalCount()
    if (record.success) {
      this.setState({
        createdStation: record.data
      })
    }
  }

  async getUserCount() {
    const record = await UserApi.getTotalCount()
    if (record.success) {
      this.setState({
        createdUser: record.data
      })
    }
  }

  editNameOrganization() {
    this.setState({
      isEdit: true
    })
  }

  saveNameOrganization() {
    console.log(this.refs.nameOrganization)
  }

  renderItem(icon, label, value) {
    return (
      <div className="row">
        <Label>
          {icon} {label}
        </Label>
        <ValueText>{value}</ValueText>
      </div>
    )
  }

  renderEmail(email) {
    return (
      <ContainerEmail>
        <ValueText>{translate('profileUser.email')}</ValueText>
        <Label style={{ fontSize: 16, marginTop: 4 }}>{email}</Label>
      </ContainerEmail>
    )
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit.bind(this))}>
        <Card
          title={translate('profileUser.organization')}
          bordered
          style={{ flex: 1, marginRight: 12 }}
        >
          <Row>
            <Field
              name="avatar"
              organization={this.props.initialValues.organization}
              isAdmin={this.props.initialValues.isAdmin}
              component={UpdateLogo}
              size="small"
            />
            <Col>
              {this.props.initialValues.isAdmin && this.state.isEdit ? (
                <Field
                  name="organization.name"
                  style={{ marginBottom: 12 }}
                  component={FInput}
                  size="small"
                />
              ) : (
                <Row>
                  <HeadingIntro>{this.state.name}</HeadingIntro>
                  {this.props.initialValues.isAdmin && (
                    <Button
                      shape="circle"
                      icon="edit"
                      onClick={this.editNameOrganization}
                    />
                  )}
                </Row>
              )}
              <Col>
                {this.renderItem(
                  <Icon type="user" />,
                  translate('subscriptionStatus.totalUsers'),
                  `: ${this.state.createdUser}`
                )}
              </Col>
              <Col>
                {this.renderItem(
                  <Icon type="inbox" />,
                  translate('subscriptionStatus.totalStation'),
                  `: ${this.state.createdStation}`
                )}
              </Col>
            </Col>
          </Row>
        </Card>
        <Card
          title={translate('profileUser.user')}
          bordered
          style={{ flex: 1, marginRight: 12, marginBottom: 24, marginTop: 24 }}
        >
          <Row>
            <Field name="avatar" component={FUpdateLoadImage} size="small" />
            {this.renderEmail(_.get(this.props, 'initialValues.email', ''))}
          </Row>
          <Clearfix />
          <Row>
            <Col md={6}>
              <Field
                label={translate('profileUser.LastName')}
                name="lastName"
                component={FInput}
                size="small"
              />
            </Col>
            <Col md={6}>
              <Field
                label={translate('profileUser.FirstName')}
                name="firstName"
                component={FInput}
                size="small"
              />
            </Col>
          </Row>
          <Clearfix />
          <Row>
            <Col md={6}>
              <Field
                label={translate('profileUser.Birthday')}
                name="birthday"
                component={FCalendar}
                size="large"
              />
            </Col>
            <Col md={6}>
              <Field
                label={translate('profileUser.Phone')}
                name="phone"
                component={FInputPhoneNumber}
                size="large"
              />
            </Col>
          </Row>
        </Card>

        <ButtonCustom
          disabled={this.props.submitting}
          isLoading={this.props.submitting}
          controtertype="submit"
          block
          color="primary"
        >
          {translate('addon.save')}
        </ButtonCustom>
      </form>
    )
  }
}

@connectAutoDispatch(state => ({}), { fetchUserMe })
@autobind
export default class ProfileUser extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      isLoaded: false
    }
  }

  async componentWillMount() {
    const record = await AuthApi.getMe()
    this.setState({
      userInfo: {
        ...record.data,
        birthday: moment(record.data.birthday)
      },
      isLoaded: true
    })
  }

  async onSubmit(values) {
    const _id = values._id
    const data = {
      ...values
    }
    await AuthApi.putProfile(_id, data)
    const result = await OrganizationApi.updateOrganizationNameLogo(
      values.organization
    )
    this.props.fetchUserMe()
    if (result.error) {
      swal({
        type: 'error',
        title: result.message
      })
    } else {
      swal({
        type: 'success',
        title: translate('profileUser.success')
      })
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['profileUser']} />
        {this.state.isLoaded && (
          <ProfileUserForm
            onSubmit={this.onSubmit}
            initialValues={this.state.userInfo}
          />
        )}
      </PageContainer>
    )
  }
}
