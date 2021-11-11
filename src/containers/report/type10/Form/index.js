import { Button, Col, Form, Row } from 'antd'
import { default as SearchFormContainer } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FIELDS } from '../index'
import SelectReportType from './SelectReportType'
import SelectTime from './SelectTime'

function i18n() {
  return {
    error: {
      stationType: translate('avgSearchFrom.form.stationType.error'),
      fromMonth: translate('avgSearchFrom.form.fromMonth.error'),
      toMonth: translate('avgSearchFrom.form.toMonth.error'),
      toMonth_1: translate('avgSearchFrom.form.toMonth.error1'),
      toMonth_2: translate('avgSearchFrom.form.toMonth.error2'),
    },
    label: {
      stationType: translate('avgSearchFrom.form.stationType.label'),
      fromMonth: translate('avgSearchFrom.form.fromMonth.label'),
      toMonth: translate('avgSearchFrom.form.toMonth.label'),
      station: translate('apiSharingNew.fields.stationAuto'),
    },
  }
}

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
    const { form } = this.props
    this.setState({ stationAutos })
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({
      [FIELDS.STATION_KEYS]: stationAutoKeys,
    })
    this.submit()
  }

  handleOnStationTypeChange = value => {
    const { form } = this.props
    const stationAutos = this.state.stationAutos.filter(
      station => station.stationType.key === value
    )
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
            // fromDate: moment(values.fromMonth).startOf("month").utc().format(), // NOTE lấy thời điẻm người dung mún seartch sau đó convert sang giờ UTC để rếarch data
            // toDate: moment(values.toMonth).endOf("month").utc().format()
          })
        }
      }
    })
  }

  handleOnStatisticChange = value => {
    const { form, resetData } = this.props
    resetData()
    form.setFieldsValue({
      [FIELDS.TIME_TYPE]: value,
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
              <Item label={translate('report.label.dataRatio.statistic')}>
                {form.getFieldDecorator(FIELDS.STATISTIC, {
                  onChange: this.handleOnStatisticChange,
                  initialValue: 'month',
                })(<SelectReportType />)}
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
            <Col span={8}>
              <Item label={i18n().label.stationType}>
                {form.getFieldDecorator('stationType', {
                  onChange: this.handleOnStationTypeChange,
                  initialValue: '',
                })(<SelectStationType isShowAll />)}
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
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
                    stationType={stationType}
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
