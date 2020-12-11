import { Button, Col, DatePicker, Form, Row, Select, Switch } from 'antd'
import CategoryApi from 'api/CategoryApi'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import createLang from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { getPoint } from '../../../../api/station-fixed/StationFixedPointApi'

const { Option } = Select

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

const FIELDS = {
  STATION_TYPE_ID: 'stationTypeId',
  PHASE: 'phase',
  POINT: 'point',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  EXCEEDED_QCVN: 'exceededQCVN',
}

@createLang
@Form.create()
export class SearchForm extends React.Component {
  state = {
    phases: [],
    points: [],
    stationTypes: [],
  }

  async componentDidMount() {
    const filterPhase = {
      limit: 100,
      skip: 0,
      include: [{ relation: 'stationType' }],
    }
    const phases = await getPhase({ filter: filterPhase })

    const filterPoint = {
      limit: 100,
      skip: 0,
    }
    const points = await getPoint({ filter: filterPoint })

    const stationTypes = await CategoryApi.getStationTypes({})
    if (stationTypes.success)
      this.setState({
        stationTypes: stationTypes.data || [],
        value: this.props.value || (this.props.isShowAll ? '' : undefined),
      })
    this.setState({
      phases,
      points: points.data,
      stationTypes: stationTypes.data,
    })
  }

  handleOnSubmit = async e => {
    e.preventDefault()
    const values = await this.props.form.validateFields()

    const paramQuery = {
      phaseIds: values.phase,
      pointKeys: values.point,
      startDate: moment(values.startDate)
        .utc()
        .format(),
      endDate: moment(values.endDate)
        .utc()
        .format(),
      stationTypeId: values.stationTypeId,
    }

    this.props.handleOnSearch(paramQuery)
  }

  render() {
    const { phases, points, stationTypes } = this.state
    const { form } = this.props
    const config = {
      rules: [{ required: true }],
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
                // onClick={this.props.handleSubmit(this.handleSubmit)}
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
                <Form.Item label="Loại trạm">
                  {form.getFieldDecorator(
                    FIELDS.STATION_TYPE_ID,
                    config
                  )(
                    <Select>
                      {stationTypes &&
                        stationTypes.length > 0 &&
                        stationTypes.map(stationType => (
                          <Option value={stationType._id}>
                            {stationType.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="Đợt quan trắc">
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
                          <Option value={phase._id}>{phase.name}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Điểm quan trắc">
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
                          <Option value={point.key}>{point.name}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="Từ tháng">
                  {form.getFieldDecorator(FIELDS.START_DATE)(
                    <DatePicker size="large" />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Đến tháng">
                  {form.getFieldDecorator(FIELDS.END_DATE)(
                    <DatePicker size="large" />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Vượt quy chuẩn">
                  {form.getFieldDecorator(FIELDS.EXCEEDED_QCVN)(
                    <Switch size="large" />
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
