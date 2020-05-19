import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form as FormStyle, Input, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'
import ROLE from 'constants/role'

// import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'
import styled from 'styled-components'
// import { getOrganizations } from 'api/OrganizationApi'

require('./index.css')

// const FormItem = FormStyle.Item

const i18n = {
  create: translate('addon.create'),
  roleAssign: translate('userManager.list.roleAssign')
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
  mapPropsToFields: mapPropsToFields
})
@createLanguage
@autobind
export default class UserSearchForm extends React.PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSearch: {},
      phone: {}
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

      console.log(dataSearch, 'dataSearch')
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
        ...selectedCountry
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      lang: { t }
    } = this.props

    return (
      <Row gutter={16}>
        <Col span={18}>
          <Form className="fadeIn animated" onSubmit={this.changeSearch}>
            <Row gutter={16} style={{ width: '100%' }}>
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
        <Col span={6} style={{ textAlign: 'right' }}>
          {protectRole(ROLE.USER.ROLE)(
            <Link to={slug.user.rule}>
              <Button type="primary">
                <Icon type="usergroup-add" /> {i18n.roleAssign}
              </Button>
            </Link>
          )}

          {protectRole(ROLE.USER.CREATE)(
            <Link to={slug.user.create} style={{ marginLeft: 16 }}>
              <Button type="primary">
                <Icon type="plus" /> {i18n.create}
              </Button>
            </Link>
          )}
        </Col>
      </Row>
    )
  }
}
