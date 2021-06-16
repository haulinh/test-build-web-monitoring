import {Button, Col, DatePicker, Form, Radio, Row} from 'antd'
import CategoryApi from 'api/CategoryApi'
import {getPhase} from 'api/station-fixed/StationFixedPhaseApi'
import {getPoint} from 'api/station-fixed/StationFixedPointApi'
import {default as BoxShadowStyle} from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import {MM_YYYY, YYYY} from 'constants/format-date'
import {translate as t} from 'hoc/create-lang'
import {isNumber} from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {getTimes} from 'utils/datetime'
import SelectPhase from './SelectPhase'
import SelectPoint from './SelectPoint'
import SelectProvinceForm from './SelectProvince'
import SelectStationTypes from './SelectStationTypes'

export const i18n = {
  provinceLabel: t('dataPointReport.form.label.province'),
  stationTypeLabel: t('dataPointReport.form.label.stationType'),
  phaseLabel: t('dataPointReport.form.label.phase'),
  pointLabel: t('dataPointReport.form.label.point'),
  timeLabel: t('dataPointReport.form.label.time'),
  stationTypeRequired: t('dataPointReport.form.required.stationType'),
  phaseRequired: t('dataPointReport.form.required.phase'),
  pointRequired: t('dataPointReport.form.required.point'),
  viewBy: t('wqiStationFix.viewBy'),
  month: t('wqiStationFix.month'),
  year: t('wqiStationFix.year'),
  quarter: t('wqiStationFix.quarter'),
  time: t('wqiStationFix.time'),
  requiredTime: t('wqiStationFix.time'),
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
  TYPE: 'type',
  RANGE_PICKER: 'rangePicker',
}

class SearchForm extends React.Component {
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
      {isAuto: false}
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
    this.setState({ isLoading: true})
    const stationTypeId = this.props.form.getFieldValue(FIELDS.STATION_TYPE_ID)
    const filterPhase = {
      limit: 100,
      skip: 0,
      where: {
        stationTypeId: stationTypeId ? stationTypeId : undefined,
      },
      include: [{relation: 'stationType'}],
    }
    const phases = await getPhase({filter: filterPhase})

    this.setState({
      isLoading: false,
      phases,
    })
  }

  fetchPoints = async () => {
    this.setState({ isLoading: true })
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
    const points = await getPoint({filter: filterPoint})

    this.setState({
      isLoading: false,
      points: points.data,
    })
  }

  handleOnSelectStationType = () => {
    const {form} = this.props
    form.setFieldsValue({
      [FIELDS.PHASE]: undefined,
      [FIELDS.POINT]: undefined,
    })
    this.fetchPhase()
    this.fetchPoints()
  }

  handleOnSubmit = async e => {
    const {setQueryParam, onSearch} = this.props;
    const values = await this.props.form.validateFields()

    const ranges = isNumber(values.time) ? values.time : values.timeRange
    const {from, to} = getTimes(ranges)

    const params = {
      phaseIds: values.phase,
      pointKeys: values.point,
      stationTypeId: values.stationTypeId,
      startDate: from,
      endDate: to,
    }

    setQueryParam(params)
    onSearch(params)
  }

  getConfig = msg => {
    return {
      rules: [{required: true, message: msg}],
    }
  }

  render() {
    const {form, loadingSearch} = this.props
    const {phases, points, stationTypes} = this.state
    const formatTime = form.getFieldValue(FIELDS.TYPE) === 'year' ? YYYY : MM_YYYY

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
                {t('addon.search')}
              </Button>
            }
            textColor="#ffffff"
            isBackground
            fontSize={14}
            style={{padding: '8px 16px'}}
          >
            {t('addon.search')}
          </Heading>
          <Container>
            <Row gutter={24}>
              <Col span={6}>
                <SelectProvinceForm
                  label={i18n.provinceLabel}
                  fetchPoints={this.fetchPoints}
                  form={form}
                />
              </Col>
              <Col span={6}>
                <SelectStationTypes
                  label={i18n.stationTypeLabel}
                  getConfig={() => this.getConfig(i18n.stationTypeRequired)}
                  handleOnSelectStationType={this.handleOnSelectStationType}
                  stationTypes={stationTypes}
                  form={form}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <SelectPhase
                  form={form}
                  phases={phases}
                  label={i18n.phaseLabel}
                  getConfig={() => this.getConfig(i18n.phaseRequired)}
                />
              </Col>
              <Col span={12}>
                <SelectPoint
                  label={i18n.pointLabel}
                  getConfig={() => this.getConfig(i18n.pointRequired)}
                  form={form}
                  points={points}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label={i18n.viewBy}>
                  {form.getFieldDecorator(FIELDS.TYPE)(
                    <Radio.Group>
                      <Radio value={'month'}>{i18n.month}</Radio>
                      <Radio value={'quarter'}>{i18n.quarter}</Radio>
                      <Radio value={'year'}>{i18n.year}</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={i18n.time}>
                  {form.getFieldDecorator(FIELDS.RANGE_PICKER, {
                    rules: this.getConfig(i18n.requireTime).rules
                  })(
                    <DatePicker.RangePicker format={formatTime} />
                  )}
                </Form.Item>
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

export default Form.create()(SearchForm)
