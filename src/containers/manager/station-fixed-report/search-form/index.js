import React from 'react'
import { Button, Col, DatePicker, Form, Row, Select, Switch, Spin } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
/** */
import CategoryApi from 'api/CategoryApi'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import createLang, { translate as t } from 'hoc/create-lang'
import SelectProvince from 'components/elements/select-province'
import { DD_MM_YYYY } from 'constants/format-date'
import { getTimes } from 'utils/datetime'
import { isNumber } from 'lodash'


const { Option } = Select
const { RangePicker } = DatePicker

const i18n = {
  provinceLabel: t('dataPointReport.form.label.province'),
  stationTypeLabel: t('dataPointReport.form.label.stationType'),
  phaseLabel: t('dataPointReport.form.label.phase'),
  pointLabel: t('dataPointReport.form.label.point'),
  timeLabel: t('dataPointReport.form.label.time'),
  exceededLabel: t('dataPointReport.form.label.exceeded'),
  inRangeField: t('dataPointReport.form.dataPicker.inRange'),
  stationTypeRequired: t('dataPointReport.form.required.stationType'),
  phaseRequired: t('dataPointReport.form.required.phase'),
  pointRequired: t('dataPointReport.form.required.point'),
  numberOrder: t('dataPointReport.title.numberOder'),
}

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

const FormItemStyled = styled(Form.Item)`
  margin-bottom: 0px;
`

const FIELDS = {
  PROVINCES: 'provinceId',
  STATION_TYPE_ID: 'stationTypeId',
  PHASE: 'phase',
  POINT: 'point',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  IS_EXCEEDED: 'isExceeded',
  RANGE_PICKER: 'rangePicker',
}


const optionsTimeRange = [
  { key: 1, text: 'dataSearchFrom.options.byHoursDetail', value: 24, detailHours: `${moment().subtract(1, 'days').format('DD/MM/YYYY HH:mm')} - ${moment().format('DD/MM/YYYY HH:mm')}` },
  { key: 7, text: 'dataSearchFrom.options.byDayDetail', value: 7, detailDay: `${moment().subtract(7, 'days').startOf('day').format('DD/MM/YYYY HH:mm')} - ${moment().subtract(1, 'days').endOf('day').format('DD/MM/YYYY HH:mm')}` },
  { key: 15, text: 'dataSearchFrom.options.byDayDetail', value: 15, detailDay: `${moment().subtract(15, 'days').startOf('day').format('DD/MM/YYYY HH:mm')} - ${moment().subtract(1, 'days').endOf('day').format('DD/MM/YYYY HH:mm')}` },
  { key: 30, text: 'dataSearchFrom.options.byDayDetail', value: 30, detailDay: `${moment().subtract(30, 'days').startOf('day').format('DD/MM/YYYY HH:mm')} - ${moment().subtract(1, 'days').endOf('day').format('DD/MM/YYYY HH:mm')}` },
]

@createLang
@Form.create()
export class SearchForm extends React.Component {
  state = {
    phases: [],
    points: [],
    stationTypes: [],
    isOpenRangePicker: false,
    isLoading: false,
  }

  async componentDidMount() {
    const stationTypes = await CategoryApi.getStationTypes(
      {},
      { isAuto: false }
    )
    if (stationTypes.success)
      this.setState({
        stationTypes: stationTypes.data || [],
        value: this.props.value || (this.props.isShowAll ? '' : undefined),
      })
    this.setState({
      stationTypes: stationTypes.data,
    })
  }

  fetchPhase = async () => {
    this.setState({
      isLoading: true,
    })
    const stationTypeId = this.props.form.getFieldValue(FIELDS.STATION_TYPE_ID)
    const filterPhase = {
      limit: 100,
      skip: 0,
      where: {
        stationTypeId: stationTypeId ? stationTypeId : undefined,
      },
      include: [{ relation: 'stationType' }],
    }
    const phases = await getPhase({ filter: filterPhase })

    this.setState({
      isLoading: false,
      phases,
    })
  }

  fetchPoints = async () => {
    this.setState({
      isLoading: true,
    })
    const provinceId = this.props.form.getFieldValue(FIELDS.PROVINCES)
    const stationTypeId = this.props.form.getFieldValue(FIELDS.STATION_TYPE_ID)
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {
        stationTypeId: stationTypeId ? stationTypeId : undefined,
        provinceId: provinceId ? provinceId : undefined,
        active: true,
      },
    }
    const points = await getPoint({ filter: filterPoint })

    this.setState({
      isLoading: false,
      points: points.data,
    })
  }

  handleOnSelectStationType = stationTypeIdSelected => {
    const { form } = this.props
    form.setFieldsValue({
      [FIELDS.PHASE]: undefined,
      [FIELDS.POINT]: undefined,
    })
    this.fetchPhase()
    this.fetchPoints()
  }

  handleOnSelectTime = value => {
    if (value === FIELDS.RANGE_PICKER) {
      this.setState({ isOpenRangePicker: true })
    } else {
      this.setState({ isOpenRangePicker: false })
    }
  }

  handleOnSubmit = async e => {
    e.preventDefault()
    const values = await this.props.form.validateFields()
    const ranges = isNumber(values.time) ? values.time : values.timeRange
    const { from, to } = getTimes(ranges)
    // console.log({ from: from.format('DD/MM/YYYY HH:mm'), to: to.format('DD/MM/YYYY HH:mm') })


    const paramQuery = {
      phaseIds: values.phase,
      pointKeys: values.point,
      startDate: from,
      endDate: to,
      stationTypeId: values.stationTypeId,
      isExceeded: values.isExceeded,
    }
    // console.log(paramQuery, '==paramQuery==')

    this.props.setQueryParam(paramQuery)
    this.props.onSearch()
  }

  handleClick = () => alert('It works!')

  getConfig = msg => {
    return {
      rules: [{ required: true, message: msg }],
    }
  }

  render() {
    const { loadingSearch } = this.props
    const { phases, points, stationTypes, isOpenRangePicker } = this.state
    const { form } = this.props
    // const config = {
    //   rules: [{ required: true }],
    // }
    const rangeConfig = {
      rules: [
        {
          type: 'array',
          required: true,
          message: t('dataPointReport.form.required.range'),
        },
      ],
    }
    return (
      <SearchFormContainer>
        <Form onSubmit={this.handleOnSubmit}>
          <Heading
            rightChildren={
              <Button
                loading={loadingSearch}
                type="primary"
                icon="search"
                size="small"
                htmlType="submit"
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
          <Container>
            <Row gutter={24}>
              <Col span={12}>
                <FormItemStyled label={i18n.provinceLabel}>
                  {form.getFieldDecorator(FIELDS.PROVINCES)(
                    <SelectProvince
                      isShowAll
                      onSelect={() => {
                        form.setFieldsValue({
                          [FIELDS.PHASE]: undefined,
                          [FIELDS.POINT]: undefined,
                        })
                        this.fetchPoints()
                      }}
                      isUsedId
                      size="large"
                    />
                  )}
                </FormItemStyled>
              </Col>
              <Col span={12}>
                <FormItemStyled label={i18n.stationTypeLabel}>
                  {form.getFieldDecorator(
                    FIELDS.STATION_TYPE_ID,
                    this.getConfig(i18n.stationTypeRequired)
                  )(
                    <Select
                      onSelect={this.handleOnSelectStationType}
                      size="large"
                    >
                      {stationTypes &&
                        stationTypes.length > 0 &&
                        stationTypes.map(stationType => (
                          <Option key={stationType._id} value={stationType._id}>
                            {stationType.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItemStyled>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Spin spinning={this.state.isLoading}>
                  <FormItemStyled label={i18n.phaseLabel}>
                    {form.getFieldDecorator(
                      FIELDS.PHASE,
                      this.getConfig(i18n.phaseRequired)
                    )(
                      <Select
                        allowClear
                        autoClearSearchValue
                        size="large"
                        mode="multiple"
                        optionFilterProp="children"
                        // this props allow search name and _id
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0 ||
                          option.props.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {phases &&
                          phases.length > 0 &&
                          phases.map(phase => (
                            <Option key={phase._id} value={phase._id}>
                              {phase.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItemStyled>
                </Spin>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Spin spinning={this.state.isLoading}>
                  <FormItemStyled label={i18n.pointLabel}>
                    {form.getFieldDecorator(
                      FIELDS.POINT,
                      this.getConfig(i18n.pointRequired)
                    )(
                      <Select
                        autoClearSearchValue
                        allowClear
                        mode="multiple"
                        size="large"
                        optionFilterProp="children"
                        // this props allow search name and _id
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0 ||
                          option.props.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {points &&
                          points.length > 0 &&
                          points.map(point => (
                            <Option key={point.key} value={point.key}>
                              {point.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItemStyled>
                </Spin>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItemStyled label={i18n.timeLabel}>
                  {form.getFieldDecorator('time', {
                    ...this.getConfig(t('')),
                    initialValue: 7,
                  })(
                    <Select onSelect={this.handleOnSelectTime} size="large">
                      {optionsTimeRange.map(option => (
                        <Select.Option key={option.key} value={option.key}>

                          {option.key === 1 && t(option.text, { value: option.value, detailHours: option.detailHours })}
                          {option.key !== 1 && t(option.text, { value: option.value, detailDay: option.detailDay })}
                        </Select.Option>
                      ))}
                      <Option key="range" value={FIELDS.RANGE_PICKER}>
                        {i18n.inRangeField}
                      </Option>
                    </Select>
                  )}
                </FormItemStyled>
              </Col>
              <Col span={8}>
                <FormItemStyled label={i18n.exceededLabel}>
                  {form.getFieldDecorator(FIELDS.IS_EXCEEDED, {
                    initialValue: false,
                  })(<Switch size="large" />)}
                </FormItemStyled>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                {isOpenRangePicker && (
                  <FormItemStyled>
                    {form.getFieldDecorator(
                      'timeRange',
                      rangeConfig
                    )(<RangePicker format={DD_MM_YYYY} />)}
                  </FormItemStyled>
                )}
              </Col>
            </Row>
          </Container>
        </Form>
      </SearchFormContainer>
    )
  }
}

SearchForm.propTypes = {
  setQueryParam: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  loadingSearch: PropTypes.bool,
}
