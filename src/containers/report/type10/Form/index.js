import { Button, Col, Form, Row } from 'antd'
import { default as SearchFormContainer } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
// import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FIELDS, i18n, REPORT_TYPE } from '../constants'
import SelectReportType from './SelectReportType'
import SelectStatisticType from './SelectStatisticType'
import SelectTime from './SelectTime'

const Label = styled.label`
  ::before {
    display: inline-block;
    margin-right: 4 px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`

const Item = props => (
  <Form.Item
    className="noMarginBot"
    {...props}
    colon={false}
    style={{
      color: 'rgba(0,0,0,0.8)',
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 0,
    }}
  />
)

// Search form ty le nhan du lieu
@Form.create()
@connect(state => ({
  stationAutos: state.stationAuto.list,
}))
export default class SearchForm extends React.Component {
  static propTypes = {
    cbSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      stationAutos: [],
    }
  }

  fetchStationAutoSuccess = stationAutos => {
    const { form, setStationAutos } = this.props
    this.setState({ stationAutos })
    setStationAutos(stationAutos)
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION_KEYS]: stationAutoKeys,
    })
    this.submit()
  }

  handleOnStationTypeChange = value => {
    const { form } = this.props
    let { stationAutos } = this.state

    if (value) {
      stationAutos = this.state.stationAutos.filter(
        station => station.stationType.key === value
      )
    }

    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({ [FIELDS.STATION_KEYS]: stationAutoKeys })
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let from, to
        if (values[FIELDS.TIME_TYPE] === 'date') {
          from = values[FIELDS.TIME_VALUE][0].clone().startOf('day')
          to = values[FIELDS.TIME_VALUE][1].clone().endOf('day')
        } else {
          from = values[FIELDS.TIME_VALUE][0].clone().startOf('month')
          to = values[FIELDS.TIME_VALUE][1].clone().endOf('month')
        }

        if (this.props.cbSubmit) {
          this.props.cbSubmit({
            ...values,
            from,
            to,
            type: values[FIELDS.TIME_TYPE],
            // fromDate: moment(values.fromMonth).startOf("month").utc().format(), // NOTE lấy thời điẻm người dung mún seartch sau đó convert sang giờ UTC để rếarch data
            // toDate: moment(values.toMonth).endOf("month").utc().format()
          })
        }
      }
    })
  }

  handleOnStatisticChange = value => {
    const { form } = this.props
    const { stationAutos } = this.state

    form.resetFields()
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION_KEYS]: stationAutoKeys,
      [FIELDS.TIME_TYPE]: value,
    })
  }

  handleOnReportTypeChange = type => {
    const { form } = this.props
    const { stationAutos } = this.state

    form.resetFields()
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION_KEYS]: stationAutoKeys,
      [FIELDS.REPORT_TYPE]: type,
    })
  }

  render() {
    const { form } = this.props
    const stationType = form.getFieldValue('stationType')

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              style={{ float: 'right' }}
              onClick={this.submit}
              size="small"
            >
              {translate('addon.search')}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {translate('addon.searchSelect')}
        </Heading>
        <div style={{ padding: '8px 16px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Item label="Loại báo cáo">
                {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
                  onChange: this.handleOnReportTypeChange,
                  initialValue: REPORT_TYPE.BASIC,
                })(<SelectReportType />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={translate('report.label.dataRatio.statistic')}>
                {form.getFieldDecorator(FIELDS.STATISTIC, {
                  onChange: this.handleOnStatisticChange,
                  initialValue: 'month',
                })(<SelectStatisticType />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label={
                  <Label>{translate('dataSearchFilterForm.form.time')}</Label>
                }
              >
                <SelectTime form={form} />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Item label={i18n().label.stationType}>
                {form.getFieldDecorator('stationType', {
                  onChange: this.handleOnStationTypeChange,
                  initialValue: '',
                })(<SelectStationType isShowAll />)}
              </Item>
            </Col>
            <Col span={16}>
              <Item label={i18n().label.station}>
                {form.getFieldDecorator(FIELDS.STATION_KEYS, {
                  rules: [
                    {
                      required: true,
                      message: translate(
                        'ticket.required.incident.stationName'
                      ),
                    },
                  ],
                })(
                  <SelectStationAuto
                    onFetchSuccess={this.fetchStationAutoSuccess}
                    mode="multiple"
                    style={{ width: '100%' }}
                    stationTypeKey={stationType}
                  />
                )}
              </Item>
            </Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    )
  }
}
