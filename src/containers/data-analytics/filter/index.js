import React, { Component } from 'react'
import { Button, Col, Form, Row } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { get } from 'lodash'

import dataInsightApi from 'api/DataInsight'
import { translate as t } from 'hoc/create-lang'
import Heading from 'components/elements/heading'
import SearchFormContainer from 'components/elements/box-shadow'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectStationAuto from './select-station-auto'
import SelectMeasureParameter from './select-measure-parameter'
import SelectOperator, { OPERATOR } from './select-operator'
import { requiredFieldRule } from 'utils/rules'

const i18n = {
  btnSearchText: t('addon.search'),
  provinceLabel: t('dataAnalytics.filterForm.province.label'),
  stationTypeLabel: t('dataAnalytics.filterForm.stationType.label'),
  operatorLabel: t('dataAnalytics.filterForm.operator.label'),
  timeLabel: t('dataAnalytics.filterForm.time.label'),
  stationAutoLabel: count =>
    t('dataAnalytics.filterForm.stationAutoLabel.label', { count }),
  parameterLabel: count =>
    t('dataAnalytics.filterForm.parameterLabel.label', { count }),
  stationAuto: t('dataAnalytics.filterForm.stationAuto'),
  parameter: t('dataAnalytics.filterForm.parameter'),
}

const FormSearch = styled.div`
  padding: 10px;
`

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
`

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  OPERATOR: 'operator',
  RANGE_TIME: 'rangeTime',
  STATION_AUTO: 'stationAuto',
  MEASURING_LIST: 'measuringList',
}

class FilterForm extends Component {
  stationAutos = new Map()
  stationTypes = []

  state = {
    measuringList: [],
  }

  handleSearch = async () => {
    const { form, onData, setLoading, setParamFilter } = this.props
    try {
      setLoading(true)
      const values = await form.validateFields()
      const times = this.getTimes(values[FIELDS.RANGE_TIME])
      const params = {
        stationAutoKeys: values[FIELDS.STATION_AUTO].join(','),
        measuringList: values[FIELDS.MEASURING_LIST].join(','),
        stationType: values[FIELDS.STATION_TYPE],
        from: times.from
          .clone()
          .utc()
          .format(),
        to: times.to
          .clone()
          .utc()
          .format(),
      }
      setParamFilter({
        ...params,
        operator: values[FIELDS.OPERATOR],
      })
      const result = await dataInsightApi.getDataInsight(params)
      setLoading(false)
      onData(result, {
        dataType: values[FIELDS.OPERATOR],
        from: params.from,
        to: params.to,
      })
    } catch (error) {
      setLoading(false)
    }
  }

  getTimes = rangeTime => {
    if (Array.isArray(rangeTime))
      return {
        from: rangeTime[0],
        to: rangeTime[1],
      }
    if (rangeTime === 1)
      return {
        from: moment().subtract(1, 'd'),
        to: moment(),
      }
    return {
      from: moment()
        .startOf('d')
        .subtract(rangeTime, 'd'),
      to: moment()
        .endOf('d')
        .subtract(1, 'd'),
    }
  }

  getStationAutoKeys = ({ province, stationType }) => {
    return [...this.stationAutos]
      .filter(item => get(item, `1.stationType.key`) === stationType)
      .filter(item => !province || get(item, `1.province.key`) === province)
      .map(item => get(item, '1.key'))
  }

  getMeasuringList = stationAutoKeys =>
    (stationAutoKeys || []).reduce((map, key) => {
      const stationAuto = this.stationAutos.get(key) || {}
      const measuringList = stationAuto.measuringList || []
      measuringList.forEach(measure => map.set(measure.key, measure))
      return map
    }, new Map())

  setStationAutos = stationAutos =>
    stationAutos.map(item => this.stationAutos.set(item.key, item))

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

  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    this.stationTypes = stationTypes
    const stationType = get(stationTypes, '0.key')
    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationType })
    if (this.stationAutos.size !== 0) {
      this.onStationTypeChange(stationType)
      setTimeout(() => {
        this.handleSearch()
      })
    }
  }

  onFetchStationAutoSuccess = stationAutos => {
    const { form } = this.props
    this.setStationAutos(stationAutos)
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const province = form.getFieldValue(FIELDS.PROVINCE)
    const stationAutoKeys = this.getStationAutoKeys({ stationType, province })

    this.updateForm({ stationAutoKeys })

    if (stationType)
      setTimeout(() => {
        this.handleSearch()
      })
  }

  onStationTypeChange = stationType => {
    const { form } = this.props
    const province = form.getFieldValue(FIELDS.PROVINCE)
    this.updateForm({
      stationAutoKeys: this.getStationAutoKeys({ stationType, province }),
    })
  }

  onChange = () => {
    setTimeout(() => {
      const { form } = this.props
      const province = form.getFieldValue(FIELDS.PROVINCE)
      const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
      this.updateForm({
        stationAutoKeys: this.getStationAutoKeys({ stationType, province }),
      })
    })
  }

  onStationAutoChange = stationAutoKeys => {
    this.updateForm({ stationAutoKeys })
  }

  render() {
    const { form, isLoadingData } = this.props
    const { measuringList } = this.state

    const values = form.getFieldsValue([
      FIELDS.STATION_AUTO,
      FIELDS.MEASURING_LIST,
    ])

    const numberStation = (values[FIELDS.STATION_AUTO] || []).length
    const numberMeasuringList = (values[FIELDS.MEASURING_LIST] || []).length

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              size="small"
              onClick={this.handleSearch}
              loading={isLoadingData}
            >
              {i18n.btnSearchText}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {i18n.btnSearchText}
        </Heading>
        <FormSearch>
          <Row gutter={20}>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n.provinceLabel}>
                {form.getFieldDecorator(FIELDS.PROVINCE, {
                  onChange: this.onChange,
                })(<SelectProvince isShowAll />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n.stationTypeLabel}>
                {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                  onChange: this.onChange,
                })(
                  <SelectStationType
                    onFetchSuccess={this.onFetchStationTypeSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n.operatorLabel}>
                {form.getFieldDecorator(FIELDS.OPERATOR, {
                  initialValue: OPERATOR.AVG,
                })(<SelectOperator />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n.timeLabel}>
                {form.getFieldDecorator(FIELDS.RANGE_TIME, {
                  initialValue: 1,
                })(<OptionsTimeRange />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} md={24} lg={24}>
              <FormItem label={i18n.stationAutoLabel(numberStation)}>
                {form.getFieldDecorator(
                  FIELDS.STATION_AUTO,
                  {
                    rules: [requiredFieldRule(i18n.stationAuto)],
                    onChange: this.onStationAutoChange,
                  }
                )(
                  <SelectStationAuto
                    stationType={form.getFieldValue(FIELDS.STATION_TYPE)}
                    province={form.getFieldValue(FIELDS.PROVINCE)}
                    onFetchSuccess={this.onFetchStationAutoSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24} lg={24}>
              <FormItem label={i18n.parameterLabel(numberMeasuringList)}>
                {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                  rules: [requiredFieldRule(i18n.parameter)],
                })(<SelectMeasureParameter options={measuringList} />)}
              </FormItem>
            </Col>
          </Row>
        </FormSearch>
      </SearchFormContainer>
    )
  }
}

export default Form.create()(FilterForm)
