import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { reduxForm, Field, SubmissionError } from 'redux-form'
import createValidateComponent from 'components/elements/redux-form-validate'
import InputLabel from 'components/elements/input-label'
import CheckBoxRole from 'components/elements/checkbox-role'
import Button from 'components/elements/button'
import Clearfix from 'components/elements/clearfix'
import createLanguage, { langPropTypes, translate } from 'hoc/create-lang'

const FInputLabel = createValidateComponent(InputLabel)
const FCheckBoxRole = createValidateComponent(CheckBoxRole)

function validate(values) {
  const errors = {}
  if (!values.name) {
    errors.name = translate('roleManager.form.name.error')
  } else if (values.name.length < 5) {
    errors.name = translate('roleManager.form.name.limit')
  }
  return errors
}

@createLanguage
@reduxForm({
  form: 'RoleForm',
  validate,
})
@autobind
export default class RoleForm extends PureComponent {
  static propTypes = {
    lang: langPropTypes,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
  }

  handleSubmit = values => {
    const params = {
      ...values,
      name: (values.name || '').trim(),
    }
    const { t } = this.props.lang
    return this.props.onSubmit(params).then(res => {
      if (res && res.error) {
        if (res.message === 'ROLE_NAME_EXISTED') {
          throw new SubmissionError({
            name: t('roleManager.form.name.errorExist'),
          })
        }
      }
    })
  }

  render() {
    const {
      lang: { t },
    } = this.props
    return (
      <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Field
          name="name"
          label={t('roleManager.form.name.label')}
          placeholder={t('roleManager.form.name.placeholder')}
          component={FInputLabel}
          size="large"
        />
        <Clearfix height={16} />

        <Field
          name="description"
          label={t('roleManager.form.description.label')}
          placeholder={t('roleManager.form.description.placeholder')}
          component={FInputLabel}
          size="large"
        />
        <Clearfix height={16} />
        <Field name="menu" component={FCheckBoxRole} />
        <Clearfix height={16} />
        <Button
          type="submit"
          block
          color="primary"
          disabled={this.props.submitting}
          isLoading={this.props.submitting}
        >
          {this.props.isEdit ? t('form.update') : t('form.save')}
        </Button>
      </form>
    )
  }
}
