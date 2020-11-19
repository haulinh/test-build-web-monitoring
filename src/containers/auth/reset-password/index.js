import React, { PureComponent } from 'react'
import styled from 'styled-components'
import swal from 'sweetalert2'
import { Form, Input } from 'antd'
import { withRouter } from 'react-router'

import AuthApi from 'api/AuthApi'
import { translate as t } from 'hoc/create-lang'

import Button from 'components/elements/button'
import slug from 'constants/slug'

const FormHeader = styled.div`
  width: 100%%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  > div {
    font-weight: 600;
    font-size: 16px;
  }
  .email {
    color: #656565;
  }
`

const FIELDS = {
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirm_password',
}

@withRouter
@Form.create()
export default class NewPassword extends PureComponent {
  state = { isLoading: false }

  validateConfirmPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue(FIELDS.PASSWORD)) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  handleUpdatePassword = async e => {
    e.preventDefault()
    const { form, history, userInfo } = this.props
    const values = await form.validateFields()

    if (!values) {
      swal({
        title: t('changePassword.form.newPasswordConfirmation.error1'),
        type: 'error',
      })
      return
    }

    const params = {
      _id: userInfo._id,
      code: userInfo.forgotPasswordCode,
      password: values[FIELDS.PASSWORD],
    }

    const result = await AuthApi.putResetPassword(params._id, params)

    if (result.error) {
      swal({
        type: 'error',
        title: result.message,
      })
      return
    }
    swal({
      type: 'success',
      title: t('changePassword.form.Success'),
    })
    history.push(slug.login.loginWithEmail)
  }

  render() {
    const { form, email } = this.props
    const { isLoading } = this.state

    return (
      <Form onSubmit={this.handleUpdatePassword}>
        <FormHeader>
          <div>{t('login.form.newPassword')}</div>
          <div>{email}</div>
        </FormHeader>
        <Form.Item>
          {form.getFieldDecorator(FIELDS.PASSWORD)(
            <Input
              size="large"
              type="password"
              placeholder={t('login.form.newPassword')}
            />
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator(FIELDS.CONFIRM_PASSWORD, {
            rules: [
              {
                validator: this.validateConfirmPassword,
              },
            ],
          })(
            <Input.Password
              size="large"
              type="password"
              placeholder={t('login.form.confirmNewPassword')}
            />
          )}
        </Form.Item>
        <Button isLoading={isLoading} size="lg" block color="primary">
          Save password
        </Button>
      </Form>
    )
  }
}
