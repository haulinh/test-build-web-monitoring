import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Row, Col, Button, Switch } from 'antd'
import createLang from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'
import createValidateComponent from 'components/elements/redux-form-validate'
import moment from 'moment'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import AdvancedOperator from './AdvancedOperator'
import SelectStationAuto from '../../common/select-station-auto'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsTimeRange from '../../common/options-time-range'
import * as _ from 'lodash'
import { FSelectApprove } from './select-approve'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSwitch = createValidateComponent(Switch)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

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
      timeRange: 7,
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationAutoKey: props.initialValues.stationAuto,
      measuringData: props.measuringData ? props.measuringData : [],
      measuringList: props.measuringData
        ? props.measuringData.map(measuring => ({
            value: measuring.key,
            name: measuring.name
          }))
        : [],
      fromDate: props.initialValues.fromDate,
      toDate: props.initialValues.toDate,
      receivedAt: this.props.initialValues.toDate
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
      stationAutoKey: ''
    })
    this.props.change('stationAuto', '')
  }

  handleChangeStationAuto(stationAuto) {
    const measuringData = stationAuto.measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })
    const params = {
      measuringList: measuringData.map(measuring => ({
        value: measuring.key,
        name: measuring.name
      })),
      measuringData: measuringData,
      stationAutoKey: stationAuto.key,
      stationAutoName: stationAuto.name,
      receivedAt: moment()
    }
    const time = _.get(stationAuto, 'lastLog.receivedAt')
    if (time) {
      params.receivedAt = moment(time)
    }

    if (this.state.timeRange) {
      params.fromDate = params.receivedAt.clone().subtract(this.state.timeRange, 'days')
      params.toDate =  params.receivedAt.clone()
    }

    this.setState(params)
    this.props.change('measuringList', measuringData.map(m => m.key))
  }

  convertDateToString(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  handleChangeRanges(ranges) {
    if (_.isNumber(ranges)) {
      this.setState({
        timeRange: ranges,
        fromDate: this.state.receivedAt.clone().subtract(ranges, 'days'),
        toDate: this.state.receivedAt.clone()
      })
    } else {
      if (_.size(ranges) > 1) {
        this.setState({
          timeRange: null,
          fromDate: ranges[0],
          toDate: ranges[1]
        })
      }
    }
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
      dataType: values.dataType,
      isExceeded: values.isExceeded,
      advanced: values.advanced
        ? values.advanced.filter(
            item =>
              item.measuringKey &&
              item.operator &&
              item.value !== null &&
              typeof item.value !== 'undefined'
          )
        : []
    })
  }

  handleResetAdvanced() {
    this.props.array.removeAll('advanced')
  }

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province.key,
      stationAutoKey: ''
    })

    this.props.change('stationAuto', '')
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
          <Row gutter={16}>
            <Col span={6}>
              <Field
                label={translate('qaqc.province.label')}
                name="province"
                size="large"
                component={FSelectProvince}
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={6}>
              <Field
                label={t('stationType.label')}
                name="stationType"
                size="large"
                onHandleChange={this.handleChangeStationType}
                component={FSelectStationType}
              />
            </Col>
            <Col span={6}>
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
            <Col span={6}>
              <Field
                label={translate('qaqc.data')}
                name="dataType"
                size="large"
                component={FSelectApprove}
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
            <Col span={6}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
              />
            </Col>
            <Col span={6}>
              <Field
                label={t('isExceeded.label')}
                name="isExceeded"
                size="large"
                component={FSwitch}
              />
            </Col>
          </Row>
          {this.state.measuringList.length > 0 ? (
            <div>
              <Clearfix height={16} />
              <AdvancedOperator
                onReset={this.handleResetAdvanced}
                measuringList={this.state.measuringList}
              />
            </div>
          ) : null}
        </Container>
      </SearchFormContainer>
    )
  }
}
