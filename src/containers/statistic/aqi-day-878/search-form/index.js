import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import createLang from 'hoc/create-lang'
import createValidateComponent from 'components/elements/redux-form-validate'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { translate } from 'hoc/create-lang'
import OptionsMonthRange from '../../common/options-time-month-range'
import { DD_MM_YYYY } from 'constants/format-date'
import moment from 'moment'

const FOptionsMonthRange = createValidateComponent(OptionsMonthRange)

// const optionTimeZoneDay = [{ value: '24', name: '00:00 - 23:59' }, { value: '17', name: '17:00 - 16:59' }, { value: '1', name: '24:00' }, { value: '2', name: '17:00' }]

const SearchFormContainer = BoxShadowStyle.extend``
const Container = styled.div`
  padding: 16px 16px;
`

function validate(values) {
  const errors = {}
  if (!values.inRange)
    errors.inRange = translate('aqiSearchForm.form.inRange.error')
  if (!values.stationType)
    errors.stationType = translate('avgSearchFrom.form.stationType.error')
  if (!values.station)
    errors.station = translate('avgSearchFrom.form.stationType.error')
  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues ? ownProps.initialValues : {}),
  },
}))
@reduxForm({
  form: 'dataAQISearch2',
  validate,
})
@createLang
export default class SearchForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      timeZone: 420,
    }
  }

  handleSubmit = values => {
    // console.log('handleSubmit', values)

    const toDate =
      values.inRange[1].utcOffset(this.state.timeZone) <
      moment().utcOffset(this.state.timeZone)
        ? values.inRange[1].utcOffset(this.state.timeZone)
        : moment().utcOffset(this.state.timeZone)
    if (this.props.onSubmit) {
      this.props.onSubmit({
        fromDate: values.inRange[0]
          .utcOffset(this.state.timeZone)
          .startOf('day'),
        toDate: toDate.startOf('day'),
      })
    }
  }

  render() {
    // const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              size="small"
              onClick={this.props.handleSubmit(this.handleSubmit)}
            >
              {this.props.lang.t('addon.search')}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {this.props.lang.t('addon.search')}
        </Heading>
        <Container>
          <Row gutter={24}>
            <Col span={12}>
              <Field
                label={translate('aqiSearchForm.form.inRange.label')}
                name="inRange"
                size="large"
                formatDate={DD_MM_YYYY}
                component={FOptionsMonthRange}
              />
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
