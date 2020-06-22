import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { reduxForm, Field, unregisterField, clearFields } from 'redux-form'
import { Row, Col, Dropdown, Icon, InputNumber } from 'antd'
import update from 'immutability-helper'
import createLang from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import createValidateComponent from 'components/elements/redux-form-validate'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { dataStatusOptions } from 'constants/dataStatus'
// import SelectStationAuto from '../../common/select-station-auto'
import SelectTimeRange from '../../common/select-time-range'
import OptionsTimeRange from '../../common/options-time-range'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import FilterList from '../filter'
import validate from '../utils/validate'
import { listFilter } from '../constants'
import QAQCSetup from '../drawer/QAQCSetup'
// import AdvancedOperator from '../advanced-operator'
// import Clearfix from 'components/elements/clearfix'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectQCVN = createValidateComponent(SelectQCVN)
const FInputNumber = createValidateComponent(InputNumber)
const FSelectStationType = createValidateComponent(SelectStationType)
// const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectTimeRange = createValidateComponent(SelectTimeRange)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)

const HeaderWrapper = styled.div`
  color: blue;
  display: flex;
  align-items: center;
  margin-top: ${props => `${props.top}px`};
  .ant-dropdown-link {
    padding: 8px 0;
  }
`

const SearchFormContainer = styled(BoxShadowStyle)`
  padding: 0;
  .ant-drawer-body {
    padding: 0 !important;
  }
`

const Container = styled.div`
  padding: 16px 16px;
`

const HeadingText = styled.span`
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  > .anticon {
    padding-left: 8px;
    font-size: 14px;
  }
`

@connect((state, ownProps) => ({
  initialValues: {
    ...(ownProps.initialValues
      ? {
          stationType: '',
          provinceKey: '',
          ...ownProps.initialValues,
          rangesDate: Number(ownProps.initialValues.rangesDate) || 1,
          type: Number(ownProps.initialValues.type) || 15,
        }
      : {
          stationType: '',
          provinceKey: '',
          rangesDate: 1,
          type: 15,
        }),
  },
}))
@reduxForm({
  form: 'dataSearchFilterForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})
@connect((state, ownProps) => ({
  values: _.get(state, 'form.dataSearchFilterForm.values', {}),
}))
@createLang
@autobind
export default class SearchAvgForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    searchNow: PropTypes.bool,
    onPreventSave: PropTypes.func,
    onSearchStationAuto: PropTypes.func,
    onChangeSearchData: PropTypes.func,
    flagResetForm: PropTypes.bool,
  }

  static defaultProps = {
    initialValues: {},
  }

  constructor(props) {
    super(props)
    let fromDate = props.initialValues.fromDate
      ? moment(props.initialValues.fromDate)
      : moment().subtract(props.initialValues.rangesDate, 'days')
    let toDate = props.initialValues.toDate
      ? moment(props.initialValues.toDate)
      : moment()
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
      filterList: listFilter.filter(filter => props.initialValues[filter.key]),
      dataStatus: dataStatusOptions.map(option => ({
        ...option,
        name: this.props.lang.t(option.label),
      })),
    }
  }

  async componentDidMount() {
    this.handleChangeSearchData()
    if (this.props.searchNow) {
      let params = {
        stationType: this.props.initialValues.stationType,
        provinceKey: this.props.initialValues.provinceKey,
        dataStatus: this.props.initialValues.dataStatus,
        standardKey: this.props.initialValues.standardKey,
        frequent: this.props.initialValues.frequent,
      }
      await this.props.onSearchStationAuto(params)
      this.props.handleSubmit(this.handleSubmit)()
    }
  }

  handleChangeSearchData = () => {
    const params = {
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      advanced: this.props.values.advanced
        ? this.props.values.advanced.filter(
            item =>
              item.measuringKey &&
              item.operator &&
              item.value !== null &&
              typeof item.value !== 'undefined'
          )
        : [],
    }
    this.props.onChangeSearchData(params)
  }

  async componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.initialValues, this.props.initialValues)) {
      const filterList = listFilter.filter(
        filter => nextProps.initialValues[filter.key]
      )
      this.setState({ filterList })
      this.initializeValue(nextProps)
      if (nextProps.searchNow) {
        let params = {
          stationType: nextProps.values.stationType,
          provinceKey: nextProps.values.provinceKey,
          dataStatus: nextProps.values.dataStatus,
          standardKey: nextProps.values.standardKey,
          frequent: nextProps.values.frequent,
        }
        await this.props.onSearchStationAuto(params)
        this.props.handleSubmit(this.handleSubmit)()
        // this.props.handleSubmit(this.props.onSubmit)()
      }
    }
    if (!_.isEqual(nextProps.flagResetForm, this.props.flagResetForm)) {
      this.initializeValue(this.props)
    }
    if (!_.isEqual(this.props.values, nextProps.values)) {
      if (
        this.props.values.type !== nextProps.values.type ||
        this.props.values.rangesDate !== nextProps.values.rangesDate
      )
        return
      let params = {
        stationType: nextProps.values.stationType,
        provinceKey: nextProps.values.provinceKey,
        dataStatus: nextProps.values.dataStatus,
        standardKey: nextProps.values.standardKey,
        frequent: nextProps.values.frequent,
      }
      await this.props.onSearchStationAuto(params)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.fromDate !== prevState.fromDate ||
      this.state.toDate !== prevState.toDate ||
      !_.isEqual(this.props.values.advanced, prevProps.values.advanced)
    ) {
      const params = {
        fromDate: this.convertDateToString(this.state.fromDate),
        toDate: this.convertDateToString(this.state.toDate),
        advanced: this.props.values.advanced
          ? this.props.values.advanced.filter(
              item =>
                item.measuringKey &&
                item.operator &&
                item.value !== null &&
                typeof item.value !== 'undefined'
            )
          : [],
      }
      this.props.onChangeSearchData(params)
    }
  }

  initializeValue = props => {
    const initialValues = props.initialValues
      ? {
          stationType: '',
          provinceKey: '',
          ...props.initialValues,
          rangesDate: Number(props.initialValues.rangesDate) || 1,
          type: Number(props.initialValues.type) || 15,
        }
      : {
          stationType: '',
          provinceKey: '',
          rangesDate: 1,
          type: 15,
        }
    this.props.initialize(initialValues)
  }

  handleChangeStationType = stationTypeKey => {
    this.setState({
      stationTypeKey: stationTypeKey.key || '',
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

  convertDateToString = date => {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  // handleSubmit = values => {
  // const measuringListUnitStr = values.measuringList.map(item => {
  //   const itemFind = _.find(this.state.measuringData, obj => {
  //     return obj.key === item
  //   })
  //   if (itemFind) {
  //     return encodeURIComponent(_.get(itemFind, 'unit', ''))
  //   } else {
  //     return ''
  //   }
  // })

  // let params = {
  //   fromDate: this.convertDateToString(this.state.fromDate),
  //   toDate: this.convertDateToString(this.state.toDate),
  //   key: values.stationAuto,
  //   name: this.state.stationAutoName,
  //   type: values.type,
  //   measuringListUnitStr,
  //   measuringList: values.measuringList,
  //   measuringData: this.state.measuringData,
  // }

  //   this.props.onSubmit(params)
  // }

  // handleSubmit = values => {
  //   const params = Object.entries(values).reduce((acc, [key, value]) => {
  //     if (value) acc[key] = value
  //     return acc
  //   , {})

  //   // this.props.onSubmit(params)
  //   if (this.props.onSearchStationAuto) {
  //     this.props.onSearchStationAuto(params)
  //   }
  // }

  handleSubmit = values => {
    let params = {
      fromDate: this.convertDateToString(this.state.fromDate),
      toDate: this.convertDateToString(this.state.toDate),
      advanced: values.advanced
        ? values.advanced.filter(
            item =>
              item.measuringKey &&
              item.operator &&
              item.value !== null &&
              typeof item.value !== 'undefined'
          )
        : [],
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
        const [fromDate, toDate] = ranges
        this.setState({ timeRange: null, fromDate, toDate })
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

  handleResetAdvanced = () => {
    this.props.array.removeAll('advanced')
  }

  getComponent = key => {
    switch (key) {
      // case 'stationStatus':
      //   return FSelectAnt
      case 'dataStatus':
        return FSelectAnt
      case 'frequent':
        return FInputNumber
      case 'standardKey':
        return FSelectQCVN
      default:
        return FInputNumber
    }
  }

  // getMeasuringList = () => {
  //   const stations = this.props.stations.filter(station =>
  //     this.props.stationKeys.includes(station.key)
  //   )
  //   const measuringList = stations.reduce((arr, station) => {
  //     if (station.measuringList) {
  //       arr = [...arr, ...station.measuringList]
  //     }
  //     return arr
  //   }, [])

  //   // let measuringListKey = measuringList.map(measuring => measuring.key)

  //   // const measuringListKeyUnit = [...new Set(measuringListKey)]
  //   const measuringListDuplicate = Object.values(
  //     measuringList.reduce((acc, measuring) => {
  //       let key = measuring.key
  //       acc[key] = acc[key] || []
  //       acc[key].push(measuring)
  //       return acc
  //     }, {})
  //   ).reduce((acc, measuringByKey, index, array) => {
  //     if (measuringByKey.length === stations.length) {
  //       acc = [...acc, measuringByKey[0]]
  //     }
  //     return acc
  //   }, [])
  //   return measuringListDuplicate.map(measuring => ({
  //     value: measuring.key,
  //     name: measuring.name,
  //   }))
  // }

  handleSetupQAQC = () => {
    this.QAQCSetup.handleOpen()
  }

  rightChildren() {
    return (
      <HeadingText onClick={this.handleSetupQAQC}>
        {this.props.lang.t('qaqcConfig.title')}
        <Icon type="down" />
      </HeadingText>
    )
  }

  render() {
    // const measuringList = this.getMeasuringList()
    const t = this.props.lang.createNameSpace('dataSearchFilterForm.form')
    return (
      <SearchFormContainer>
        <Heading
          rightChildren={this.rightChildren()}
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {this.props.lang.t('addon.searchSelect')}
        </Heading>
        {/* <HeaderWrapper>
          <Dropdown
            trigger={['click']}
            overlay={
              <FilterList
                initialValues={this.props.initialValues}
                onChange={this.handleChangeFilter}
              />
            }
          >
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Icon type="plus" /> {this.props.lang.t('addon.add')}
            </a>
          </Dropdown>
        </HeaderWrapper> */}
        <Container>
          <Row type="flex" gutter={[16, 24]} align="middle">
            <Col span={6}>
              <Field
                label={t(`province.label`)}
                name="provinceKey"
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
                showSearch
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
            {/* <Col span={6}>
              <Field
                label={t('stationAuto.label')}
                placeholder={t('stationAuto.placeholder')}
                name="stationAuto"
                onChangeObject={this.handleChangeStationAuto}
                stationTypeKey={_.get(this.props.values, 'stationType', null)}
                provinceKey={_.get(this.props.values, 'province', null)}
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
            </Col> */}
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
                  style={{ width: '100%' }}
                  // alowClear
                  mode="multiple"
                  options={this.state[filter.key]}
                  placeholder={t(`${filter.key}.placeholder`)}
                  component={this.getComponent(filter.key)}
                />
              </Col>
            ))}
            <Col span={6}>
              <HeaderWrapper
                top={this.state.filterList.length % 4 === 0 ? 0 : 28}
              >
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <FilterList
                      initialValues={this.props.initialValues}
                      onChange={this.handleChangeFilter}
                    />
                  }
                >
                  <a
                    className="ant-dropdown-link"
                    onClick={e => e.preventDefault()}
                  >
                    <Icon type="plus" />{' '}
                    {this.props.lang.t('addon.addCondition')}
                  </a>
                </Dropdown>
              </HeaderWrapper>
            </Col>
          </Row>
          {/* {measuringList.length ? (
            <React.Fragment>
              <Clearfix height={40} />
              <AdvancedOperator
                onReset={this.handleResetAdvanced}
                measuringList={measuringList}
              />
            </React.Fragment>
          ) : null} */}
        </Container>
        <QAQCSetup ref={ref => (this.QAQCSetup = ref)} />
      </SearchFormContainer>
    )
  }
}
