import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { get as _get } from 'lodash'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { reduxForm, Field, unregisterField, clearFields } from 'redux-form'
import { Row, Col, Button, Dropdown, Icon, InputNumber } from 'antd'
import update from 'immutability-helper'
import createLang from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectAnt from 'components/elements/select-ant'
import createValidateComponent from 'components/elements/redux-form-validate'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { stationStatusOptions } from 'constants/stationStatus'
import SelectStationAuto from '../../common/select-station-auto'
import SelectTimeRange from '../../common/select-time-range'
import SelectProvince from 'components/elements/select-province'
import OptionsTimeRange from '../../common/options-time-range'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import FilterList from '../filter'
import validate from '../utils/validate'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectQCVN = createValidateComponent(SelectQCVN)
const FInputNumber = createValidateComponent(InputNumber)
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectTimeRange = createValidateComponent(SelectTimeRange)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

const HeaderWrapper = styled.div`
  color: blue;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
  .ant-dropdown-link {
    padding: 8px 16px;
  }
`

const SearchFormContainer = styled(BoxShadowStyle)``

const Container = styled.div`
  padding: 16px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .ant-row-flex {
    flex: 1;
    margin-right: 16px;
    .ant-input-number-lg {
      width: 100%;
    }
  }
`

@reduxForm({
  form: 'dataSearchFilterForm',
  validate,
})
@connect((state, ownProps) => ({
  values: _get(state, 'form.dataSearchFilterForm.values', {}),
}))
@createLang
@autobind
export default class SearchAvgForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    searchNow: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    let fromDate = moment(props.initialValues.fromDate)
    let toDate = moment(props.initialValues.toDate)
    let timeRange = props.initialValues.rangesDate
    let rangesView = null
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
      filterList: [],
      dataStatus: stationStatusOptions.map(option => ({
        ...option,
        name: this.props.lang.t(option.label),
      })),
    }
  }

  handleChangeStationType = stationTypeKey => {
    this.setState({
      stationTypeKey: stationTypeKey ? stationTypeKey.key : '',
      stationAutoKey: '',
    })
    this.props.change('stationAuto', '')
  }

  handleChangeStationAuto = stationAuto => {
    let params = {}
    if (!stationAuto) return
    const measuringData = stationAuto.measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })

    params = {
      measuringList: measuringData.map(measuring => ({
        value: measuring.key,
        name: measuring.name,
      })),
      measuringData: measuringData,
      stationAutoKey: stationAuto.key,
      stationAutoName: stationAuto.name,
      receivedAt: moment(),
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

    this.props.change(
      'measuringList',
      measuringData.map(m => m.key)
    )
  }

  convertDateToString = date => moment(date, 'YYYY-MM-DD HH:mm').toISOString()

  handleSubmit = values => {
    const measuringListUnitStr = values.measuringList.map(item => {
      const itemFind = _.find(this.state.measuringData, obj => {
        return obj.key === item
      })
      if (itemFind) {
        return encodeURIComponent(_.get(itemFind, 'unit', ''))
      } else {
        return ''
      }
    })

    let params = {
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      type: values.type,
      measuringListUnitStr,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
    }

    if (values.dataStatus) {
      params.dataStatus = values.dataStatus
    }
    if (values.frequency) {
      params.frequency = values.frequency
    }
    if (values.qcvn) {
      params.qcvn = values.qcvn
    }

    this.props.onSubmit(params)
  }

  handleChangeRanges = ranges => {
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

  handleProvinceChange = province => {
    this.setState({
      provinceKey: province ? province.key : '',
      stationAutoKey: '',
    })

    this.props.change('stationAuto', null)
  }

  componentDidMount() {
    const initialValues = this.props.initialValues
      ? {
          stationAuto: null,
          stationType: null,
          province: null,
          measuringList: [],
          ...this.props.initialValues,
          rangesDate: 1,
          type: 15,
        }
      : {
          stationAuto: null,
          stationType: null,
          province: null,
          measuringList: [],
        }

    this.props.initialize(initialValues)
    if (this.props.searchNow) {
      this.props.handleSubmit(this.handleSubmit)()
    }
  }

  searchInit = () => {
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
      this.handleChangeStationType(this.StationType.getFirstValue())
      this.StationType.setFirstValue()
      this.props.change('stationType', this.StationType.getFirstValue().key)

      let stationAutoData = this.StationAuto.getStationAutos()
      if (stationAutoData.length > 0) {
        this.handleChangeStationAuto(stationAutoData[0])
        this.props.change('stationAuto', stationAutoData[0].key)
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

  handleChangeFilter = filter => {
    const { dispatch, form } = this.props
    const index = this.state.filterList.findIndex(
      item => item.key === filter.key
    )
    if (index < 0) {
      this.setState(prevState =>
        update(prevState, {
          filterList: {
            $push: [filter],
          },
        })
      )
    } else {
      this.setState(
        prevState =>
          update(prevState, {
            filterList: {
              $splice: [[index, 1]],
            },
          }),
        () => {
          dispatch(unregisterField(form, filter.key))
          dispatch(clearFields(form, false, false, filter.key))
        }
      )
    }
  }

  getComponent = key => {
    switch (key) {
      // case 'stationStatus':
      //   return FSelectAnt
      case 'dataStatus':
        return FSelectAnt
      case 'frequency':
        return FInputNumber
      case 'qcvn':
        return FSelectQCVN
      default:
        return FInputNumber
    }
  }

  render() {
    console.log(this.props.values)
    const t = this.props.lang.createNameSpace('dataSearchFilterForm.form')
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
        <HeaderWrapper>
          <Dropdown
            trigger={['click']}
            overlay={<FilterList onChange={this.handleChangeFilter} />}
          >
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Icon type="plus" /> Thêm bộ lọc
            </a>
          </Dropdown>
        </HeaderWrapper>
        <Container>
          <Row type="flex" gutter={[16, 24]}>
            <Col span={6}>
              <Field
                label={t(`province.label`)}
                name="province"
                size="large"
                showSearch
                isShowAll
                placeholder={t('province.placeholder')}
                component={FSelectProvince}
                onHandleChange={this.handleProvinceChange}
              />
            </Col>
            <Col span={6}>
              <Field
                isShowAll
                label={t('stationType.label')}
                name="stationType"
                size="large"
                placeholder={t('stationType.placeholder')}
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
                placeholder={t('stationAuto.placeholder')}
                name="stationAuto"
                onChangeObject={this.handleChangeStationAuto}
                stationTypeKey={_get(this.props.values, 'stationType', null)}
                provinceKey={_get(this.props.values, 'province', null)}
                size="large"
                component={FSelectStationAuto}
              />
            </Col>
            <Col span={6}>
              <Field
                label={t('measuringList.label')}
                name="measuringList"
                placeholder={t('measuringList.placeholder')}
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
                value={this.state.rangesView}
                rangesView={this.state.rangesView}
              />
            </Col>
            <Col span={6}>
              <Field
                label={t('type.label')}
                name="type"
                size="large"
                component={FSelectTimeRange}
              />
            </Col>
            {this.state.filterList.map(filter => (
              <Col span={6} key={filter.key}>
                <Field
                  label={t(`${filter.key}.label`)}
                  name={filter.key}
                  size="large"
                  showSearch
                  alowClear
                  mode="multiple"
                  options={this.state[filter.key]}
                  placeholder={t(`${filter.key}.placeholder`)}
                  component={this.getComponent(filter.key)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
