import { Col, Form, Row } from 'antd'
import CategoryApi from 'api/CategoryApi'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import StationFixedReport from 'api/station-fixed/StationFixedReportApi'
import { FormItem } from 'components/layouts/styles'
import createLang, { translate as t } from 'hoc/create-lang'
import { get, isEmpty } from 'lodash'
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

    if (stationType.success) {
      this.setState({ stationTypes: stationType.data || [] })
    }

    this.setState(
      { points: periodic.data, initialPoints: periodic.data },
      () => {
        const params = {
          from: getTimeUTC(moment(new Date(0))),
          to: getTimeUTC(moment(new Date())),
        }
        this.setListMonitoringData(params)
      }
    )

    this.setState({ stationTypes: stationType.data })
  }

  handleSelectedStationType = () => {
    const { form } = this.props
    const { initialPoints } = this.state

    const stationTypeId = form.getFieldsValue([FIELDS.STATION_TYPE_ID])
      .stationTypeId
    const provinceId = form.getFieldsValue([FIELDS.PROVINCES]).provinceId

    if (provinceId === '') {
      const newPoints = initialPoints.filter(
        point => point.stationTypeId === stationTypeId
      )
      this.setState({ points: newPoints })
      const params = {
        stationIds: newPoints.map(point => point._id).join(','),
        from: getTimeUTC(moment(new Date(0))),
        to: getTimeUTC(moment(new Date())),
      }
      this.setListMonitoringData(params)
    } else {
      const newPoints = initialPoints.filter(
        point =>
          point.stationTypeId === stationTypeId &&
          point.provinceId === provinceId
      )
      this.setState({ points: newPoints })
    }
  }

  handleSelectedProvince = provinceId => {
    const { form } = this.props
    const { initialPoints } = this.state

    const stationTypeId = form.getFieldValue(FIELDS.STATION_TYPE_ID)
    form.resetFields([FIELDS.POINT])

    if (provinceId === '') {
      const newPoints = initialPoints.filter(
        point => point.stationTypeId === stationTypeId
      )
      this.setState({ points: newPoints })
    } else {
      const newPoints = initialPoints.filter(
        point => point.provinceId === provinceId
      )
      this.setState({ points: newPoints })

      const params = {
        stationIds: newPoints.map(point => point._id).join(','),
        from: getTimeUTC(moment(new Date(0))),
        to: getTimeUTC(moment(new Date())),
      }
      this.setListMonitoringData(params)
    }
  }

  handleSelectedPoint = pointSelected => {
    const { form } = this.props
    const { initialPoints } = this.state

    const [startTime, endTime] = get(
      form.getFieldsValue([FIELDS.RANGE_PICKER]),
      'timeRange',
      [getTimeUTC(moment(new Date(0))), getTimeUTC(moment(new Date()))]
    )

    const provinceId = form.getFieldsValue([FIELDS.PROVINCES]).provinceId
    const pointsOfProvince = initialPoints.filter(
      point => point.provinceId === provinceId
    )

    const params = {
      stationIds: isEmpty(pointSelected)
        ? pointsOfProvince.map(point => point._id).join(',')
        : pointSelected.join(','),
      from: getTimeUTC(moment(startTime)),
      to: getTimeUTC(moment(endTime)),
    }

    this.setListMonitoringData(params)
  }

  handleSelectedTime = timeSelected => {
    const { form } = this.props
    const { initialPoints } = this.state

    const stationId = get(
      form.getFieldsValue([FIELDS.POINT]),
      'point',
      []
    ).join(',')

    const provinceId = form.getFieldsValue([FIELDS.PROVINCES]).provinceId
    const pointsOfProvince = initialPoints.filter(
      point => point.provinceId === provinceId
    )

    const params = {
      stationIds: stationId
        ? stationId
        : pointsOfProvince.map(point => point._id).join(','),
      from: getTimeUTC(moment(timeSelected[0])),
      to: getTimeUTC(moment(timeSelected[1])),
    }

    this.setListMonitoringData(params)
  }

  setListMonitoringData = async params => {
    const { setMonitoringData } = this.props

    setMonitoringData([], true)
    if (
      params.stationIds === '' &&
      params.from === getTimeUTC(moment(new Date(0))) &&
      params.to === getTimeUTC(moment(new Date()))
    ) {
      setMonitoringData([], false)
      return
    }
    try {
      if (params.from === getTimeUTC(moment(new Date()))) {
        const dataSource = await StationFixedReport.getStationFixedReports({
          stationIds: params.stationIds,
          from: getTimeUTC(moment(new Date(0))),
          to: params.to,
        })
        setMonitoringData(dataSource, false)
      } else {
        const dataSource = await StationFixedReport.getStationFixedReports(
          params
        )
        setMonitoringData(dataSource, false)
      }
    } catch (error) {
      console.log(error)
      setMonitoringData([], false)
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
                onChangeProvince={this.handleSelectedProvince}
              />
            </Col>
            <Col span={12}>
              <SelectStationTypes
                label={t('dataPointReport.form.label.stationType')}
                stationTypes={stationTypes}
                handleOnSelectStationType={this.handleSelectedStationType}
                form={form}
                isShowAll
              />
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <FormItem label={t('stationFixedManager.label.point')}>
                {form.getFieldDecorator(FIELDS.POINT, {
                  onChange: this.handleSelectedPoint,
                })(
                  <SelectPoint
                    label={t('stationFixedManager.label.point')}
                    points={points}
                    mode="multiple"
                    size="large"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <SelectRange
                label={t('stationFixedManager.label.timeRange')}
                form={form}
                onChangeTimeRange={this.handleSelectedTime}
              />
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
