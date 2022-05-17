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
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { dataStatusOptions } from 'constants/dataStatus'
import SelectMeasureParameter from 'containers/data-analytics/filter/select-measure-parameter'
import SelectStationAuto from 'containers/data-analytics/filter/select-station-auto'
import { translate as t, translate } from 'hoc/create-lang'
import createQueryFormDataBrowser from 'hoc/query-formdata-browser'
import { get, isEmpty, isEqual } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import styled from 'styled-components'
import { getTimes } from 'utils/datetime'
import SelectTimeRange from '../../common/select-time-range'
import { FIELDS } from '../constants'
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
        .toISOString(),
      toDate: moment().toISOString(),
      measuringList: [],
      stationsData: [],
      stationTypes: [],
      triggerRerender: true,
    }
  }

  componentDidMount = () => {
    const { formData, form } = this.props
    if (isEmpty(formData)) return
    const initValues = this.getInitValuesFormData()
    form.setFieldsValue(initValues)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { formData, setFilterDefault, otherCondition } = this.props

    if (!isEqual(prevProps.formData, formData)) {
      const filterDefault = this.getFilterDefault()
      this.setState({ otherConditionFilter: [] })
      setFilterDefault(filterDefault)
    }

    if (!isEqual(prevProps.otherCondition, otherCondition)) {
      this.setState({ otherConditionFilter: otherCondition })
    }
  }

  getInitValuesFormData = () => {
    const { formData } = this.props
    console.log({ formData })
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
    // const { otherConditionSearch } = this.props
    const { otherConditionFilter } = this.state

    const index = otherConditionFilter.findIndex(
      item => item.key === filter.key
    )
    if (index < 0) {
      this.setState({ otherConditionFilter: [...otherConditionFilter, filter] })
    } else {
      this.setState({
        otherConditionFilter: otherConditionFilter.splice(index, 1),
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
    const { otherConditionFilter } = this.state

    this.setState({
      otherConditionFilter: otherConditionFilter.filter(
        item => item.key !== filterKey
      ),
    })
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form, formData } = this.props
    this.setState({ stationTypes: stationTypes.map(type => type.key) })

    const stationType = get(stationTypes, '0.key')
    const province = form.getFieldValue(FIELDS.PROVINCE)

    if (!isEmpty(formData)) return

    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationType })
    const stationAutoKeys = this.getStationAutoKeys({ stationType, province })
    this.updateForm({ stationAutoKeys })
  }

  getFilterDefault = () => {
    const { stationTypes } = this.state
    const stationAutos = this.getStationAutoKeys({
      province: '',
      stationType: stationTypes[0],
    })
    const measuringList = this.getMeasuringList(stationAutos)
    const measuringKeys = measuringList.keys()

    const filterDefault = {
      [FIELDS.PROVINCE]: '',
      [FIELDS.STATION_TYPE]: stationTypes[0],
      [FIELDS.MEASURING_LIST]: Array.from(measuringKeys),
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

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const province = form.getFieldValue(FIELDS.PROVINCE)
    let stationAutoKeys

    if (!isEmpty(formData)) {
      stationAutoKeys = [formData.stationAuto]
    } else {
      stationAutoKeys = this.getStationAutoKeys({ stationType, province })
      const filterDefault = this.getFilterDefault()
      setFilterDefault(filterDefault)
    }

    console.log({ stationAutoKeys })

    this.updateForm({ stationAutoKeys })
    this.handleSearch()
  }

  setStationAutos = stationAutos =>
    stationAutos.map(item => this.stationAutos.set(item.key, item))

  getStationAutoKeys = ({
    province,
    stationType,
    frequency = undefined,
    standard = undefined,
  }) => {
    return [...this.stationAutos]
      .filter(([_, station]) => get(station, `stationType.key`) === stationType)
      .filter(
        ([_, station]) => !province || get(station, `province.key`) === province
      )
      .filter(([_, station]) =>
        frequency ? get(station, `dataFrequency`) === frequency : true
      )
      .filter(([_, station]) =>
        standard ? get(station, `standardsVN.key`) === standard : true
      )
      .map(([_, station]) => get(station, 'key'))
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
            maxTagCount={2}
            maxTagTextLength={window.innerWidth > 1600 ? 20 : 5}
            placeholder="Chọn tình trạng dữ liệu"
          />
        )
      case 'frequent':
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập tần suất (phút/lần)"
            onChange={this.onChangeFrequency}
          />
        )
      case 'standardKey':
        return (
          <SelectQCVN
            placeholder="Chọn quy chuẩn"
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
    return
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

  onChangeProvince = () => {
    const { form } = this.props
    setTimeout(() => {
      const province = form.getFieldValue(FIELDS.PROVINCE)
      const stationTypeKeys = this.getStationTypes(province)
      const stationType = stationTypeKeys[0]
      form.setFieldsValue({
        [FIELDS.STATION_TYPE]: stationTypeKeys[0],
      })

      this.updateForm({
        stationAutoKeys: this.getStationAutoKeys({ stationType, province }),
      })
    })
  }

  onChangeStationType = () => {
    const { form } = this.props
    setTimeout(() => {
      const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
      const province = form.getFieldValue(FIELDS.PROVINCE)
      const frequency = form.getFieldValue('frequent')
      const standard = form.getFieldValue('standardKey')

      if (frequency || standard) {
        const stationAutoKeys = this.getStationAutoKeys({
          stationType,
          province,
          frequency,
          standard,
        })

        this.updateForm({ stationAutoKeys })
        return
      }

      this.updateForm({
        stationAutoKeys: this.getStationAutoKeys({ stationType, province }),
      })
    })
  }

  onChangeFrequency = frequency => {
    const { form } = this.props
    form.setFieldsValue({ frequent: frequency })

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const province = form.getFieldValue(FIELDS.PROVINCE)
    const standard = form.getFieldValue('standardKey')
    const stationAutoKeys = this.getStationAutoKeys({
      stationType,
      province,
      frequency,
      standard,
    })

    this.updateForm({ stationAutoKeys })
  }

  onChangeStandard = standard => {
    const { form } = this.props
    form.setFieldsValue({ standardKey: standard })

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const province = form.getFieldValue(FIELDS.PROVINCE)
    const frequency = form.getFieldValue('frequent')
    const stationAutoKeys = this.getStationAutoKeys({
      stationType,
      province,
      frequency,
      standard,
    })

    this.updateForm({ stationAutoKeys })
  }

  handleSearch = async () => {
    const { form, onChangeStationData } = this.props
    const { fromDate, toDate } = this.state

    const formData = await form.validateFields()
    const stationsData = formData[FIELDS.STATION_AUTO].map(stationKey =>
      this.stationAutos.get(stationKey)
    )

    const searchFormData = {
      advanced: [],
      dataStatus: get(formData, 'dataStatus', []),
      fromDate: fromDate,
      isFilter: formData.isFilter,
      toDate: toDate,
      type: formData.type,
      stationKeys: get(formData, 'stationAuto', []).join(','),
      measuringList: get(formData, 'measuringList', []),
    }

    onChangeStationData(stationsData, searchFormData)
  }

  handleChangeRanges = ranges => {
    const { from, to } = getTimes(ranges)

    this.setState({
      fromDate: from.toISOString(),
      toDate: to.toISOString(),
    })
  }

  render() {
    const { form, loading } = this.props
    const { measuringList, otherConditionFilter } = this.state

    const values = form.getFieldsValue([
      FIELDS.STATION_AUTO,
      FIELDS.MEASURING_LIST,
      FIELDS.PROVINCE,
    ])

    const numberStation = (values[FIELDS.STATION_AUTO] || []).length
    const numberMeasure = (values[FIELDS.MEASURING_LIST] || []).length

    const province = values[FIELDS.PROVINCE]
    const stationAutos = [...this.stationAutos].map(([_, station]) => station)

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
              {'Tìm kiếm'}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {t('addon.searchSelect')}
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
              <FormItem
                label={t('dataSearchFilterForm.form.stationType.label')}
              >
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
              <FormItem label={t('dataSearchFilterForm.form.time')}>
                {form.getFieldDecorator(FIELDS.RANGE_TIME, {
                  initialValue: 1,
                  onChange: this.handleChangeRanges,
                })(<OptionsTimeRange style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={4} lg={4} sm={12}>
              <FormItem label={t('dataSearchFilterForm.form.type.label')}>
                {form.getFieldDecorator(FIELDS.TYPE, {
                  initialValue: 15,
                })(<SelectTimeRange style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col>
              <FormItem label={`Trạm quan trắc (${numberStation} trạm)`}>
                {form.getFieldDecorator(FIELDS.STATION_AUTO, {
                  rules: [
                    {
                      required: true,
                      message: t('avgSearchFrom.form.stationAuto.error'),
                    },
                  ],
                })(
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
                {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                  rules: [
                    {
                      required: true,
                      message: t('avgSearchFrom.form.measuringList.require'),
                    },
                  ],
                })(<SelectMeasureParameter options={measuringList} />)}
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
                  <Tooltip
                    placement="top"
                    title={'Thêm điều kiện lọc trạm quan trắc'}
                  >
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
                        <Icon type="plus" /> {t('addon.addCondition')}
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
                  {form.getFieldDecorator('isFilter', {
                    initialValue: false,
                  })(<Switch style={{ marginTop: '18px' }} />)}
                </FormItem>
              </div>
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
