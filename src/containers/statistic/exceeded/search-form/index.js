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
import SelectAnt from 'components/elements/select-ant/index'
import SelectStationAuto from '../../common/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsMonthRange from '../../common/options-time-month-range'


const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectStationType = createValidateComponent(SelectStationType)
const FOptionsMonthRange = createValidateComponent(OptionsMonthRange)
const FSelectAnt = createValidateComponent(SelectAnt)

const SearchFormContainer = BoxShadowStyle.extend``
const Container = styled.div`
  padding: 16px 16px;
`

function validate(values) {
  const errors = {}
  if (!values.stationType)
    errors.stationType = translate('avgSearchFrom.form.stationType.error')
  if (!values.stationAuto || values.stationAuto === '')
    errors.stationAuto = translate('avgSearchFrom.form.stationAuto.error')
  if (!values.type) errors.type = translate('avgSearchFrom.form.type.error')
  if (values.measuringList && values.measuringList.length === 0)
  errors.measuringList = translate('avgSearchFrom.form.measuringList.require')
  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    fromDate: moment().subtract(7, 'days'),
    toDate: moment(),
    ...(ownProps.initialValues ? ownProps.initialValues : {})
  }
}))
@reduxForm({
  form: 'dataSearchForm',
  validate
})
@createLang
@autobind
export default class SearchForm extends React.Component {
  static propTypes = {
    measuringData: PropTypes.array,
    searchNow: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationKey: props.initialValues.stationAuto,
      stationID: null,
      stationName: '',
      measuringListOrigin: [],
      measuringData: props.measuringData ? props.measuringData : [],
      measuringList: props.measuringData
        ? props.measuringData.map(measuring => ({
            value: measuring.key,
            name: measuring.name
          }))
        : [],
      fromDate: props.initialValues.fromDate,
      toDate: props.initialValues.toDate,
      dataFrequency: null
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
      stationID: ''
    })
    this.props.change('station', '')
  }

  handleChangeStationAuto(station) {
    const measuringData = station.measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })
    const params = {
      measuringList: measuringData.map(measuring => ({
        value: measuring.key,
        name: measuring.name
      })),
      stationKey: station.key,
      stationName: station.name,
      receivedAt: moment(),
      stationID: station._id,
      dataFrequency: station.dataFrequency,
      measuringListOrigin: station.measuringList
    }
    this.setState(params)
    this.props.change('measuringList', measuringData.map(m => m.key))
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.station,
      stationName: this.state.stationName,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
      stationID: this.state.stationID,
      dataFrequency: this.state.dataFrequency,
      measuringListOrigin: this.state.measuringListOrigin
    })
  }

  convertDateToString(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province.key,
      stationKey: ''
    })

    this.props.change('station', '')
  }

  handleChangeDate = (fromDate, toDate) => {
    const fromTime = moment(fromDate).format('YYYY-MM-DD 00:00:00')
    const toTime = moment(toDate).format('YYYY-MM-DD 23:59:59')
    this.setState({
      fromDate: fromTime,
      toDate: toTime
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
            <Col span={8}>
              <Field
                label={translate('qaqc.province.label')}
                name="province"
                size="large"
                component={FSelectProvince}
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('stationType.label')}
                name="stationType"
                size="large"
                onHandleChange={this.handleChangeStationType}
                component={FSelectStationType}
                isAuto= {null}
              />
            </Col>
            <Col span={8}>
                <Field
                  label={t('stationAuto.label')}
                  name="station"
                  size="large"
                  provinceKey={this.state.provinceKey}
                  stationTypeKey={this.state.stationTypeKey}
                  component={FSelectStationAuto}
                  onChangeObject={this.handleChangeStationAuto}
                  stationKey={this.state.stationKey}
                  setKey
                />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={12}>
              <Field
                label={t('measuringList.label')}
                name="measuringList"
                size="large"
                showSearch
                mode="multiple"
                options={this.state.measuringList}
                component={FSelectAnt}
              />
            </Col>
            <Col span={12}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeDate={this.handleChangeDate}
                component={FOptionsMonthRange}
              />
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
