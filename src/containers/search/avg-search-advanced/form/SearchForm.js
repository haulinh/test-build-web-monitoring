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
import SortableMultiSelect from 'components/core/select/SortableMultiSelect'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectStationType from 'components/elements/select-station-type'
import ToolTipHint from 'components/elements/tooltip'
import { FormItem } from 'components/layouts/styles'
import { dataStatusOptions } from 'constants/dataStatus'
import SelectStationAuto from 'containers/data-analytics/filter/select-station-auto'
import { translate as t, translate } from 'hoc/create-lang'
import createQueryFormDataBrowser from 'hoc/query-formdata-browser'
import { get, isEmpty, isEqual, isNumber } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import styled from 'styled-components'
import { getTimes } from 'utils/datetime'
import { requiredFieldRule } from 'utils/rules'
import SelectTimeRange from '../../common/select-time-range'
import { FIELDS, i18n } from '../constants'
import FilterList from '../filter'

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

@Form.create({
  onFieldsChange: props => {
    const { onChangeField } = props
    onChangeField()
  },
})
// @createLang
@createQueryFormDataBrowser()
export default class SearchAvgForm extends React.Component {
  stationAutos = new Map()

  constructor(props) {
    super(props)
    this.state = {
      isFilter: false,
      otherConditionFilter: [],
      fromDate: moment()
        .subtract(1, 'days')
        .toDate(),
      toDate: moment().toDate(),
      measuringList: [],
      stationsData: [],
      stationTypes: [],
      stationAutosValue: [],
    }
  }

  componentDidMount = () => {
    const { formData, form } = this.props
    if (isEmpty(formData)) return
    const initValues = this.getInitValuesFormData()
    form.setFieldsValue(initValues)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      formData,
      setFilterDefault,
      otherCondition,
      filterSearch,
      form,
    } = this.props

    if (!isEqual(prevProps.formData, formData)) {
      const filterDefault = this.getFilterDefault()
      this.setState({ otherConditionFilter: [] })
      setFilterDefault(filterDefault)
    }

    if (!isEqual(prevProps.filterSearch, filterSearch)) {
      if (isEmpty(filterSearch)) {
        this.setState({ otherConditionFilter: [] })
      }

      this.setState({ otherConditionFilter: otherCondition }, () => {
        form.setFieldsValue(filterSearch)
        this.handleSearch()
      })
    }
  }

  getInitValuesFormData = () => {
    const { formData } = this.props
    const from = moment(formData.fromDate).toDate()
    const to = moment(formData.toDate).toDate()
    const time = [from, to]

    const initValues = {
      [FIELDS.PROVINCE]: '',
      [FIELDS.STATION_TYPE]: formData.stationType,
      [FIELDS.MEASURING_LIST]: formData.measuringList,
      [FIELDS.RANGE_TIME]: time,
      [FIELDS.TYPE]: 15,
      [FIELDS.STATION_AUTO]: formData.stationAuto.split(','),
      isFilter: false,
      frequent: undefined,
    }

    return initValues
  }

  handleChangeFilter = filter => {
    const { otherConditionFilter } = this.state
    const index = otherConditionFilter.findIndex(
      item => item.key === filter.key
    )
    if (index < 0) {
      this.setState({
        otherConditionFilter: [...otherConditionFilter, filter],
      })
    } else {
      const newOtherConditionFilter = otherConditionFilter.filter(
        condition => condition.key !== filter.key
      )
      this.setState({
        otherConditionFilter: newOtherConditionFilter,
      })
    }
  }

  getMeasuringList = stationAutoKeys =>
    (stationAutoKeys || []).reduce((map, key) => {
      const stationAuto = this.stationAutos.get(key) || {}
      const measuringList = stationAuto.measuringList || []
      measuringList.forEach(measure => map.set(measure.key, measure))
      return map
    }, new Map())

  handleRemoveField = filterKey => () => {
    const { form } = this.props
    const { otherConditionFilter } = this.state

    this.setState({
      otherConditionFilter: otherConditionFilter.filter(
        item => item.key !== filterKey
      ),
    })

    const { stationType, provinceKey, standardKey } = form.getFieldsValue()

    const params = {
      stationType,
      provinceKey,
      standardKey,
    }

    this.handleStationAutoKeys(params)
    this.setState({
      stationAutosValue: this.getStationAutosValue(params),
    })
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form, formData } = this.props
    this.setState({ stationTypes: stationTypes.map(type => type.key) })

    const stationType = get(stationTypes, '0.key')
    const province = form.getFieldValue(FIELDS.PROVINCE)

    if (!isEmpty(formData)) return

    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationType })
    this.handleStationAutoKeys({ stationType, province })
    this.handleSearch()
  }

  getFilterDefault = () => {
    const { stationTypes } = this.state

    const stationAutos = this.getStationAutoKeys(stationTypes[0], '')
    const measuringList = this.getMeasuringList(stationAutos)
    const measuringKeys = [...measuringList].map(([measureKeys]) => measureKeys)

    const filterDefault = {
      [FIELDS.PROVINCE]: '',
      [FIELDS.STATION_TYPE]: stationTypes[0],
      [FIELDS.MEASURING_LIST]: measuringKeys,
      [FIELDS.RANGE_TIME]: 1,
      [FIELDS.TYPE]: 15,
      [FIELDS.STATION_AUTO]: stationAutos,
      isFilter: false,
      frequent: undefined,
    }
    return filterDefault
  }

  onFetchStationAutoSuccess = stationAutos => {
    const { form, formData, setFilterDefault } = this.props
    this.setStationAutos(stationAutos)
    const { stationType, provinceKey } = form.getFieldsValue()

    if (!isEmpty(formData)) {
      this.updateForm({ stationAutoKeys: [formData.stationAuto] })
    } else {
      const filterDefault = this.getFilterDefault()
      setFilterDefault(filterDefault)
      const params = { stationType, province: provinceKey }

      this.handleStationAutoKeys(params)
      this.setState({
        stationAutosValue: this.getStationAutosValue(params),
      })
    }

    this.handleSearch()
  }

  setStationAutos = stationAutos =>
    stationAutos.map(item => this.stationAutos.set(item.key, item))

  handleStationAutoKeys = ({ stationType, province, frequency, standard }) => {
    //get stationAutoKeys with specific province, stationType, frequency, standard in form
    const params = {
      stationType,
      province,
      frequency,
      standard,
    }
    const stationAutoKeys = this.getStationAutoKeys(params)

    this.updateForm({ stationAutoKeys })
  }

  getStationAutoKeys = ({ stationType, province, frequency, standard }) => {
    const params = {
      stationType,
      province,
      frequency,
      standard,
    }
    const stationAutoKeys = this.getStationAutosValue(params).map(station =>
      get(station, 'key')
    )

    return stationAutoKeys
  }

  getStationAutosValue = ({ stationType, province, frequency, standard }) => {
    const stationAutosValue = [...this.stationAutos]
      .map(([_, station]) => station)
      .filter(station => get(station, `stationType.key`) === stationType)
      .filter(station => !province || get(station, `province.key`) === province)
      .filter(station =>
        isNumber(frequency) ? get(station, `dataFrequency`) === frequency : true
      )
      .filter(station =>
        standard ? get(station, `standardsVN.key`) === standard : true
      )

    return stationAutosValue
  }

  updateForm = ({ stationAutoKeys }) => {
    const { form, setFilterDefault } = this.props
    const filterDefault = this.getFilterDefault()
    setFilterDefault(filterDefault)

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
            placeholder={i18n().placeholder.dataStatus}
          />
        )
      case 'frequent':
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={i18n().placeholder.frequency}
            onChange={this.onChangeFrequency}
          />
        )
      case 'standardKey':
        return (
          <SelectQCVN
            placeholder={i18n().placeholder.standard}
            onChange={this.onChangeStandard}
          />
        )
      default:
        return <InputNumber />
    }
  }

  getFilterInitialValue = key => {
    if (key === 'dataStatus')
      return dataStatusOptions.map(option => option.value)
  }

  getStationTypes = province => {
    const { stationTypes } = this.state
    const stationAutoTypeKeys = [...this.stationAutos]
      .map(([_, station]) => station)
      .filter(stationAuto => {
        const provinceValue = get(stationAuto, ['province', 'key'], '')
        return provinceValue === province
      })
      .filter(station => station.stationType)
      .map(station => station.stationType.key)

    return stationTypes.filter(stationType =>
      stationAutoTypeKeys.includes(stationType)
    )
  }

  onChangeProvince = province => {
    const { form } = this.props
    const stationTypeKeys = this.getStationTypes(province)
    const stationType = stationTypeKeys[0]
    const { frequent, standardKey } = form.getFieldsValue()
    const params = {
      stationType,
      province,
      frequency: frequent,
      standard: standardKey,
    }

    form.setFieldsValue({
      [FIELDS.STATION_TYPE]: stationType,
    })

    this.handleStationAutoKeys(params)
    this.setState({
      stationAutosValue: this.getStationAutosValue(params),
    })
    form.validateFields([FIELDS.STATION_AUTO, FIELDS.MEASURING_LIST])
  }

  onChangeStationType = stationType => {
    const { form } = this.props
    const { provinceKey, frequent, standardKey } = form.getFieldsValue()
    const params = {
      stationType,
      province: provinceKey,
      frequency: frequent,
      standard: standardKey,
    }

    this.handleStationAutoKeys(params)
    this.setState({
      stationAutosValue: this.getStationAutosValue(params),
    })
    form.validateFields([FIELDS.STATION_AUTO, FIELDS.MEASURING_LIST])
  }

  onChangeFrequency = frequency => {
    const { form } = this.props
    form.setFieldsValue({ frequent: frequency })

    const { stationType, provinceKey, standardKey } = form.getFieldsValue()
    const params = {
      stationType,
      province: provinceKey,
      frequency,
      standard: standardKey,
    }
    this.handleStationAutoKeys(params)

    this.setState({
      stationAutosValue: this.getStationAutosValue(params),
    })

    form.validateFields([FIELDS.STATION_AUTO, FIELDS.MEASURING_LIST])
  }

  onChangeStandard = standardKey => {
    const { form } = this.props
    form.setFieldsValue({ standardKey: standardKey })

    const { stationType, provinceKey, frequent } = form.getFieldsValue()
    const params = {
      stationType,
      province: provinceKey,
      frequency: frequent,
      standard: standardKey,
    }
    this.handleStationAutoKeys(params)

    this.setState({
      stationAutosValue: this.getStationAutosValue(params),
    })
    form.validateFields([FIELDS.STATION_AUTO, FIELDS.MEASURING_LIST])
  }

  handleSearch = async () => {
    const { form, onChangeStationData } = this.props

    const formData = await form.validateFields()
    const time = getTimes(formData[FIELDS.RANGE_TIME])

    const stationsData = formData[FIELDS.STATION_AUTO].map(stationKey =>
      this.stationAutos.get(stationKey)
    )

    const searchFormData = {
      advanced: [],
      dataStatus: get(formData, 'dataStatus', []),
      fromDate: moment(time.from).toDate(),
      isFilter: formData.isFilter,
      toDate: moment(time.to).toDate(),
      type: formData.type,
      stationKeys: get(formData, 'stationAuto', []).join(','),
      measuringList: get(formData, 'measuringList', []),
    }

    onChangeStationData(stationsData, searchFormData)
  }

  handleChangeRanges = ranges => {
    const { from, to } = getTimes(ranges)

    this.setState({
      fromDate: from.toDate(),
      toDate: to.toDate(),
    })
  }

  onStationAutoChange = stationAutoKeys => {
    this.updateForm({ stationAutoKeys })
  }

  render() {
    const { form, loading } = this.props
    const {
      measuringList,
      otherConditionFilter,
      stationAutosValue,
    } = this.state

    const values = form.getFieldsValue([
      FIELDS.STATION_AUTO,
      FIELDS.MEASURING_LIST,
      FIELDS.PROVINCE,
    ])

    const numberStation = (values[FIELDS.STATION_AUTO] || []).length
    const numberMeasure = (values[FIELDS.MEASURING_LIST] || []).length

    const province = values[FIELDS.PROVINCE]
    const stationAutos = [...this.stationAutos].map(([_, station]) => station)

    const measuringListOptions = measuringList.map(measure => ({
      value: measure.key,
      name: measure.name,
    }))

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              size="small"
              loading={loading}
              onClick={this.handleSearch}
            >
              {i18n().btnSearchText}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {i18n().searchSelect}
        </Heading>
        <Container>
          <Row gutter={20}>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={t('dataSearchFilterForm.form.province.label')}>
                {form.getFieldDecorator(FIELDS.PROVINCE, {
                  initialValue: '',
                  onChange: this.onChangeProvince,
                })(<SelectProvince isShowAll />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n().form.stationType}>
                {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                  onChange: this.onChangeStationType,
                })(
                  <SelectStationType
                    province={province}
                    stationAutos={stationAutos}
                    onFetchSuccess={this.onFetchStationTypeSuccess}
                  />
                )}
              </FormItem>
            </Col>

            <Col md={8} lg={8} sm={12}>
              <FormItem label={i18n().form.time}>
                {form.getFieldDecorator(FIELDS.RANGE_TIME, {
                  initialValue: 1,
                  onChange: this.handleChangeRanges,
                })(<OptionsTimeRange style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={4} lg={4} sm={12}>
              <FormItem label={i18n().form.type}>
                {form.getFieldDecorator(FIELDS.TYPE, {
                  initialValue: 15,
                })(<SelectTimeRange style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col>
              <FormItem label={i18n().form.stationAuto(numberStation)}>
                {form.getFieldDecorator(FIELDS.STATION_AUTO, {
                  rules: [requiredFieldRule(i18n().rules.stationAuto)],
                  onChange: this.onStationAutoChange,
                })(
                  <SelectStationAuto
                    stationAutosValue={stationAutosValue}
                    stationType={form.getFieldValue(FIELDS.STATION_TYPE)}
                    province={form.getFieldValue(FIELDS.PROVINCE)}
                    onFetchSuccess={this.onFetchStationAutoSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label={i18n().form.measuringList(numberMeasure)}>
                {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                  rules: [requiredFieldRule(i18n().rules.parameter)],
                })(<SortableMultiSelect options={measuringListOptions} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            {otherConditionFilter.map(filter => (
              <Col span={8}>
                <Flex>
                  <FormItem
                    label={t(`dataSearchFilterForm.form.${filter.key}.label`)}
                  >
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
            {otherConditionFilter.length < 3 && (
              <Col span={6} style={{ alignSelf: 'center' }}>
                <HeaderWrapper
                  top={otherConditionFilter.length % 4 === 0 ? 0 : 28}
                >
                  <Tooltip placement="top" title={i18n().tooltip.addCondition}>
                    <Dropdown
                      trigger={['click']}
                      ref={ref => (this.a = ref)}
                      overlay={
                        <FilterList
                          listFilter={otherConditionFilter}
                          ref={ref => (this.filterListRef = ref)}
                          onChange={this.handleChangeFilter}
                        />
                      }
                    >
                      <a
                        className="ant-dropdown-link"
                        onClick={e => e.preventDefault()}
                      >
                        <Icon type="plus" /> {i18n().form.addCondition}
                      </a>
                    </Dropdown>
                  </Tooltip>
                </HeaderWrapper>
              </Col>
            )}
          </Row>
          <Row type="flex" justify="end" align="middle">
            <Col>
              <div
                style={{
                  display: 'flex',
                  width: '220px',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    color: '#262626',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginRight: '4px',
                  }}
                >
                  {translate('dataSearchFrom.processData')}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <ToolTipHint
                    width={'20px'}
                    text={i18n().tooltip.filterData}
                  />
                </div>
                <div style={{ marginLeft: '4px' }}>:</div>
                <FormItem style={{ marginTop: '4px' }}>
                  {form.getFieldDecorator('isFilter', {
                    initialValue: false,
                    valuePropName: 'checked',
                  })(
                    <Switch style={{ marginTop: '18px', marginLeft: '8px' }} />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
