import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import DatePicker from 'components/elements/datetime-picker'
import createLang from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import SelectProvince from 'components/elements/select-province'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'
import createValidateComponent from 'components/elements/redux-form-validate'
import moment from 'moment-timezone'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationAuto from '../../../search/common/select-station-auto'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

import { FSelectApprove } from './select-approve'
import { QAQC_TABLES } from 'constants/qaqc'

const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectProvince = createValidateComponent(SelectProvince)
const FDatePicker = createValidateComponent(DatePicker)
const FSelectAnt = createValidateComponent(SelectAnt)

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

/* TODO  @translate */
const i18n = {
  __ngoaidaido: translate('qaqc.dataFilter.outOfRange'),
  __deviceError: translate('qaqc.dataFilter.deviceError'),
  __deviceCalibration: translate('qaqc.dataFilter.deviceCalibration'),
  __zero: translate('qaqc.dataFilter.zero'),
  __negative: translate('qaqc.dataFilter.negative'),
}

/* MARK  @mockup */
let mockDataFilterBy = [
  { name: i18n.__ngoaidaido, value: 'outOfRange' },
  { name: i18n.__deviceError, value: 'deviceError' },
  { name: i18n.__deviceCalibration, value: 'deviceCalibration' },
  { name: i18n.__zero, value: 'zero' },
  { name: i18n.__negative, value: 'negative' },
]

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
    fromDate: moment()
      .subtract(1, 'month')
      .startOf('month')
      .hours(0)
      .minutes(0),
    toDate: moment()
      .hours(23)
      .minutes(59),
    //   ...(ownProps.initialValues ? ownProps.initialValues : {})
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
      enabledDataFilters: false,
      provinceKey: '',
      stationTypeKey: props.initialValues.stationType,
      stationAutoKey: props.initialValues.stationAuto,
      measuringData: props.measuringData ? props.measuringData : [],
      measuringList: props.measuringData
        ? props.measuringData.map(measuring => ({
            value: measuring.key,
            name: measuring.name,
          }))
        : [],
      dataFilters: mockDataFilterBy,
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
      stationAutoKey: '',
    })
    this.props.change('stationAuto', '')
  }

  handleProvinceChange(obj, e) {
    this.setState({ provinceKey: obj.key, stationAutoKey: '' })
    this.props.change('stationAuto', '')
  }

  handleChangeStationAuto(stationAuto) {
    const measuringData = _.orderBy(
      stationAuto.measuringList || [],
      'numericalOrder'
    )

    this.setState({
      measuringList: measuringData.map(measuring => ({
        value: measuring.key,
        name: measuring.name,
      })),
      measuringData: measuringData,
      stationAutoKey: stationAuto.key,
      stationAutoID: stationAuto._id,
      options: stationAuto.options,
      stationAutoName: stationAuto.name,
    })
    this.props.change(
      'measuringList',
      measuringData.map(m => m.key)
    )
  }

  convertDateToString(date) {
    return moment(date, DD_MM_YYYY_HH_MM).toISOString()
  }

  handleSubmit(values) {
    // console.log(values, "handleSubmit")
    const params = {
      fromDate: this.convertDateToString(values.fromDate),
      toDate: this.convertDateToString(values.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
      stationAutoType: this.state.stationTypeKey,
      province: _.get(values, 'province', ''),
      dataType: _.get(values, 'dataType', QAQC_TABLES.original),
      dataFilterBy: _.get(values, 'dataFilterBy', []),
    }

    this.props.onSubmit(params, {
      _id: this.state.stationAutoID,
      publishedList: _.get(this.state, 'options.published.measureList', []),
    })
  }

  _handleChangeDataType = (e, newValue, prevValue, name) => {
    // this._setSelectedTableFromType(newValue)
    // this._setDataFiltersOptionsEnabledBy(newValue)
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
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('stationAuto.label')}
                name="stationAuto"
                size="large"
                provinceKey={this.state.provinceKey}
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationAuto}
                onChangeObject={this.handleChangeStationAuto}
                stationAutoKey={this.state.stationAutoKey}
                setKey
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row>
            <Col span={24}>
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
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={8}>
              <Field
                label={translate('qaqc.date.from')}
                name="fromDate"
                size="large"
                component={FDatePicker}
                dateFormat={DD_MM_YYYY_HH_MM}
              />
            </Col>
            <Col span={8}>
              <Field
                label={translate('qaqc.date.to')}
                name="toDate"
                size="large"
                component={FDatePicker}
                dateFormat={DD_MM_YYYY_HH_MM}
              />
            </Col>
            <Col span={8}>
              <Field
                label={translate('qaqc.data')}
                name="dataType"
                size="large"
                component={FSelectApprove}
                onChange={this._handleChangeDataType}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row>
            <Col span={24}>
              {this.state.enabledDataFilters && (
                <Field
                  label={translate('qaqc.dataFilter.label')}
                  name="dataFilterBy"
                  size="large"
                  showSearch
                  mode="multiple"
                  type="hidden"
                  options={this.state.dataFilters}
                  component={FSelectAnt}
                />
              )}
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }

  _setSelectedTableFromType(type) {
    switch (type) {
      case 'original': {
        this.props.changeDataType(QAQC_TABLES.original)
        break
      }
      case 'valid': {
        this.props.changeDataType(QAQC_TABLES.valid)
        break
      }
      case 'invalid': {
        this.props.changeDataType(QAQC_TABLES.invalid)
        break
      }
      default:
        break
    }
  }
  _setDataFiltersOptionsEnabledBy(value) {
    if (value === 'invalid') {
      this.setState({ enabledDataFilters: true })
      this.props.change(
        'dataFilterBy',
        mockDataFilterBy.map(item => item.value)
      )
    } else {
      this.setState({ enabledDataFilters: false })
      this.props.change('dataFilterBy', [])
    }
  }
}
