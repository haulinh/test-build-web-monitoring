import { Button, Col, Row, Switch } from 'antd'
// import { FSelectApprove } from './select-approve'
// import { prop } from 'cramda';
import { getConfigQAQC } from 'api/CategoryApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
// import Clearfix from 'components/elements/clearfix'
import createValidateComponent from 'components/elements/redux-form-validate'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
// import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { autobind } from 'core-decorators'
import createLang, { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { getTimes } from 'utils/datetime'
import OptionsTimeRange from '../../common/options-time-range'
// import AdvancedOperator from './AdvancedOperator'
import SelectStationAuto from '../../common/select-station-auto'
// import ToolTipIcon from 'assets/svg-icons/tooltip.svg'
import { ToolTip } from './../../common/tooltip'
import { FSelectQueryType as SelectQueryType } from './select-query-type'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSwitch = createValidateComponent(Switch)
const FSwitchFilter = createValidateComponent(Switch)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

const QUERY_TYPE = {
  RAW: 'RAW',
  QCVN: 'QCVN',
  ANTI_QCVN: 'ANTI_QCVN',
}

const QCVN_TYPE = {
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  DEVICE_ERROR: 'DEVICE_ERROR',
  DEVICE_CALIRATE: 'DEVICE_CALIRATE',
  ZERO: 'ZERO',
  NEGATIVE: 'NEGATIVE',
}

const qcvnOptions = [
  {
    value: QCVN_TYPE.OUT_OF_RANGE,
    name: translate('qaqcConfig.beyondMeasuringRange'),
  },
  {
    value: QCVN_TYPE.DEVICE_ERROR,
    name: translate('qaqcConfig.deviceError'),
  },
  {
    value: QCVN_TYPE.DEVICE_CALIRATE,
    name: translate('qaqcConfig.deviceCalibration'),
  },
  {
    value: QCVN_TYPE.ZERO,
    name: translate('qaqcConfig.zero'),
  },
  {
    value: QCVN_TYPE.NEGATIVE,
    name: translate('qaqcConfig.negative'),
  },
]
// console.log(qcvnOptions, '==qcvnOptions==')

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
          qcvnOptions: [],
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
    // innit default value for timerange
    // const { from, to } = getTimes(1)
    const { fromDate: from, toDate: to } = this.props.formDataSearch

    // let fromDate = moment(props.initialValues.fromDate)
    // let toDate = moment(props.initialValues.toDate)
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
      rangesView = `${moment(from).format(DD_MM_YYYY_HH_MM)} - ${moment(
        to
      ).format(DD_MM_YYYY_HH_MM)}`
      timeRange = null
    }

    this.state = {
      // defaultQcvnOptions: [],
      now: moment(),
      triggerRerender: true,
      defaultQcvnOptions: qcvnOptions,
      isFilter: false,
      qcvnType: [],
      queryType: QUERY_TYPE.RAW,
      fromDate: from,
      toDate: to,
      timeRange,
      rangesView,
      provinceKey: props.initialValues.provinceKey,
      stationTypeKey: props.initialValues.stationType,
      stationAutoKey: props.initialValues.stationAuto,
      stationAutoName: props.initialValues.stationAutoName,
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

  getDefaultValueQcvn() {
    return this.state.defaultQcvnOptions.map(item => {
      return item.value
    })
  }
  async loadQcvnConfig() {
    const res = await getConfigQAQC()

    if (res.success !== true) return

    // const stationType = this.state.stationTypeKey

    const beyondMeasuringRange = _.get(
      res,
      'data.value.beyondMeasuringRange',
      false
    )
    const deviceCalibration = _.get(res, 'data.value.deviceCalibration', false)
    const deviceError = _.get(res, 'data.value.deviceError', false)
    // console.log(beyondMeasuringRange, '==beyondMeasuringRange')
    const filteredOptions = [
      {
        value: QCVN_TYPE.ZERO,
        name: translate('qaqcConfig.zero'),
      },
      {
        value: QCVN_TYPE.NEGATIVE,
        name: translate('qaqcConfig.negative'),
      },
    ]
    qcvnOptions.forEach((option, index) => {
      // console.log("Turn " + index)
      // console.log(beyondMeasuringRange, '==beyondMeasuringRange')
      // console.log(option.value, '==option value')
      if (
        beyondMeasuringRange === true &&
        option.value === QCVN_TYPE.OUT_OF_RANGE
      ) {
        filteredOptions.push(option)
      }
      if (
        deviceCalibration === true &&
        option.value === QCVN_TYPE.DEVICE_CALIRATE
      ) {
        filteredOptions.push(option)
      }
      if (deviceError === true && option.value === QCVN_TYPE.DEVICE_ERROR) {
        filteredOptions.push(option)
      }
    })
    // console.log(filteredOptions, '==filteredOptions==')
    this.setState({
      defaultQcvnOptions: [...filteredOptions],
    })
    this.props.change('qcvnOptions', this.getDefaultValueQcvn())
    // change()
    // return {
    //   beyondMeasuringRange,
    //   deviceCalibration,
    //   deviceError
    // }
    // const config = _.get(res, `data.value.${stationType}`)
    // console.log(res, '==res===cofig')
  }
  componentDidMount() {
    // console.log("componentDidMount")
    this.loadQcvnConfig()
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
    // console.log("handleChangeStationAuto")
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

    // if (this.state.timeRange) {
    //   params.fromDate = params.receivedAt
    //     .clone()
    //     .subtract(this.state.timeRange, 'days')
    //   params.toDate = params.receivedAt.clone()
    // }
    // console.log("Start set state " + JSON.stringify(params, null, 2))

    this.setState({
      ...this.state,
      ...params,
    })
    this.props.change(
      'measuringList',
      measuringData.map(m => m.key)
    )
  }

  handleChangeRanges(ranges) {
    if (ranges === null) return
    // console.log(ranges, '==ranges==')
    // console.log({
    //   timeRange: ranges,
    //   fromDate: from,
    //   toDate: to,
    // })
    // trong khoang
    if (Array.isArray(ranges)) {
      this.setState({
        timeRange: null,
        fromDate: ranges[0],
        toDate: ranges[1],
      })
      return
    }

    // cac truong hop khac
    const { from, to } = getTimes(ranges)
    // if (ranges === null) {
    //   console.log({ from: from.format('DD/MM/YYYY HH:mm'), to: to.format('DD/MM/YYYY HH:mm') })
    //   console.log({ from: from.format('DD/MM/YYYY HH:mm'), to })
    // }

    this.setState({
      timeRange: ranges,
      fromDate: from,
      toDate: to,
    })
  }

  convertDateToString(date) {
    // console.log(date.format(),"date-date")
    return moment(date)
      .utc()
      .format()
  }

  handleSubmit(values) {
    // console.log("handleSubmit")
    this.handleChangeRanges(this.state.timeRange)

    this.setState({
      now: moment(),
    })
    // callapi
    // console.log(values, "handleSubmit")
    const qcvnOptions = values.qcvnOptions || []
    const measuringListUnitStr = values.measuringList.map(item => {
      // console.log(item, "item")
      const itemFind = _.find(this.state.measuringData, obj => {
        return obj.key === item
      })
      // console.log(itemFind,"itemFind")
      return encodeURIComponent(itemFind.unit)
    })
    // console.log({
    //   fromDate: this.convertDateToString(this.state.fromDate),
    //   toDate: this.convertDateToString(this.state.toDate),
    //   key: values.stationAuto,
    //   name: this.state.stationAutoName,
    //   measuringListUnitStr,
    //   measuringList: values.measuringList,
    //   measuringData: this.state.measuringData,
    //   // dataType: values.dataType,
    //   isExceeded: values.isExceeded,
    //   advanced: values.advanced
    //     ? values.advanced.filter(
    //       item =>
    //         item.measuringKey &&
    //         item.operator &&
    //         item.value !== null &&
    //         typeof item.value !== 'undefined'
    //     )
    //     : [],
    //   queryType: this.state.queryType,
    //   qcvnList: qcvnOptions.join(','),
    //   isFilter: values.isFilter || false
    // })
    this.props.onSubmit({
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      measuringListUnitStr,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
      // dataType: values.dataType,
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
      queryType: this.state.queryType,
      qcvnList: qcvnOptions.join(','),
      isFilter: values.isFilter || false,
      standardsVN: this.props.standardsVN ? this.props.standardsVN : [],
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
  handleChangeQueryType = type => {
    // console.log("handleChangeQueryType " + type)
    this.setState({
      queryType: type,
    })

    // this.props.change('stationAuto', '')
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
          <Row gutter={[16, 24]}>
            <Col span={3}>
              <Field
                label={translate('qaqc.province.label')}
                name="province"
                size="large"
                isShowAll
                component={FSelectProvince}
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={3}>
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
            <Col span={9}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
                now={this.state.now}
                // value={this.state.rangesDate}
                rangesView={this.state.rangesView}
                // triggerRerender={this.state.triggerRerender}
              />
            </Col>
            {/* <Col span={6}>
              <Field
                label={translate('qaqc.data')}
                name="dataType"
                size="large"
                component={FSelectApprove}
              />
            </Col> */}
            <Col span={18}>
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
            <Col span={3}>
              <Field
                label={t('isExceeded.label')}
                name="isExceeded"
                size="large"
                component={FSwitch}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Field
                label={translate('dataSearchFrom.queryType')}
                name="queryType"
                size="large"
                isShowAll
                component={SelectQueryType}
                onHandleChange={this.handleChangeQueryType}
              />
            </Col>
            <Col span={12}>
              {this.state.queryType === 'ANTI_QCVN' && (
                <Field
                  label={translate('dataSearchFrom.filterDataBy')}
                  name="qcvnOptions"
                  size="large"
                  showSearch
                  mode="multiple"
                  options={this.state.defaultQcvnOptions}
                  // defaultValue={this.getDefaultValueQcvn()}
                  component={FSelectAnt}
                />
              )}
            </Col>
            {this.state.queryType !== 'RAW' && (
              <Col span={6}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <ToolTip />
                  <div style={{ fontSize: '14', fontWeight: '600' }}>
                    {translate('dataSearchFrom.processData')}
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <Field
                      // label={translate('dataSearchFrom.processData')}
                      name="isFilter"
                      size="large"
                      component={FSwitchFilter}
                    />
                  </div>
                </div>
              </Col>
            )}
          </Row>
          {/* tạm ẩn vì nâng cao chưa đạt DOD */}
          {/* {this.state.measuringList.length > 0 ? (
            <div>
              <Clearfix height={16} />
              <AdvancedOperator
                onReset={this.handleResetAdvanced}
                measuringList={this.state.measuringList}
              />
            </div>
          ) : null} */}
        </Container>
      </SearchFormContainer>
    )
  }
}
