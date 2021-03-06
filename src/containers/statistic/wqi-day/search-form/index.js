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
import moment from 'moment'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationConfigWQI from '../../common/select-station-config-wqi'
import SelectStationTypeConfigWQI from '../../common/select-station-type-config-wqi'
import SelectWqiKey from 'components/elements/select-wqi-key'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsMonthRange from '../../common/options-time-month-range'
import { DD_MM_YYYY } from 'constants/format-date'
import TimerPicker from 'components/elements/time-picker'
import InputLabel from 'components/elements/input-label'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationTypeConfigWQI = createValidateComponent(
  SelectStationTypeConfigWQI
)
const FSelectStationConfigWQI = createValidateComponent(SelectStationConfigWQI)
const FOptionsMonthRange = createValidateComponent(OptionsMonthRange)
const FTimerPicker = createValidateComponent(TimerPicker)
const FSelectWqiKey = createValidateComponent(SelectWqiKey)

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
    errors.station = translate('avgSearchFrom.form.stationAuto.error')
  if (!values.wqiKey) errors.wqiKey = translate('wqi.form.wqiKey.require')
  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues ? ownProps.initialValues : {}),
  },
}))
@reduxForm({
  form: 'dataAQISearch',
  validate,
})
@createLang
@autobind
export default class SearchForm extends React.Component {
  static propTypes = {
    measuringData: PropTypes.array,
    searchNow: PropTypes.object,
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationID: null,
      fromDate: props.initialValues.fromDate,
      toDate: props.initialValues.toDate,
      isTimezoneDay: false,
      timezoneDay: 0,
      timezoneTo: '',
      wqiKey: null,
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

  handleChangeStationAuto(listId) {
    const params = {
      stationID: listId,
    }
    this.setState(params)
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      key: values.station,
      listStation: values.station,
      name: this.state.stationName,
      stationID: this.state.stationID,
      timezoneDay: this.state.timezoneDay,
      wqiKey: this.state.wqiKey,
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

  handleChangeDate = (fromDate, toDate) => {
    const fromTime = moment(fromDate)
      .startOf('day')
      .utc()
      .format()
    const toTime = moment(toDate)
      .endOf('day')
      .utc()
      .format()
    this.setState({
      fromDate: fromTime,
      toDate: toTime,
      isTimezoneDay: false,
    })
  }

  hanldeOnchangeFramTime = (time, timeString) => {
    const to = moment(time)
      .subtract(23, 'hours')
      .format('HH:mm')
    this.setState({
      timezoneTo: to,
      timezoneDay: moment(time).format('HH'),
    })
  }

  handleChangeDateTest = (time, txt) => {
    console.log(time, txt)
  }

  handleChangeWqiKey = wqiKey => {
    this.setState({ wqiKey })
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
                component={FSelectStationTypeConfigWQI}
                isAuto={null}
              />
            </Col>
          </Row>
          <Clearfix height={8} />
          <Row gutter={24}>
            <Col span={24}>
              <Field
                label={t('stationAuto.label')}
                name="station"
                size="large"
                isMultiple={true}
                provinceKey={this.state.provinceKey}
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationConfigWQI}
                onChangeObject={this.handleChangeStationAuto}
              />
            </Col>
          </Row>
          <Clearfix height={8} />
          <Row gutter={24}>
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
            <Col span={12}>
              <Field
                label={translate('wqi.form.wqiKey.label')}
                name="wqiKey"
                size="large"
                onChangeVal={this.handleChangeWqiKey}
                component={FSelectWqiKey}
              />
            </Col>

            {this.state.isTimezoneDay && (
              <div>
                <Col span={5}>
                  <InputLabel
                    size={'large'}
                    disabled={true}
                    label={translate('aqiSearchForm.form.from.label')}
                    value={
                      this.state.timezoneTo ? this.state.timezoneTo : '01:00'
                    }
                  />
                </Col>
                <Col span={4}>
                  <TimerPicker
                    size="large"
                    name="timezoneDay"
                    timePickerFormat="HH:00"
                    label={translate('aqiSearchForm.form.to.label')}
                    defaultValue={'00:00'}
                    component={FTimerPicker}
                    onChange={this.hanldeOnchangeFramTime}
                  />
                </Col>
              </div>
            )}
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
