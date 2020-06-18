import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import createLang from 'hoc/create-lang'
import Clearfix from 'components/elements/clearfix'
import createValidateComponent from 'components/elements/redux-form-validate'
import moment from 'moment-timezone'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { DD_MM_YYYY } from 'constants/format-date'
import SelectStationConfigAQI from '../../common/select-station-config-aqi'
import SelectConfigAQI from '../../common/select-config-aqi'

import SelectStationTypeConfigAQI from '../../common/select-station-type-config-aqi'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsMonthRange from '../../common/options-time-month-range'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationTypeConfigAQI = createValidateComponent(
  SelectStationTypeConfigAQI
)
const FSelectConfigAQI = createValidateComponent(SelectConfigAQI)
const FSelectStationConfigAQI = createValidateComponent(SelectStationConfigAQI)
const FOptionsMonthRange = createValidateComponent(OptionsMonthRange)

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

function validate(values) {
  const errors = {}
  if (!values.aqiLocale || values.aqiLocale === '')
    errors.aqiLocale = translate('dataSearchFrom.form.aqiConfigSelect.require')
  if (!values.stationType)
    errors.stationType = translate('avgSearchFrom.form.stationType.error')
  if (!values.stationFixed || values.stationFixed === '')
    errors.stationFixed = translate('avgSearchFrom.form.stationAuto.error')
  if (!values.type) errors.type = translate('avgSearchFrom.form.type.error')

  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues ? ownProps.initialValues : {}),
  },
}))
@reduxForm({
  form: 'dataSearchForm',
  validate,
})
@createLang
@autobind
export default class SearchForm extends React.Component {
  static propTypes = {
    measuringData: PropTypes.array,
    searchNow: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationKey: props.initialValues.stationFixed,
      stationID: null,
      fromDate: props.initialValues.fromDate,
      toDate: props.initialValues.toDate,
    }
  }

  componentDidMount() {
    if (this.props.searchNow) {
      setTimeout(() => {
        this.props.handleSubmit(this.handleSubmit)()
      }, 100)
    }
  }

  handleChangeStationType(stationTypeKey, e) {
    this.setState({
      stationTypeKey: stationTypeKey ? stationTypeKey.key : '',
      stationKey: '',
      stationID: '',
    })
    this.props.change('station', '')
  }

  handleChangeStationAuto(station) {
    const params = {
      stationKey: station.key,
      stationName: station.name,
      receivedAt: moment(),
      stationID: station._id,
    }
    this.setState(params)
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      key: values.station,
      name: this.state.stationName,
      stationID: this.state.stationKey,
      aqiLocale: values.aqiLocale,
    })
  }

  convertDateToString(date) {
    return moment(date, 'YYYY-MM-DD').toISOString()
  }

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province ? province.key : undefined,
      stationKey: '',
    })

    this.props.change('station', '')
  }

  hanldeOnchangeFramTime = (time, timeString) => {
    const to = moment(time)
      .subtract(23, 'hours')
      .format('HH:mm')
    // console.log(to,  'hanldeOnchangeFramTime')
    this.setState({
      timezoneTo: to,
      timezoneDay: moment(time).format('HH'),
    })
  }
  handleChangeDate = (fromDate, toDate) => {
    const fromTime = moment(fromDate)
      .utc()
      .format()
    const toTime = moment(toDate)
      .utc()
      .format()
    // console.log(fromTime, toTime)
    this.setState({
      fromDate: fromTime,
      toDate: toTime,
    })
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
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
                label={translate('qaqc.province.label')}
                name="province"
                size="large"
                component={FSelectProvince}
                isShowAll
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={12}>
              <Field
                label={t('stationType.label')}
                name="stationType"
                size="large"
                onHandleChange={this.handleChangeStationType}
                component={FSelectStationTypeConfigAQI}
                isAuto={null}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={12}>
              <Field
                label={t('stationAuto.label')}
                name="station"
                size="large"
                provinceKey={this.state.provinceKey}
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationConfigAQI}
                onChangeObject={this.handleChangeStationAuto}
                stationKey={this.state.stationKey}
                setKey
              />
            </Col>
            <Col span={12}>
              <Field
                label={translate('aqiSearchForm.form.inRange.label')}
                name="inRange"
                size="large"
                formatDate={DD_MM_YYYY}
                onChangeDate={this.handleChangeDate}
                component={FOptionsMonthRange}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={12}>
              <Field
                label={t('aqiConfigSelect.label')}
                name="aqiLocale"
                size="large"
                component={FSelectConfigAQI}
              />
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
