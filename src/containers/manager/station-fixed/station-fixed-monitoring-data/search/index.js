import { Col, Form, Row } from 'antd'
import CategoryApi from 'api/CategoryApi'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import StationFixedReport from 'api/station-fixed/StationFixedReportApi'
import createLang, { translate as t } from 'hoc/create-lang'
import { get } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { getTimeUTC } from 'utils/datetime/index'
import SelectPoint from './SelectPoint'
import SelectProvinceForm from './SelectProvinceForm'
import SelectRange from './SelectRange'
import SelectStationTypes from './SelectStationTypes'

export const FIELDS = {
  PROVINCES: 'provinceId',
  STATION_TYPE_ID: 'stationTypeId',
  POINT: 'point',
  RANGE_PICKER: 'timeRange',
  PHASE: 'phase',
}

@createLang
@Form.create()
export default class Search extends React.Component {
  state = {
    stationTypes: [],
    points: [],
    initialPoints: [],
  }

  componentDidMount = async () => {
    const stationType = await CategoryApi.getStationTypes({}, { isAuto: false })
    const periodic = await StationFixedPeriodic.getStationFixedPeriodics({}, {})

    const allStationTypes = {
      color: '',
      icon: '',
      isAuto: false,
      key: 'all',
      name: t('global.all'),
      numericalOrder: 1,
      _id: stationType.data.map(item => item._id),
    }

    const newStationTypes = [allStationTypes, ...stationType.data]

    if (stationType.success) {
      this.setState({ stationTypes: newStationTypes || [] })
    }

    this.setState(
      { points: periodic.data, initialPoints: periodic.data },
      () => {
        const params = {
          from: getTimeUTC(moment(new Date(0))),
          to: getTimeUTC(moment(new Date())),
        }
        this.getListMonitoringData(params)
      }
    )

    this.setState({ stationTypes: newStationTypes })
  }

  handleSelectStationType = () => {
    const { form } = this.props
    const { initialPoints } = this.state

    const stationTypeId = form.getFieldValue(FIELDS.STATION_TYPE_ID)
    const provinceId = form.getFieldValue(FIELDS.PROVINCES)

    const newPoints = initialPoints.filter(
      point =>
        point.stationTypeId === stationTypeId && point.provinceId === provinceId
    )

    this.setState({ points: newPoints })
  }

  getListMonitoringData = async params => {
    const { setMonitoringData } = this.props

    setMonitoringData([], true)
    if (
      params.stationIds === '' ||
      params.from === 'Invalid date' ||
      params.to === 'Invalid date'
    ) {
      setMonitoringData([], false)
      return
    }
    try {
      const dataSource = await StationFixedReport.getStationFixedReports(params)
      setMonitoringData(dataSource, false)
    } catch (error) {
      console.log(error)
      setMonitoringData([], false)
    }
  }

  handlePointSelected = pointSelected => {
    const { form } = this.props

    const [startTime, endTime] = get(
      form.getFieldsValue([FIELDS.RANGE_PICKER]),
      'timeRange',
      ['', '']
    )

    const params = {
      stationIds: pointSelected.join(','),
      from: getTimeUTC(moment(startTime)),
      to: getTimeUTC(moment(endTime)),
    }

    this.getListMonitoringData(params)
  }

  handleTimeSelected = timeSelected => {
    const { form } = this.props

    const stationId = get(
      form.getFieldsValue([FIELDS.POINT]),
      'point',
      []
    ).join(',')

    const params = {
      stationIds: stationId,
      from: getTimeUTC(moment(timeSelected[0])),
      to: getTimeUTC(moment(timeSelected[1])),
    }

    this.getListMonitoringData(params)
  }

  render() {
    const { form } = this.props
    const { stationTypes, points } = this.state

    return (
      <React.Fragment>
        <Form>
          <Row gutter={12}>
            <Col span={12}>
              <SelectProvinceForm
                label={t('dataPointReport.form.label.province')}
                form={form}
              />
            </Col>
            <Col span={12}>
              <SelectStationTypes
                label={t('dataPointReport.form.label.stationType')}
                stationTypes={stationTypes}
                handleOnSelectStationType={this.handleSelectStationType}
                form={form}
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <SelectPoint
                label={t('dataPointReport.form.label.point')}
                form={form}
                points={points}
                onChangePoint={this.handlePointSelected}
              />
            </Col>
            <Col span={12}>
              <SelectRange
                label={t('stationFixedManager.label.timeRange')}
                form={form}
                onChangeTimeRange={this.handleTimeSelected}
              />
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
