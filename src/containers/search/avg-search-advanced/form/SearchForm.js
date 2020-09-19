import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { reduxForm, Field, unregisterField, clearFields } from 'redux-form'
import { Row, Col, Dropdown, Icon, InputNumber, Tooltip } from 'antd'
import update from 'immutability-helper'
import createLang, { translate } from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectDatePicker from 'components/elements/datetime-picker'
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
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const FSelectProvince = createValidateComponent(SelectProvince)
const FSelectQCVN = createValidateComponent(SelectQCVN)
const FInputNumber = createValidateComponent(InputNumber)
const FSelectStationType = createValidateComponent(SelectStationType)
// const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FSelectTimeRange = createValidateComponent(SelectTimeRange)
const FSelectAnt = createValidateComponent(SelectAnt)
const FOptionsTimeRange = createValidateComponent(OptionsTimeRange)
const FOptionsDatePicker = createValidateComponent(SelectDatePicker)

const initializeValue = (props, callback) => {
  const initialValues = props.initialValues
    ? {
      stationType: 'ALL',
      provinceKey: '',
      ...props.initialValues,
      rangesDate:
        Number(props.initialValues.rangesDate) ||
        props.initialValues.rangesDate ||
        1,
      type:
        Number(props.initialValues.type) || props.initialValues.type || 15,
      fromDate: props.initialValues.fromDate
        ? props.initialValues.fromDate
        : moment()
          .subtract(props.initialValues.rangesDate || 1, 'days')
          .toISOString(),
      toDate: props.initialValues.toDate
        ? props.initialValues.toDate
        : moment().toISOString(),
    }
    : {
      stationType: '',
      provinceKey: '',
      rangesDate: 1,
      type: 15,
      fromDate: moment()
        .subtract(1, 'days')
        .toISOString(),
      toDate: moment().toISOString(),
    }
  callback(initialValues)
}

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

const Flex = styled.div`
  position: relative;
  :hover {
    .remove-field {
      display: initial;
    }
  }
  .remove-field {
    position: absolute;
    display: none;
    top: 10px;
    right: 0;
    :hover {
      cursor: pointer;
    }
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

const options = {
  typeSampling: [
    { name: 'FTP', value: 'FTP' },
    { name: 'INVENTIA', value: 'INVENTIA' },
  ],
  dataStatus: dataStatusOptions.map(option => ({
    ...option,
    name: translate(option.label),
  })),
}

// rangeView
@reduxForm({
  form: 'dataSearchFilterForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true,
})
@connect(state => ({
  values: _.get(state, 'form.dataSearchFilterForm.values', {}),
}))
@createLang
@autobind
export default class SearchAvgForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    searchNow: PropTypes.bool,
    onSubmit: PropTypes.func,
    onPreventSave: PropTypes.func,
    onSearchStationAuto: PropTypes.func,
    flagResetForm: PropTypes.bool,
  }

  static defaultProps = {
    initialValues: {},
  }

  constructor(props) {
    super(props)
    initializeValue(props, props.initialize)
    const { fromDate, toDate } = props.values
    let rangesView = null

    if (props.initialValues.rangesDate === 'ranges') {
      rangesView = `${moment(fromDate).format(DD_MM_YYYY_HH_MM)} -
      ${moment(toDate).format(DD_MM_YYYY_HH_MM)}`
    }

    this.state = {
      rangesView,
      filterList: listFilter.filter(filter => props.initialValues[filter.key]),
    }
  }

  async componentDidMount() {
    if (this.props.searchNow) {
      const searchStationData = this.getSearchStationData(
        this.props.initialValues
      )
      await this.props.onSearchStationAuto(searchStationData)
      this.props.handleSubmit(this.handleSubmit)()
    }
  }
  getSearchStationData = newProps => {
    return {
      stationType: newProps.stationType,
      provinceKey: newProps.provinceKey,
      // dataStatus: newProps.dataStatus,
      standardKey: newProps.standardKey,
      frequent: newProps.frequent,
      activatedAt: newProps.activatedAt,
      typeSampling: newProps.typeSampling,
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.initialValues, this.props.initialValues) ||
      !_.isEqual(nextProps.flagResetForm, this.props.flagResetForm)
    ) {
      initializeValue(nextProps, this.props.initialize)
      // Change time
      const { fromDate, toDate } = nextProps.values
      let rangesView = null
      if (nextProps.initialValues.rangesDate === 'ranges') {
        rangesView = `${moment(fromDate).format(DD_MM_YYYY_HH_MM)} - ${moment(
          toDate
        ).format(DD_MM_YYYY_HH_MM)}`
      }
      this.setState({
        rangesView,
        filterList: listFilter.filter(
          filter => nextProps.initialValues[filter.key]
        ),
      })
    }
    const nextValues = _.clone(nextProps.values)
    const currentValues = _.clone(this.props.values)

    const listKeys = [
      'type',
      'rangesDate',
      'dataStatus',
      'advanced',
      'fromDate',
      'toDate',
    ]
    listKeys.forEach(key => {
      delete nextValues[key]
      delete currentValues[key]
    })
    if (!_.isEqual(nextProps.values, this.props.values)) {
      if (!_.isEqual(nextValues, currentValues)) {
        const searchStationData = this.getSearchStationData(nextProps.values)
        await this.props.onSearchStationAuto(searchStationData)
        if (nextProps.searchNow) {
          this.props.handleSubmit(this.handleSubmit)()
        }
      }
    }
  }

  handleSubmit = () => {
    this.props.onSubmit()
  }

  handleChangeRanges = ranges => {
    const { change } = this.props
    if (_.isNumber(ranges)) {
      const fromDate = moment().subtract(ranges, 'days')
      const toDate = moment()
      change('fromDate', fromDate.toISOString())
      change('toDate', toDate.toISOString())

      this.setState({
        timeRange: ranges,
        fromDate,
        toDate,
        rangesView: '',
      })
    } else {
      if (_.size(ranges) > 1) {
        const [fromDate, toDate] = ranges
        change('fromDate', fromDate.toISOString())
        change('toDate', toDate.toISOString())
        this.setState({
          timeRange: null,
          fromDate,
          toDate,
          rangesView: `${fromDate.format(DD_MM_YYYY_HH_MM)} - ${toDate.format(
            DD_MM_YYYY_HH_MM
          )}`,
        })
      }
    }
  }

  handleChangeFilter = filter => {
    const { dispatch, form, change } = this.props
    const index = this.state.filterList.findIndex(
      item => item.key === filter.key
    )
    if (index < 0) {
      this.setState(
        prevState =>
          update(prevState, {
            filterList: {
              $push: [filter],
            },
          }),
        () => {
          if (filter.default) {
            change(filter.key, filter.default)
          }
        }
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
          change(filter.key, null)
          dispatch(unregisterField(form, filter.key))
          dispatch(clearFields(form, false, false, filter.key))
        }
      )
    }
  }

  handleResetAdvanced = () => {
    this.props.array.removeAll('advanced')
  }

  handleRemoveItemAdvanced = index => {
    this.props.array.remove('advanced', index)
  }

  getComponent = key => {
    switch (key) {
      // case 'stationStatus':
      //   return FSelectAnt
      case 'dataStatus':
      case 'typeSampling':
        return FSelectAnt
      case 'frequent':
        return FInputNumber
      case 'standardKey':
        return FSelectQCVN
      case 'activatedAt':
        return FOptionsDatePicker
      default:
        return FInputNumber
    }
  }

  getMeasuringList = () => {
    const stations = this.props.stations.filter(station =>
      this.props.stationKeys.includes(station.key)
    )
    const measuringList = stations.reduce((arr, station) => {
      if (station.measuringList) {
        arr = [...arr, ...station.measuringList]
      }
      return arr
    }, [])

    // let measuringListKey = measuringList.map(measuring => measuring.key)

    // const measuringListKeyUnit = [...new Set(measuringListKey)]
    const measuringListDuplicate = Object.values(
      measuringList.reduce((acc, measuring) => {
        let key = measuring.key
        acc[key] = acc[key] || []
        acc[key].push(measuring)
        return acc
      }, {})
    ).reduce((acc, measuringByKey, index, array) => {
      // if (measuringByKey.length === stations.length) {
      acc = [...acc, measuringByKey[0]]
      // }
      return acc
    }, [])
    return measuringListDuplicate.map(measuring => ({
      value: measuring.key,
      name: measuring.name,
    }))
  }

  handleSetupQAQC = () => {
    this.QAQCSetup.handleOpen()
  }

  handleRemoveField = filterKey => () => {
    const { dispatch, form, change } = this.props
    if (this.filterListRef) {
      this.filterListRef.handleOnChange(filterKey)()
    } else {
      this.setState(
        prevState =>
          update(prevState, {
            filterList: {
              $apply: oldData =>
                oldData.filter(filter => filter.key !== filterKey),
            },
          }),
        () => {
          change(filterKey, null)
          dispatch(unregisterField(form, filterKey))
          dispatch(clearFields(form, false, false, filterKey))
        }
      )
    }
  }

  rightChildren() {
    return protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.EDIT)(
      <Tooltip
        placement="top"
        title={translate('dataSearchFilterForm.tooltip.configQAQC')}
      >
        <HeadingText onClick={this.handleSetupQAQC}>
          {this.props.lang.t('qaqcConfig.title')}
          <Icon type="down" />
        </HeadingText>
      </Tooltip>
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
        <Container>
          <Row type="flex" gutter={[16, 24]}>
            <Col span={6}>
              <Field
                label={t(`province.label`)}
                name="provinceKey"
                size="large"
                showSearch
                isShowAll
                placeholder={t('province.placeholder')}
                component={FSelectProvince}
              // onHandleChange={this.handleProvinceChange}
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
                component={FSelectStationType}
                getRef={ref => {
                  this.StationType = ref
                }}
              />
            </Col>

            <Col span={6}>
              <Field
                label={t('time')}
                name="rangesDate"
                size="large"
                onChangeObject={this.handleChangeRanges}
                component={FOptionsTimeRange}
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
                <Flex>
                  <Field
                    label={t(`${filter.key}.label`)}
                    name={filter.key}
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    // alowClear
                    mode={filter.mode}
                    options={options[filter.key]}
                    placeholder={t(`${filter.key}.placeholder`)}
                    component={this.getComponent(filter.key)}
                  />
                  <Icon
                    onClick={this.handleRemoveField(filter.key)}
                    className="remove-field"
                    type="close-circle"
                    theme="filled"
                  />
                </Flex>
              </Col>
            ))}
            <Col span={6} style={{ alignSelf: 'center' }}>
              <HeaderWrapper
                top={this.state.filterList.length % 4 === 0 ? 0 : 28}
              >
                <Tooltip
                  placement="top"
                  title={translate('dataSearchFilterForm.tooltip.addCondition')}
                >
                  <Dropdown
                    trigger={['click']}
                    ref={ref => (this.a = ref)}
                    overlay={
                      <FilterList
                        listFilter={this.state.filterList}
                        ref={ref => (this.filterListRef = ref)}
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
                </Tooltip>
              </HeaderWrapper>
            </Col>
          </Row>
          {/* {measuringList.length ? (
            <React.Fragment>
              <Clearfix height={40} />
              <AdvancedOperator
                onReset={this.handleResetAdvanced}
                onRemoveItem={this.handleRemoveItemAdvanced}
                measuringList={measuringList}
                value={this.props.values.advanced}
              />
            </React.Fragment>
          ) : null} */}
        </Container>
        {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.EDIT)(
          <QAQCSetup
            stationType={this.props.values.stationType}
            ref={ref => (this.QAQCSetup = ref)}
          />
        )}
      </SearchFormContainer>
    )
  }
}
