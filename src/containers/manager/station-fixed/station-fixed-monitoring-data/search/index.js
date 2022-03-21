import { Col, Form, Row } from 'antd'
import CategoryApi from 'api/CategoryApi'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import createLang, { translate as t } from 'hoc/create-lang'
import React from 'react'
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
  }

  async componentDidMount() {
    const response = await CategoryApi.getStationTypes({}, { isAuto: false })

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
    this.fetchPoints()

    this.setState({ stationTypes: response.data })
  }

  fetchPoints = async () => {
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {},
    }

    const points = await getPoint({ filter: filterPoint })

    this.setState({ points: points.data })
  }

  handleSelectStationType = () => {
    const { form } = this.props
    const { points } = this.state

    const stationTypeId = form.getFieldValue(FIELDS.STATION_TYPE_ID)
    const provinceId = form.getFieldValue(FIELDS.PROVINCES)

    const newPoints = points.filter(
      point =>
        point.stationTypeId === stationTypeId && point.provinceId === provinceId
    )

    this.setState({ points: newPoints })
  }
  render() {
    const { form } = this.props
    const { stationTypes, points } = this.state

    console.log({ formValue: form.getFieldsValue() })
    return (
      <React.Fragment>
        <Form>
          <Row gutter={12}>
            <Col span={8}>
              <SelectProvinceForm
                label={t('dataPointReport.form.label.province')}
                form={form}
              />
            </Col>
            <Col span={8}>
              <SelectStationTypes
                label={t('dataPointReport.form.label.stationType')}
                stationTypes={stationTypes}
                handleOnSelectStationType={this.handleSelectStationType}
                form={form}
              />
            </Col>
            <Col span={8}>
              <SelectPoint
                label={t('dataPointReport.form.label.point')}
                form={form}
                points={points}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <SelectRange
                label={t('stationFixedManager.label.timeRange')}
                form={form}
              />
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}
