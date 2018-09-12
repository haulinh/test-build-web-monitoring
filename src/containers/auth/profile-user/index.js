import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { Row, Col } from 'reactstrap'
import swal from 'sweetalert2'
import { InputLabel, createValidateComponent } from 'components/elements'
import Button from 'components/elements/button'
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
import { Icon } from 'antd'
import UserApi from 'api/UserApi'
import StationAutoApi from 'api/StationAuto'
import OrganizationApi from 'api/OrganizationApi'

const FInput = createValidateComponent(InputLabel)
const FCalendar = createValidateComponent(CalendarCustom)
const FInputPhoneNumber = createValidateComponent(InputPhoneNumber)
const FUpdateLoadImage = createValidateComponent(UpdateLoadImage)
// const FUpdateLogo = createValidateComponent(UpdateLogo)

const Clearfix = styled.div`
  height: 24px;
`

const HeadingIntro = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
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
    }
  }

  componentWillMount(){
    if (this.props.initialValues) {
      const { organization, avatar } = this.props.initialValues
      if (organization && organization.packageInfo){
        this.setState({
          name: organization.name,
          image: {
            url: avatar
          },
          totalUser: organization.packageInfo.totalUser,
          totalStation: organization.packageInfo.totalStation
        })
      }else{
        this.setState({
          name:  organization.name,
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

  renderItem(icon, label, value) {
    return (
      <div className='row'>
        <Label>
          {icon} {label}
        </Label>
        <ValueText>{value}</ValueText>
      </div>
    )
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.props.onSubmit.bind(this))}>
        <Row>
          <Col md={6}>
            <Field
              label={translate('profileUser.avatar')}
              name="avatar"
              component={FUpdateLoadImage}
              size="small"
            />
          </Col>

          <Col md={6}>
            <Row>
              <Field
                label={'Thuộc tổ chức'}
                name="avatar"
                organization={this.props.initialValues.organization}
                component={UpdateLogo}
                size="small"/>
                <Col>
                <HeadingIntro>{this.state.name}</HeadingIntro>
                <Col>
                  {this.renderItem(
                    <Icon type="user" />,
                    translate('subscriptionStatus.totalUsers'),
                    `: ${this.state.createdUser} of ${this.state.totalUser}`
                  )}
                </Col>
                <Col>
                  {this.renderItem(
                    <Icon type="inbox" />,
                    translate('subscriptionStatus.totalStation'),
                    `: ${this.state.createdStation} of ${this.state.totalStation}`
                  )}
                </Col>
                </Col>
            </Row>
          </Col>
        </Row>
        <Clearfix />
        <Row>
          <Col md={12}>
            <Field
              disabled={true}
              label={translate('profileUser.email')}
              name="email"
              component={FInput}
              size="small"
            />
          </Col>
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
        <Clearfix />
        <Button
          disabled={this.props.submitting}
          isLoading={this.props.submitting}
          controtertype="submit"
          block
          color="primary"
        >
          {translate('addon.save')}
        </Button>
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
    console.log('onSubmit',values)
    const _id = values._id
    const data = {
      ...values
    }
    const result = await AuthApi.putProfile(_id, data)
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
