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
import createLang, { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import React from 'react'
import styled from 'styled-components'
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
@createLang
export default class SearchAvgForm extends React.Component {
  static defaultProps = {
    initialValues: {},
  }

  stationAutos = new Map()

  constructor(props) {
    super(props)
    this.state = {
      filterList: listFilter().filter(
        filter => props.initialValues[filter.key]
      ),
      isFilter: false,
      measuringList: [],
    }
  }

  handleChangeFilter = filter => {
    const { filterList } = this.state

    const index = filterList.findIndex(item => item.key === filter.key)
    if (index < 0) {
      this.setState({ filterList: [...filterList, filter] })
    } else {
      this.setState({ filterList: filterList.splice(index, 1) })
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
    const { filterList } = this.state

    if (this.filterListRef) {
      this.filterListRef.handleOnChange(filterKey)()
    } else {
      this.setState({
        filterList: filterList.filter(item => item.key !== filterKey),
      })
    }
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    const stationType = get(stationTypes, '0.key')
    const province = form.getFieldValue(FIELDS.PROVINCE)

    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationType })

    this.updateForm({
      stationAutoKeys: this.getStationAutoKeys({ stationType, province }),
    })
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

  getStationAutoKeysWithFilterOptions = ({
    province,
    stationType,
    frequency,
    standard,
  }) => {
    return [...this.stationAutos]
      .filter(item => get(item, `1.stationType.key`) === stationType)
      .filter(item => !province || get(item, `1.province.key`) === province)
      .filter(item =>
        frequency ? get(item, `1.dataFrequency`) === frequency : true
      )
      .filter(item =>
        standard ? get(item, `1.standardsVN.key`) === standard : true
      )
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

  onChange = () => {
    const { form } = this.props

    setTimeout(() => {
      const province = form.getFieldValue(FIELDS.PROVINCE)
      const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
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

    const stationAutoKeys = this.getStationAutoKeysWithFilterOptions({
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

    const stationAutoKeys = this.getStationAutoKeysWithFilterOptions({
      stationType,
      province,
      frequency,
      standard,
    })

    this.updateForm({ stationAutoKeys })
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
            <Button type="primary" icon="search" size="small">
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
                  onChange: this.onChange,
                })(<SelectProvince isShowAll />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={t('stationType.label')}>
                {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                  onChange: this.onChange,
                })(
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
