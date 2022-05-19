import React, { Component } from 'react'
import { Button, Col, Form, Row, Switch } from 'antd'
import styled from 'styled-components'
import { get, isEmpty } from 'lodash'

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
import { getTimes } from 'utils/datetime'
import ToolTip from 'components/elements/tooltip'
// import OptionsTimeRange from 'containers/search/common/options-time-range'

function i18n() {
  return {
    btnSearchText: t('addon.search'),
    provinceLabel: t('dataAnalytics.filterForm.province.label'),
    stationTypeLabel: t('dataAnalytics.filterForm.stationType.label'),
    operatorLabel: t('dataAnalytics.filterForm.operator.label'),
    timeLabel: t('dataAnalytics.filterForm.time.label'),
    stationAutoLabel: count =>
      t('dataAnalytics.filterForm.stationAutoLabel.label', { count }),
    parameterLabel: count =>
      t('dataAnalytics.filterForm.parameterLabel.label', { count }),
    parameterAdvLabel: count =>
      t('dataAnalytics.filterForm.parameterAdvLabel.label', { count }),
    stationAuto: t('dataAnalytics.filterForm.stationAuto'),
    parameter: t('dataAnalytics.filterForm.parameter'),
    isProcessData: t('dataSearchFrom.processData'),
  }
}

const FormSearch = styled.div`
  padding: 10px;
  label {
    margin-bottom: 0;
  }
`

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  font-size: 14;
  font-weight: 600;
  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
  .switch-filter {
    display: flex;
    flex-direction: row-reverse;
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
    triggerRerender: true,
  }

  handleSearch = async () => {
    this.setState({
      triggerRerender: !this.state.triggerRerender,
    })
    const {
      form,
      onData,
      setLoading,
      setParamFilter,
      standardsVN,
      setValuesForm,
    } = this.props
    try {
      setLoading(true)
      const values = await form.validateFields()

      if (isEmpty(this.props.filterItem)) {
        setValuesForm(values)
      }

      const times = getTimes(values[FIELDS.RANGE_TIME])
      const params = {
        stationKeys: values[FIELDS.STATION_AUTO].join(','),
        measuringList: values[FIELDS.MEASURING_LIST].join(','),
        from: times.from
          .clone()
          .utc()
          .format(),
        to: times.to
          .clone()
          .utc()
          .format(),
        isFilter: values.isFilter || false,
        standards: standardsVN.join(),
        operator: values[FIELDS.OPERATOR],
      }

      setParamFilter(params)
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

  async componentDidUpdate(prevProps) {
    if (prevProps.standardsVN.length !== this.props.standardsVN.length) {
      await this.handleSearch()
    }
  }

  getStationAutoKeys = ({ province, stationType }) => {
    return [...this.stationAutos]
      .filter(item => get(item, `1.stationType.key`) === stationType)
      .filter(item => !province || get(item, `1.province.key`) === province)
      .map(item => get(item, '1.key'))
  }

  getMeasuringList = (stationAutoKeys, operateType) =>
    (stationAutoKeys || []).reduce((map, key) => {
      const stationAuto = this.stationAutos.get(key) || {}
      const measuringList =
        operateType === OPERATOR.SUM
          ? stationAuto.measuringListAdvanced || []
          : stationAuto.measuringList || []
      measuringList.forEach(measure => map.set(measure.key, measure))
      return map
    }, new Map())

  setStationAutos = stationAutos =>
    stationAutos.map(item => this.stationAutos.set(item.key, item))

  updateForm = ({ stationAutoKeys }) => {
    const { form } = this.props
    const operateType = form.getFieldValue(FIELDS.OPERATOR)

    const measuringList = this.getMeasuringList(stationAutoKeys, operateType)
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

  onChange = field => {
    const { form, toogleSelectQcvns } = this.props

    setTimeout(() => {
      const province = form.getFieldValue(FIELDS.PROVINCE)
      const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
      const type = form.getFieldValue(FIELDS.OPERATOR)
      if (field === FIELDS.OPERATOR) {
        toogleSelectQcvns(type !== OPERATOR.SUM)
      }
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
      FIELDS.OPERATOR,
    ])

    const numberStation = (values[FIELDS.STATION_AUTO] || []).length
    const numberMeasuringList = (values[FIELDS.MEASURING_LIST] || []).length

    const measureLable =
      values[FIELDS.OPERATOR] === OPERATOR.SUM
        ? i18n().parameterAdvLabel(numberMeasuringList)
        : i18n().parameterLabel(numberMeasuringList)
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
              {i18n().btnSearchText}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {i18n().btnSearchText}
        </Heading>
        <FormSearch>
          <Row gutter={20}>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n().provinceLabel}>
                {form.getFieldDecorator(FIELDS.PROVINCE, {
                  initialValue: '',
                  onChange: this.onChange,
                })(<SelectProvince isShowAll />)}
              </FormItem>
            </Col>
            <Col md={6} lg={6} sm={12}>
              <FormItem label={i18n().stationTypeLabel}>
                {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                  onChange: this.onChange,
                })(
                  <SelectStationType
                    onFetchSuccess={this.onFetchStationTypeSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={4} lg={4} sm={12}>
              <FormItem label={i18n().operatorLabel}>
                {form.getFieldDecorator(FIELDS.OPERATOR, {
                  initialValue: OPERATOR.AVG,
                  onChange: () => this.onChange(FIELDS.OPERATOR),
                })(<SelectOperator />)}
              </FormItem>
            </Col>
            <Col md={8} lg={8} sm={12}>
              <FormItem label={i18n().timeLabel}>
                {form.getFieldDecorator(FIELDS.RANGE_TIME, {
                  initialValue: 1,
                })(
                  <OptionsTimeRange
                    triggerRerender={this.state.triggerRerender}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col sm={24} md={24} lg={24}>
              <FormItem label={i18n().stationAutoLabel(numberStation)}>
                {form.getFieldDecorator(FIELDS.STATION_AUTO, {
                  rules: [requiredFieldRule(i18n().stationAuto)],
                  onChange: this.onStationAutoChange,
                })(
                  <SelectStationAuto
                    stationType={form.getFieldValue(FIELDS.STATION_TYPE)}
                    province={form.getFieldValue(FIELDS.PROVINCE)}
                    onFetchSuccess={this.onFetchStationAutoSuccess}
                  />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24} lg={24}>
              <FormItem label={measureLable}>
                {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                  rules: [requiredFieldRule(i18n().parameter)],
                })(<SelectMeasureParameter options={measuringList} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8} type="flex" justify="end" align="middle">
            <Col>
              <ToolTip text={t('dataAverage.tooltip.filterData')} />
            </Col>
            <Col>
              <Form.Item
                label={i18n().isProcessData}
                style={{ marginBottom: '0', width: '180px' }}
                colon={false}
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 8 }}
              >
                {form.getFieldDecorator('isFilter')(<Switch />)}
              </Form.Item>
            </Col>
          </Row>
        </FormSearch>
      </SearchFormContainer>
    )
  }
}

export default Form.create()(FilterForm)
