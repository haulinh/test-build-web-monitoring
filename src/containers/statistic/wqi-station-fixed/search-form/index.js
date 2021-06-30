import {Button, Col, DatePicker, Form, Radio, Row} from 'antd'
import CalculateApi from 'api/CalculateApi'
import {getPhase} from 'api/station-fixed/StationFixedPhaseApi'
import {getPoint} from 'api/station-fixed/StationFixedPointApi'
import {default as BoxShadowStyle} from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import {MM_YYYY, YYYY} from 'constants/format-date'
import {translate as t} from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
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
  requireTime: t('wqiStationFix.requireTime'),
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
    isLoading: false,
  }

  async componentDidMount() {
    const stationTypes = await CalculateApi.getStationTypeCalculateByWQI()
    this.setState({stationTypes})
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
        calculateType: 'WQI',
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
    e.preventDefault()
    const {onSearch} = this.props;
    const values = await this.props.form.validateFields()

    const [from, to] = values[FIELDS.RANGE_PICKER]

    const params = {
      phaseIds: (values[FIELDS.PHASE] ? values[FIELDS.PHASE] : []).join(),
      pointKeys: (values[FIELDS.POINT] ? values[FIELDS.POINT] : []).join(),
      type: values.type,
      from: from.toDate(),
      to: to.toDate(),
    }

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
              <Col xs={8}>
                <Form.Item label={i18n.viewBy}>
                {form.getFieldDecorator(FIELDS.TYPE, {initialValue: 'month'})(
                    <Radio.Group>
                      <Radio value={'month'}>{i18n.month}</Radio>
                      <Radio value={'quarter'}>{i18n.quarter}</Radio>
                      <Radio value={'year'}>{i18n.year}</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label={i18n.time}>
                  {form.getFieldDecorator(FIELDS.RANGE_PICKER, {
                    //initialValue: [
                    //moment().subtract(2, 'year').startOf('year'),
                    //moment().add(1, 'year').startOf(year)
                  //],
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
  onSearch: PropTypes.func.isRequired,
}

export default Form.create()(SearchForm)
