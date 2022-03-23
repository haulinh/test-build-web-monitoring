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
    pointSelected: '',
    timeSelected: [],
  }

  componentDidMount = async () => {
    const response = await CategoryApi.getStationTypes({}, { isAuto: false })
    const periodic = await StationFixedPeriodic.getStationFixedPeriodics({}, {})

    const allStationTypes = {
      color: '',
      icon: '',
      isAuto: false,
      key: 'all',
      name: t('global.all'),
      numericalOrder: 1,
      _id: response.data.map(item => item._id),
    }

    response.data.unshift(allStationTypes)

    if (response.success) {
      this.setState({ stationTypes: response.data || [] })
    }

    this.setState(
      { points: periodic.data, initialPoints: periodic.data },
      () => {
        const { points } = this.state
        const params = {
          stationId: points.map(point => point._id).join(','),
          from: getTimeUTC(moment(new Date(0))),
          to: getTimeUTC(moment(new Date())),
        }
        this.getListMonitoringData(params)
      }
    )

    this.setState({ stationTypes: response.data })
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
    const { getMonitoringData } = this.props

    getMonitoringData([], true)
    try {
      const dataSource = await StationFixedReport.getStationFixedReports(params)
      getMonitoringData(dataSource, false)
    } catch (error) {
      console.log(error)
      getMonitoringData([], false)
    }
  }

  getPointSelected = pointSelected => {
    this.setState({ pointSelected })
  }

  getTimeSelected = timeSelected => {
    const formatTimeSelected = timeSelected.map(time =>
      getTimeUTC(moment(time))
    )
    this.setState({ timeSelected: formatTimeSelected })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { form } = this.props
    const { points, pointSelected, timeSelected } = this.state

    const [startTime, endTime] = get(
      form.getFieldsValue([FIELDS.RANGE_PICKER]),
      'timeRange',
      ['', '']
    )
    const stationId = get(
      form.getFieldsValue([FIELDS.POINT]),
      'point',
      points.map(point => point._id)
    ).join(',')

    if (
      pointSelected !== prevState.pointSelected ||
      timeSelected.join(',') !== prevState.timeSelected.join(',')
    ) {
      const params = {
        stationId: stationId,
        from: getTimeUTC(moment(startTime)),
        to: getTimeUTC(moment(endTime)),
      }

      this.getListMonitoringData(params)
    }
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
                changePoint={this.getPointSelected}
              />
            </Col>
            <Col span={12}>
              <SelectRange
                label={t('stationFixedManager.label.timeRange')}
                form={form}
                changeTimeRange={this.getTimeSelected}
              />
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
