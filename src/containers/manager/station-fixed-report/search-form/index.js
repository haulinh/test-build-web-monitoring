import { Button, Col, DatePicker, Form, Row, Switch } from 'antd'
import CategoryApi from 'api/CategoryApi'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { DD_MM_YYYY } from 'constants/format-date'
import createLang, { translate as t } from 'hoc/create-lang'
import { isNumber } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { getTimes } from 'utils/datetime'
import SelectPhase from './SelectPhase'
import SelectPoint from './SelectPoint'
import SelectProvinceForm from './SelectProvince'
import SelectQCVNForm from './SelectQCVN'
import SelectStationTypes from './SelectStationTypes'
import SelectTime from './SelectTime'

const { RangePicker } = DatePicker

export const i18n = {
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

export const FormItemStyled = styled(Form.Item)`
  margin-bottom: 0px;
`

export const FIELDS = {
  PROVINCES: 'provinceId',
  STATION_TYPE_ID: 'stationTypeId',
  PHASE: 'phase',
  POINT: 'point',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  IS_EXCEEDED: 'isExceeded',
  RANGE_PICKER: 'rangePicker',
  STANDARD_VN_OBJECT: 'standardVNObject',
  STANDARDS_VN: 'standardsVN',
}

@createLang
@Form.create()
export class SearchForm extends React.Component {
  state = {
    phases: [],
    points: [],
    stationTypes: [],
    isOpenRangePicker: false,
    isLoading: false,
    foreceRerender: true,
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
    // console.log("handleOnSubmit")
    e.preventDefault()
    this.setState({
      foreceRerender: !this.state.foreceRerender,
    })
    const values = await this.props.form.validateFields()
    // console.log(JSON.stringify(values, null, 2))

    const ranges = isNumber(values.time) ? values.time : values.timeRange
    // console.log(ranges, '==ranges==')
    const { from, to } = getTimes(ranges)
    // console.log({ from: from.format('DD/MM/YYYY HH:mm'), to: to.format('DD/MM/YYYY HH:mm') })

    const paramQuery = {
      phaseIds: values.phase,
      pointKeys: values.point,
      startDate: from,
      endDate: to,
      stationTypeId: values.stationTypeId,
      isExceeded: values.isExceeded,
      standardsVN: values.standardsVN,
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
    const { loadingSearch, setQueryParam, setStandardVNObject } = this.props
    const { phases, points, stationTypes, isOpenRangePicker } = this.state
    const { form } = this.props

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
                <SelectProvinceForm
                  label={i18n.provinceLabel}
                  fetchPoints={this.fetchPoints}
                  form={form}
                />
              </Col>
              <Col span={12}>
                <SelectStationTypes
                  label={i18n.stationTypeLabel}
                  getConfig={() => this.getConfig(i18n.stationTypeRequired)}
                  handleOnSelectStationType={this.handleOnSelectStationType}
                  stationTypes={stationTypes}
                  form={form}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <SelectPhase
                  form={form}
                  phases={phases}
                  label={i18n.phaseLabel}
                  getConfig={() => this.getConfig(i18n.phaseRequired)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <SelectPoint
                  label={i18n.pointLabel}
                  getConfig={() => this.getConfig(i18n.pointRequired)}
                  form={form}
                  points={points}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <SelectTime
                  form={form}
                  label={i18n.timeLabel}
                  getConfig={() => this.getConfig(t(''))}
                  handleOnSelectTime={this.handleOnSelectTime}
                />
              </Col>
              <Col span={8}>
                <FormItemStyled label={i18n.exceededLabel}>
                  {form.getFieldDecorator(FIELDS.IS_EXCEEDED, {
                    initialValue: false,
                  })(<Switch size="large" />)}
                </FormItemStyled>
              </Col>
              <Col span={8}>
                <SelectQCVNForm
                  form={form}
                  setQueryParam={setQueryParam}
                  setStandardVNObject={setStandardVNObject}
                />
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
