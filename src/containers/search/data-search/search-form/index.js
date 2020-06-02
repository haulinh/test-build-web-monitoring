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
import moment from 'moment-timezone'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import AdvancedOperator from './AdvancedOperator'
import SelectStationAuto from '../../common/select-station-auto'
import { translate } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import OptionsTimeRange from '../../common/options-time-range'
import * as _ from 'lodash'
import { FSelectApprove } from './select-approve'
// import { prop } from 'cramda';

// import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSwitch = createValidateComponent(Switch)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

const SearchFormContainer = styled(BoxShadowStyle)``
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

  if (!values.rangesDate) {
    errors.rangesDate = translate('avgSearchFrom.form.rangesDate.error')
  }

  if (values.measuringList && values.measuringList.length === 0)
    errors.measuringList = translate('avgSearchFrom.form.measuringList.require')

  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues
      ? {
          ...ownProps.initialValues,
          rangesDate: 1,
        }
      : {}),
  },
}))
@reduxForm({
  form: 'dataSearchForm',
  validate,
})
@createLang
// @queryFormDataBrowser()
@autobind
export default class SearchFormHistoryData extends React.Component {
  static propTypes = {
    measuringData: PropTypes.array,
    searchNow: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // console.log(this.props.formData,"this.props.query")

    let fromDate = moment(props.initialValues.fromDate)
    let toDate = moment(props.initialValues.toDate)
    let timeRange = props.initialValues.rangesDate
    let rangesView = null
    // debugger
    // console.log(
    //   props.initialValues,
    //   fromDate.format(DD_MM_YYYY_HH_MM),
    //   toDate.format(DD_MM_YYYY_HH_MM),
    //   "props.initialValues"
    // )
    if (props.initialValues.searchRange) {
      rangesView = `${fromDate.format(DD_MM_YYYY_HH_MM)} - ${toDate.format(
        DD_MM_YYYY_HH_MM
      )}`
      timeRange = null
    }

    this.state = {
      fromDate,
      toDate,
      timeRange,
      rangesView,
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationAutoKey: props.initialValues.stationAuto,
      measuringData: props.measuringData ? props.measuringData : [],
      measuringList: props.measuringData
        ? props.measuringData.map(measuring => ({
            value: measuring.key,
            name: measuring.name,
          }))
        : [],
      receivedAt:
        moment(props.initialValues.receivedAt) ||
        this.props.initialValues.toDate,
      isSearchInit: props.initialValues.stationAuto ? false : true,
    }
  }

  componentDidMount() {
    if (this.props.searchNow) {
      this.props.handleSubmit(this.handleSubmit)()
    }
  }

  searchInit() {
    // return

    if (!this.state.isSearchInit) {
      return
    }
    // console.log(_.pick(this.props.initialValues, ["stationAuto"]), "searchInit")
    // NOTE  do gấp, code chạy còn thừa, chưa có time check
    if (
      this.StationType &&
      this.StationType.getFirstValue &&
      this.StationAuto
    ) {
      // console.log('this.props.change',this.props.change)
      this.handleChangeStationType(this.StationType.getFirstValue())
      this.StationType.setFirstValue()
      this.props.change('stationType', this.StationType.getFirstValue().key)

      let stationAutoData = this.StationAuto.getStationAutos()
      // console.log("run 1")
      if (stationAutoData.length > 0) {
        this.handleChangeStationAuto(stationAutoData[0])
        this.props.change('stationAuto', stationAutoData[0].key)
        // console.log("run 2")
        this.setState(
          {
            stationAutoKey: stationAutoData[0].key,
          },
          () => {
            this.props.handleSubmit(this.handleSubmit)()
          }
        )
      }
    }
  }

  handleChangeStationType(stationTypeKey, e) {
    this.setState({
      stationTypeKey: stationTypeKey ? stationTypeKey.key : '',
      stationAutoKey: '',
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
        name: measuring.name,
      })),
      measuringData: measuringData,
      stationAutoKey: stationAuto.key,
      stationAutoName: stationAuto.name,
      receivedAt: moment(),
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

  handleChangeRanges(ranges) {
    // console.log('ranges', ranges)
    if (_.isNumber(ranges)) {
      this.setState({
        timeRange: ranges,
        fromDate: this.state.receivedAt.clone().subtract(ranges, 'days'),
        toDate: this.state.receivedAt.clone(),
      })
    } else {
      if (_.size(ranges) > 1) {
        this.setState({
          timeRange: null,
          fromDate: ranges[0],
          toDate: ranges[1],
        })
      }
    }
  }

  convertDateToString(date) {
    // console.log(date.format(),"date-date")
    return moment(date)
      .utc()
      .format()
  }

  handleSubmit(values) {
    // console.log(values, "handleSubmit")
    const measuringListUnitStr = values.measuringList.map(item => {
      // console.log(item, "item")
      const itemFind = _.find(this.state.measuringData, obj => {
        return obj.key === item
      })
      // console.log(itemFind,"itemFind")
      return encodeURIComponent(itemFind.unit)
    })

    this.props.onSubmit({
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      measuringListUnitStr,
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
        : [],
    })
  }

  handleResetAdvanced() {
    this.props.array.removeAll('advanced')
  }

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province.key,
      stationAutoKey: '',
    })

    this.props.change('stationAuto', '')
  }

  render() {
    // console.log(this.state.fromDate.format(),this.state.toDate.format(),"render")

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
                isShowAll
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
                getRef={ref => {
                  this.StationType = ref
                  this.searchInit()
                }}
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
                getRef={ref => {
                  this.StationAuto = ref
                  this.searchInit()
                }}
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
          <Row gutter={16}>
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
            <Col span={9}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
                // value={this.state.rangesDate}
                rangesView={this.state.rangesView}
              />
            </Col>
            <Col span={3}>
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
