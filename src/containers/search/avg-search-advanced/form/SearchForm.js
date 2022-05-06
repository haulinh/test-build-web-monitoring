import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  InputNumber,
  Row,
  Switch,
  Tooltip,
} from 'antd'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { dataStatusOptions } from 'constants/dataStatus'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import SelectMeasureParameter from 'containers/data-analytics/filter/select-measure-parameter'
import SelectStationAuto from 'containers/data-analytics/filter/select-station-auto'
import { autobind } from 'core-decorators'
import createLang, { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import * as _ from 'lodash'
import { get } from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getTimes } from 'utils/datetime'
import OptionsTimeRange from '../../common/options-time-range'
import SelectTimeRange from '../../common/select-time-range'
import { FIELDS, listFilter } from '../constants'
import FilterList from '../filter'
import { ToolTip } from './../../common/tooltip'

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

const options = {
  dataStatus: dataStatusOptions.map(option => ({
    ...option,
    name: translate(option.label),
  })),
}

@Form.create()
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

  stationAutos = new Map()

  constructor(props) {
    super(props)
    const { fromDate, toDate } = props.values
    let rangesView = null

    if (props.initialValues.rangesDate === 'ranges') {
      rangesView = `${moment(fromDate).format(DD_MM_YYYY_HH_MM)} -
      ${moment(toDate).format(DD_MM_YYYY_HH_MM)}`
    }

    this.state = {
      rangesView,
      filterList: listFilter().filter(
        filter => props.initialValues[filter.key]
      ),
      isFilter: false,
      measuringList: [],
    }
  }

  async componentDidMount() {
    const {
      searchNow,
      initialValues,
      onSearchStationAuto,
      handleSubmit,
    } = this.props

    if (searchNow) {
      const searchStationData = this.getSearchStationData(initialValues)
      await onSearchStationAuto(searchStationData)
      handleSubmit(this.handleSubmit)()
    }
  }
  getSearchStationData = newProps => {
    return {
      stationType: newProps.stationType,
      provinceKey: newProps.provinceKey,
      standardKey: newProps.standardKey,
      frequent: newProps.frequent,
      activatedAt: newProps.activatedAt,
      typeSampling: newProps.typeSampling,
      isFilter: newProps.isFilter || false,
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.initialValues, this.props.initialValues) ||
      !_.isEqual(nextProps.flagResetForm, this.props.flagResetForm)
    ) {
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
        filterList: listFilter().filter(
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

    const { from, to } = getTimes(ranges)
    change('fromDate', from.toISOString())
    change('toDate', to.toISOString())
    this.setState({
      timeRange: ranges,
      fromDate: from,
      toDate: to,
    })
  }

  handleChangeFilter = filter => {
    const { filterList } = this.state
    console.log(filter)
    const index = filterList.findIndex(item => item.key === filter.key)
    if (index < 0) {
      this.setState(prevState =>
        update(prevState, {
          filterList: {
            $push: [filter],
          },
        })
      )
    } else {
      this.setState(prevState =>
        update(prevState, {
          filterList: {
            $splice: [[index, 1]],
          },
        })
      )
    }
  }

  handleResetAdvanced = () => {
    this.props.array.removeAll('advanced')
  }

  handleRemoveItemAdvanced = index => {
    this.props.array.remove('advanced', index)
  }

  getMeasuringList = stationAutoKeys =>
    (stationAutoKeys || []).reduce((map, key) => {
      const stationAuto = this.stationAutos.get(key) || {}
      const measuringList = stationAuto.measuringList || []
      measuringList.forEach(measure => map.set(measure.key, measure))
      return map
    }, new Map())

  handleRemoveField = filterKey => () => {
    if (this.filterListRef) {
      this.filterListRef.handleOnChange(filterKey)()
    } else {
      this.setState(prevState =>
        update(prevState, {
          filterList: {
            $apply: oldData =>
              oldData.filter(filter => filter.key !== filterKey),
          },
        })
      )
    }
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    this.stationTypes = stationTypes
    const stationType = get(stationTypes, '0.key')
    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationType })
  }

  onFetchStationAutoSuccess = stationAutos => {
    const { form } = this.props
    this.setStationAutos(stationAutos)

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const province = form.getFieldValue(FIELDS.PROVINCE)
    const stationAutoKeys = this.getStationAutoKeys({ stationType, province })

    this.updateForm({ stationAutoKeys })
  }

  setStationAutos = stationAutos =>
    stationAutos.map(item => this.stationAutos.set(item.key, item))

  getStationAutoKeys = ({ province, stationType }) => {
    return [...this.stationAutos]
      .filter(item => get(item, `1.stationType.key`) === stationType)
      .filter(item => !province || get(item, `1.province.key`) === province)
      .map(item => get(item, '1.key'))
  }

  updateForm = ({ stationAutoKeys }) => {
    const { form } = this.props

    const measuringList = this.getMeasuringList(stationAutoKeys)
    const getMap = (map, order) => [...map].map(item => item[order])

    this.setState({ measuringList: getMap(measuringList, 1) })

    form.setFieldsValue({
      [FIELDS.STATION_AUTO]: stationAutoKeys,
      [FIELDS.MEASURING_LIST]: getMap(measuringList, 0),
    })
  }

  getComponent = (key, mode) => {
    switch (key) {
      case 'dataStatus':
        return (
          <SelectAnt
            options={options.dataStatus}
            style={{ width: '100%' }}
            mode={mode}
            maxTagTextLength={window.innerWidth > 1600 ? 20 : 5}
            placeholder="Chọn tình trạng dữ liệu"
          />
        )
      case 'frequent':
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập tần suất (phút/lần)"
          />
        )
      case 'standardKey':
        return <SelectQCVN placeholder="Chọn quy chuẩn" />
      default:
        return <InputNumber />
    }
  }

  getFilterInitialValue = key => {
    if (key === 'dataStatus')
      return dataStatusOptions.map(option => option.value)
    return
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFilterForm.form')
    const { form } = this.props
    const { measuringList, filterList } = this.state

    const values = form.getFieldsValue([
      FIELDS.STATION_AUTO,
      FIELDS.MEASURING_LIST,
    ])

    const numberStation = (values[FIELDS.STATION_AUTO] || []).length
    const numberMeasure = (values[FIELDS.MEASURING_LIST] || []).length

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              size="small"
              // onClick={this.handleSearch}
              // loading={isLoadingData}
            >
              {'Tìm kiếm'}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {this.props.lang.t('addon.searchSelect')}
        </Heading>
        <Container>
          <Row gutter={20}>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={t(`province.label`)}>
                {form.getFieldDecorator(FIELDS.PROVINCE, {
                  initialValue: '',
                })(<SelectProvince isShowAll />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={t('stationType.label')}>
                {form.getFieldDecorator(
                  FIELDS.STATION_TYPE,
                  {}
                )(
                  <SelectStationType
                    onFetchSuccess={this.onFetchStationTypeSuccess}
                  />
                )}
              </FormItem>
            </Col>

            <Col md={8} lg={8} sm={12}>
              <FormItem label={t(`time`)}>
                {form.getFieldDecorator(FIELDS.RANGE_TIME, {
                  initialValue: 1,
                })(<OptionsTimeRange style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={4} lg={4} sm={12}>
              <FormItem label={t('type.label')}>
                {form.getFieldDecorator(FIELDS.TYPE, { initialValue: 15 })(
                  <SelectTimeRange style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col>
              <FormItem label={`Trạm quan trắc (${numberStation} trạm)`}>
                {form.getFieldDecorator(
                  FIELDS.STATION_AUTO,
                  {}
                )(
                  <SelectStationAuto
                    stationType={form.getFieldValue(FIELDS.STATION_TYPE)}
                    province={form.getFieldValue(FIELDS.PROVINCE)}
                    onFetchSuccess={this.onFetchStationAutoSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                label={`Các thông số quan trắc (${numberMeasure} thông số)`}
              >
                {form.getFieldDecorator(
                  FIELDS.MEASURING_LIST,
                  {}
                )(<SelectMeasureParameter options={measuringList} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            {filterList.map(filter => (
              <Col span={8}>
                <Flex>
                  <FormItem label={t(`${filter.key}.label`)}>
                    {form.getFieldDecorator(filter.key, {
                      initialValue: this.getFilterInitialValue(filter.key),
                    })(this.getComponent(filter.key, filter.mode))}
                  </FormItem>
                  <Icon
                    onClick={this.handleRemoveField(filter.key)}
                    className="remove-field"
                    type="close-circle"
                    theme="filled"
                  />
                </Flex>
              </Col>
            ))}
            {filterList.length < 3 && (
              <Col span={6} style={{ alignSelf: 'center' }}>
                <HeaderWrapper
                  top={this.state.filterList.length % 4 === 0 ? 0 : 28}
                >
                  <Tooltip
                    placement="top"
                    title={translate(
                      'dataSearchFilterForm.tooltip.addCondition'
                    )}
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
            )}
          </Row>
          <Row type="flex" justify="end">
            <Col>
              <div
                style={{
                  display: 'flex',
                  width: '205px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ToolTip />
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {translate('dataSearchFrom.processData')}
                </div>
                <FormItem>
                  {form.getFieldDecorator(
                    'isFilter',
                    {}
                  )(<Switch style={{ marginTop: '18px' }} />)}
                </FormItem>
              </div>
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
