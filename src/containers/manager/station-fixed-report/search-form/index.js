import { Button, Col, DatePicker, Form, Row, Select, Switch } from 'antd'
import CategoryApi from 'api/CategoryApi'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import createLang, { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { Field } from 'redux-form'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StationFixedReport } from '../station-fixed-report'

const { Option } = Select
const { RangePicker } = DatePicker

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

const FormItemStyled = styled(Form.Item)`
  margin-bottom: 0px;
`

const FIELDS = {
  STATION_TYPE_ID: 'stationTypeId',
  PHASE: 'phase',
  POINT: 'point',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  EXCEEDED_QCVN: 'exceededQCVN',
  RANGE_PICKER: 'RangePicker',
}

const optionsTimeRange = [
  { key: 1, text: 'dataSearchFrom.options.byHours', value: 24 },
  { key: 7, text: 'dataSearchFrom.options.byDay', value: 7 },
  { key: 15, text: 'dataSearchFrom.options.byDay', value: 15 },
  { key: 30, text: 'dataSearchFrom.options.byDay', value: 30 },
]

@createLang
@Form.create()
export class SearchForm extends React.Component {
  // static propTypes = {
  //  }

  state = {
    phases: [],
    points: [],
    stationTypes: [],
    isOpenRangePicker: false,
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

  fetchPhase = async stationTypeIdSelected => {
    const filterPhase = {
      limit: 100,
      skip: 0,
      where: {
        stationTypeId: stationTypeIdSelected,
      },
      include: [{ relation: 'stationType' }],
    }
    const phases = await getPhase({ filter: filterPhase })

    this.setState({
      phases,
    })
  }

  fetchPoints = async stationTypeIdSelected => {
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {
        stationTypeId: stationTypeIdSelected,
      },
    }
    const points = await getPoint({ filter: filterPoint })

    this.setState({
      points: points.data,
    })
  }

  handleOnSelectStationType = stationTypeIdSelected => {
    this.fetchPhase(stationTypeIdSelected)
    this.fetchPoints(stationTypeIdSelected)
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

    let startDate
    let endDate
    if (this.state.isOpenRangePicker) {
      startDate = values.timeRange[0]
      endDate = values.timeRange[1]
    } else {
      startDate = moment().subtract(values.time, 'days')
      endDate = moment()
    }

    const paramQuery = {
      phaseIds: values.phase,
      pointKeys: values.point,
      startDate: startDate.utc().format(),
      endDate: endDate.utc().format(),
      stationTypeId: values.stationTypeId,
    }

    this.props.setQueryParam(paramQuery)
    this.props.handleOnSearch()
  }

  render() {
    const { phases, points, stationTypes, isOpenRangePicker } = this.state
    const { form } = this.props
    const config = {
      rules: [{ required: true }],
    }
    const rangeConfig = {
      rules: [
        { type: 'array', required: true, message: 'Please select time!' },
      ],
    }
    return (
      <SearchFormContainer>
        <Form onSubmit={this.handleOnSubmit}>
          <Heading
            rightChildren={
              <Button
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
              <Col span={8}>
                <FormItemStyled label="Loại trạm">
                  {form.getFieldDecorator(
                    FIELDS.STATION_TYPE_ID,
                    config
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
              <Col span={16}>
                <FormItemStyled label="Đợt quan trắc">
                  {form.getFieldDecorator(
                    FIELDS.PHASE,
                    config
                  )(
                    <Select
                      size="large"
                      mode="multiple"
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
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItemStyled label="Điểm quan trắc">
                  {form.getFieldDecorator(
                    FIELDS.POINT,
                    config
                  )(
                    <Select
                      mode="multiple"
                      size="large"
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
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItemStyled label="Thời gian">
                  {form.getFieldDecorator('time', {
                    ...config,
                    initialValue: 7,
                  })(
                    <Select onSelect={this.handleOnSelectTime} size="large">
                      {optionsTimeRange.map(({ key, text, value }) => (
                        <Select.Option key={key} value={key}>
                          {t(text, { value })}
                        </Select.Option>
                      ))}
                      <Option key="range" value={FIELDS.RANGE_PICKER}>
                        Trong khoảng
                      </Option>
                    </Select>
                  )}
                </FormItemStyled>
              </Col>
              <Col span={8}>
                <FormItemStyled label="Vượt quy chuẩn">
                  {form.getFieldDecorator(FIELDS.EXCEEDED_QCVN)(
                    <Switch size="large" />
                  )}
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
                    )(<RangePicker />)}
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
  handleOnSearch: PropTypes.func.isRequired,
}
