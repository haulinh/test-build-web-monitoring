import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { Row, Col, Button } from 'antd'
import createLang from 'hoc/create-lang/index'
import SelectStationType from 'components/elements/select-station-type/index'
import SelectAnt from 'components/elements/select-ant/index'
import Clearfix from 'components/elements/clearfix/index'
import createValidateComponent from 'components/elements/redux-form-validate/index'
import moment from 'moment'
import { default as BoxShadowStyle } from 'components/elements/box-shadow/index'
import Heading from 'components/elements/heading/index'
import SelectStationAuto from '../../common/select-station-auto'
import SelectTimeRange from '../../common/select-time-range'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsTimeRange from '../../common/options-time-range'
import * as _ from 'lodash'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectTimeRange = createValidateComponent(SelectTimeRange)
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

@connect(state => ({
  initialValues: {
    fromDate: moment().subtract(7, 'days'),
    toDate: moment()
  }
}))
@reduxForm({
  form: 'avgSearchForm',
  validate
})
@createLang
@autobind
export default class SearchAvgForm extends React.Component {
  state = {
    timeRange: 7,
    provinceKey: this.props.initialValues.provinceKey,
    stationTypeKey: '',
    stationAutoKey: '',
    measuringData: [],
    measuringList: [],
    fromDate: this.props.initialValues.fromDate,
    toDate: this.props.initialValues.toDate,
    receivedAt: this.props.initialValues.toDate
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
      params.fromDate = params.receivedAt
        .clone()
        .subtract(this.state.timeRange, 'days')
      params.toDate = params.receivedAt.clone()
    }

    this.setState(params)

    this.props.change('measuringList', measuringData.map(m => m.key))
  }

  convertDateToString(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      type: values.type,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData
    })
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

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province.key,
      stationAutoKey: ''
    })

    this.props.change('stationAuto', '')
  }

  render() {
    const t = this.props.lang.createNameSpace('avgSearchFrom.form')
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
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationAuto}
                stationAutoKey={this.state.stationAutoKey}
                setKey
                provinceKey={this.state.provinceKey}
                onChangeObject={this.handleChangeStationAuto}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={8}>
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
            <Col span={8}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('type.label')}
                name="type"
                size="large"
                component={FSelectTimeRange}
              />
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
