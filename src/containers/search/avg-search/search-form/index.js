import React from "react"
import PropTypes from "prop-types"
import { autobind } from "core-decorators"
import styled from "styled-components"
import { connect } from "react-redux"
import { reduxForm, Field } from "redux-form"
import { Row, Col, Button } from "antd"
import createLang from "hoc/create-lang/index"
import SelectStationType from "components/elements/select-station-type/index"
import SelectAnt from "components/elements/select-ant/index"
import Clearfix from "components/elements/clearfix/index"
import createValidateComponent from "components/elements/redux-form-validate/index"
import moment from "moment-timezone"
import { default as BoxShadowStyle } from "components/elements/box-shadow/index"
import Heading from "components/elements/heading/index"
import SelectStationAuto from "../../common/select-station-auto"
import SelectTimeRange from "../../common/select-time-range"
import { translate } from "hoc/create-lang"
import SelectProvince from "components/elements/select-province"
import OptionsTimeRange from "../../common/options-time-range"
import * as _ from "lodash"
import { DD_MM_YYYY_HH_MM } from "constants/format-date"

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectTimeRange = createValidateComponent(SelectTimeRange)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

function validate(values) {
  const errors = {}
  if (!values.stationType)
    errors.stationType = translate("avgSearchFrom.form.stationType.error")
  if (!values.stationAuto || values.stationAuto === "")
    errors.stationAuto = translate("avgSearchFrom.form.stationAuto.error")
  if (!values.type) errors.type = translate("avgSearchFrom.form.type.error")
  if (!values.rangesDate)
    errors.rangesDate = translate("avgSearchFrom.form.rangesDate.error")
  if (values.measuringList && values.measuringList.length === 0)
    errors.measuringList = translate("avgSearchFrom.form.measuringList.require")

  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues
      ? {
          ...ownProps.initialValues,
          rangesDate: 1,
          type: 15
        }
      : {})
  }
}))
@reduxForm({
  form: "avgSearchForm",
  validate
})
@createLang
@autobind
export default class SearchAvgForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    searchNow: PropTypes.bool
  }
  constructor(props) {
    super(props)
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
            name: measuring.name
          }))
        : [],
      receivedAt:
        moment(props.initialValues.receivedAt) ||
        this.props.initialValues.toDate,
      isSearchInit: props.initialValues.stationAuto ? false : true
    }
  }

  state = {
    timeRange: 7,
    provinceKey: this.props.initialValues.provinceKey,
    stationTypeKey: "",
    stationAutoKey: "",
    measuringData: [],
    measuringList: [],
    fromDate: this.props.initialValues.fromDate,
    toDate: this.props.initialValues.toDate,
    receivedAt: this.props.initialValues.toDate
  }

  handleChangeStationType(stationTypeKey, e) {
    this.setState({
      stationTypeKey: stationTypeKey ? stationTypeKey.key : "",
      stationAutoKey: ""
    })
    this.props.change("stationAuto", "")
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

    const time = _.get(stationAuto, "lastLog.receivedAt")
    if (time) {
      params.receivedAt = moment(time)
    }

    if (this.state.timeRange) {
      params.fromDate = params.receivedAt
        .clone()
        .subtract(this.state.timeRange, "days")
      params.toDate = params.receivedAt.clone()
    }

    this.setState(params)

    this.props.change("measuringList", measuringData.map(m => m.key))
  }

  convertDateToString(date) {
    return moment(date, "YYYY-MM-DD HH:mm").toISOString()
  }

  handleSubmit(values) {
    const measuringListUnitStr = values.measuringList.map(item => {

      // console.log(item, "item")
      const itemFind = _.find(this.state.measuringData, (obj)=>{
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
      type: values.type,
      measuringListUnitStr,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData
    })
  }

  handleChangeRanges(ranges) {
    if (_.isNumber(ranges)) {
      this.setState({
        timeRange: ranges,
        fromDate: this.state.receivedAt.clone().subtract(ranges, "days"),
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
      provinceKey: province ? province.key : '',
      stationAutoKey: ""
    })

    this.props.change("stationAuto", "")
  }
  componentDidMount = () => {
    if (this.props.searchNow) {
      this.props.handleSubmit(this.handleSubmit)()
    }
    // console.log(this.props.initialValues, "initialValues")
  }

  searchInit() {
    if (!this.state.isSearchInit) {
      return
    }
    // return
    // NOTE  do gấp, code chạy còn thừa, chưa có time check
    if (
      this.StationType &&
      this.StationType.getFirstValue &&
      this.StationAuto
    ) {
      // console.log('this.props.change',this.props.change)
      this.handleChangeStationType(this.StationType.getFirstValue())
      this.StationType.setFirstValue()
      this.props.change("stationType", this.StationType.getFirstValue().key)

      let stationAutoData = this.StationAuto.getStationAutos()
      if (stationAutoData.length > 0) {
        this.handleChangeStationAuto(stationAutoData[0])
        this.props.change("stationAuto", stationAutoData[0].key)
        this.setState(
          {
            stationAutoKey: stationAutoData[0].key
          },
          () => {
            this.props.handleSubmit(this.handleSubmit)()
          }
        )
      }
    }
  }

  render() {
    const t = this.props.lang.createNameSpace("avgSearchFrom.form")
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
              {this.props.lang.t("addon.search")}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: "8px 16px" }}
        >
          {this.props.lang.t("addon.search")}
        </Heading>
        <Container>
          <Row gutter={16}>
            <Col span={8}>
              <Field
                label={translate("qaqc.province.label")}
                name="province"
                size="large"
                isShowAll
                component={FSelectProvince}
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t("stationType.label")}
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
            <Col span={8}>
              <Field
                label={t("stationAuto.label")}
                name="stationAuto"
                size="large"
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationAuto}
                stationAutoKey={this.state.stationAutoKey}
                setKey
                provinceKey={this.state.provinceKey}
                getRef={ref => {
                  this.StationAuto = ref
                  this.searchInit()
                }}
                onChangeObject={this.handleChangeStationAuto}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={8}>
              <Field
                label={t("measuringList.label")}
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
                label={t("time")}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
                value={this.state.rangesView}
                rangesView={this.state.rangesView}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t("type.label")}
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
