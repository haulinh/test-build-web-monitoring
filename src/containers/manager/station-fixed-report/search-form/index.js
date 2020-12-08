import { Button, Col, DatePicker, Form, Row, Select, Switch } from 'antd'
import Text from 'antd/lib/typography/Text'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationType from 'components/elements/select-station-type'
import createLang from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

const { Option } = Select

const phases = [
  {
    _id: '5fcde7a82557bd6c060a6c7e',
    name: 'TEST_QUI',
  },
  {
    _id: '5fcf06664af37b43c9ec9709',
    name: ' dot 1',
  },
  {
    _id: '5fcf067a4af37b43c9ec970a',
    name: ' dot 2',
  },
  {
    _id: '5fcf06824af37b43c9ec970b',
    name: ' dot 3',
  },
  {
    _id: '5fcf068e4af37b43c9ec970c',
    name: ' dot 4',
  },
  {
    _id: '5fcf06944af37b43c9ec970d',
    name: ' dot 5',
  },
]

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
export default class SearchForm extends React.Component {
  state = {
    phases: [],
  }

  async componentDidMount() {
    const filter = {
      limit: 100,
      skip: 0,
      include: [{ relation: 'stationType' }],
    }
    const phases = await getPhase({ filter })
    this.setState({ phases })
    console.log('result :>> ', this.state.phases)
  }

  handleOnSubmit = async e => {
    e.preventDefault()
    const values = await this.props.form.validateFields()
    console.log('🚀 ~ file: index.js ~ line 76 ~ SearchForm ~ values', values)

    let where = {}
    if (values.startDate) {
      const startDate = moment(values.startDate)
        .utc()
        .format()
      where.startDate = startDate
    }
    if (values.endDate) {
      const endDate = moment(values.endDate)
        .utc()
        .format()
      where.endDate = endDate
    }
    if (values.phase && values.phase.length > 0) {
      const _id = {
        inq: values.phase,
      }
      where._id = _id
    }
    if (values.stationTypeId) {
      const stationTypeId = values.stationTypeId
      where.stationTypeId = stationTypeId
    }
    const filter = {
      limit: 100,
      skip: 0,
      where,
      include: [{ relation: 'stationType' }],
    }

    console.log('🚀 ~ file: index.js ~ line 80 ~ SearchForm ~ filter', filter)
    const phases = await getPhase({ filter })
    this.setState({ phases })
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    const { form } = this.props
    console.log('this.state.phases :>> ', this.state.phases)
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
                  {form.getFieldDecorator(FIELDS.STATION_TYPE_ID)(
                    <SelectStationType size="large" />
                  )}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="Đợt quan trắc">
                  {form.getFieldDecorator(FIELDS.PHASE)(
                    <Select
                      size="large"
                      mode="multiple"
                      style={{ width: '100%' }}
                    >
                      {phases.map(phase => (
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
                  {form.getFieldDecorator(FIELDS.POINT)(
                    <Select size="large" style={{ width: '100%' }} />
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
        <BoxShadowStyle>
          {this.state.phases &&
            this.state.phases.map(phase => (
              <Row>
                <Col span={12}>
                  <Text>{phase.name}</Text>
                </Col>
                <Col span={12}>
                  <Text>{phase.stationType.name}</Text>
                </Col>
              </Row>
            ))}
        </BoxShadowStyle>
      </SearchFormContainer>
    )
  }
}
