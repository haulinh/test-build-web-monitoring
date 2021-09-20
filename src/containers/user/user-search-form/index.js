import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { Row, Col, Form as FormStyle, Input, Button, Icon, Modal } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'
import ROLE from 'constants/role'
import { EMAIL, PHONE } from 'constants/info-contact'
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

// import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'
// import { getOrganizations } from 'api/OrganizationApi'

require('./index.css')

// const FormItem = FormStyle.Item

function i18n() {
  return {
    create: translate('addon.create'),
    roleAssign: translate('userManager.list.roleAssign'),
    okText: translate('addon.ok'),
    title: translate('userManager.modal.title'),
    callAction: translate('userManager.modal.callAction'),
  }
}

const Form = styled(FormStyle)`
  display: flex;
  align-items: flex-end;
  .ant-form-item-control {
    line-height: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
    max-width: 140px;
  }
`

@FormStyle.create({
  mapPropsToFields: mapPropsToFields,
})
@connect(state => ({
  limitTotalUser: _.get(
    state,
    'auth.userInfo.organization.packageInfo.totalUser',
    0
  ),
  organizationType: _.get(
    state,
    'auth.userInfo.organization.packageInfo.organizationType',
    0
  ),
  salerPhoneNumber: _.get(
    state,
    'auth.userInfo.organization.packageInfo.saler.phone.phoneNumber',
    PHONE
  ),
  salerEmail: _.get(
    state,
    'auth.userInfo.organization.packageInfo.saler.email',
    EMAIL
  ),
}))
@createLanguage
@withRouter
@autobind
export default class UserSearchForm extends React.PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes,
    totalUser: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSearch: {},
      phone: {},
    }
  }

  async componentWillMount() {}

  changeSearch(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const dataSearch = {}
      if (values.email) dataSearch.email = values.email
      if (values.firstName) dataSearch.firstName = values.firstName
      if (values.lastName) dataSearch.lastName = values.lastName
      if (this.state.phone) {
        dataSearch.country = this.state.phone
        dataSearch.phone =
          this.state.phone.phoneNumber !== '+'
            ? this.state.phone.phoneNumber
            : ''
      }

      // console.log(dataSearch, 'dataSearch')
      // Callback submit form Container Component
      this.setState({ dataSearch: dataSearch }, () =>
        this.props.onChangeSearch(dataSearch)
      )
    })
  }

  handleInputChange(telNumber, selectedCountry) {
    this.setState({
      phone: {
        phoneNumber: telNumber,
        ...selectedCountry,
      },
    })
  }

  handleAddUser = () => {
    if (this.props.limitTotalUser <= this.props.totalUser) {
      Modal.warning({
        icon: null,
        width: '50%',
        title: <Title>{i18n().title}</Title>,
        okText: i18n().okText,
        content: (
          <Container>
            <Desc
              dangerouslySetInnerHTML={{
                __html: translate('userManager.modal.text', {
                  total: this.props.totalUser,
                }),
              }}
            />
            <ContentWrapper>
              <Heading>{i18n().callAction}</Heading>
              <Wrapper>
                <Flex>
                  <Label>{translate('contact.phone')}</Label>
                  <Content>{this.props.salerPhoneNumber}</Content>
                </Flex>
                <Flex>
                  <Label>{translate('contact.email')}</Label>
                  <Content>{this.props.salerEmail}</Content>
                </Flex>
              </Wrapper>
            </ContentWrapper>
          </Container>
        ),
        onCancel() {},
      })
    } else {
      this.props.history.push(slug.user.create)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      lang: { t },
    } = this.props

    return (
      <Row gutter={16}>
        <Col span={15}>
          <Form className="fadeIn animated" onSubmit={this.changeSearch}>
            <Row gutter={4} style={{ width: '100%' }}>
              <Col span={8}>
                {getFieldDecorator(`email`)(
                  <Input
                    placeholder={t('userManager.form.email.placeholder')}
                  />
                )}
              </Col>
              <Col span={8}>
                {getFieldDecorator(`firstName`)(
                  <Input
                    placeholder={t('userManager.form.firstName.placeholder')}
                  />
                )}
              </Col>
              <Col span={7}>
                {getFieldDecorator(`lastName`)(
                  <Input
                    placeholder={t('userManager.form.lastName.placeholder')}
                  />
                )}
              </Col>
              <Col span={1}>
                <Button shape="circle" htmlType="submit">
                  <Icon type="search" />
                </Button>
              </Col>

              {/* tạm thời bỏ số dt đi
              <Clearfix />
              <FormItem {...formItemLayout}>
                {getFieldDecorator(`phone`, {
                  initialValue: this.props.initialValues.type,
                  rules: [
                    {
                      //required: true,
                      message: t('userManager.form.phone.label')
                    }
                  ]
                })(
                  <ReactTelephoneInput
                    defaultCountry="vn"
                    flagsImagePath="./images/flags.png"
                    onChange={this.handleInputChange}
                    // onBlur={this.handleInputBlur}
                  />
                )}
              </FormItem>
                */}
            </Row>
          </Form>
        </Col>
        <Col span={9} style={{ textAlign: 'right' }}>
          {protectRole(ROLE.USER.ROLE)(
            <Link to={slug.user.rule}>
              <Button type="primary">
                <Icon type="usergroup-add" /> {i18n().roleAssign}
              </Button>
            </Link>
          )}

          {protectRole(ROLE.USER.CREATE)(
            // <Link to={slug.user.create} style={{ marginLeft: 16 }}>
            <Button
              onClick={this.handleAddUser}
              type="primary"
              style={{ marginLeft: 16 }}
            >
              <Icon type="plus" /> {i18n().create}
            </Button>
            // </Link>
          )}
        </Col>
      </Row>
    )
  }
}
