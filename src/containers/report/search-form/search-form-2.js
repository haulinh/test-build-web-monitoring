import { Button, Col, Form, Row, Select } from 'antd'
import { default as SearchFormContainer } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
import { translate } from 'hoc/create-lang'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'

const FIELDS = {
  STATION_IDS: 'stationIds',
  STATISTIC: 'statistic',
}

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

const SelectReportType = props => {
  return (
    <Select style={{ width: '100%' }} {...props}>
      <Select.Option value="rangeTime">
        {translate('report.label.dataRatio.type.rangeTime')}
      </Select.Option>
      <Select.Option value="date">
        {translate('report.label.dataRatio.type.date')}
      </Select.Option>
    </Select>
  )
}

// Search form ty le nhan du lieu
@Form.create()
export default class SearchForm extends React.Component {
  static propTypes = {
    cbSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
    }
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      // console.log(err, values)
      if (!err) {
        // console.log("Received values of form: ", values);
        // console.log(moment(values.fromMonth).startOf("month").format())

        values.fromMonth = moment(values.fromMonth).startOf('month')
        values.toMonth =
          moment(values.toMonth).endOf('month') > moment()
            ? moment()
            : moment(values.toMonth).endOf('month')
        if (this.props.cbSubmit) {
          this.props.cbSubmit({
            ...values,
            // fromDate: moment(values.fromMonth).startOf("month").utc().format(), // NOTE l???y th???i ??i???m ng?????i dung m??n seartch sau ???? convert sang gi??? UTC ????? r???arch data
            // toDate: moment(values.toMonth).endOf("month").utc().format()
          })
        }
      }
    })
  }

  compareTofromDate = (rule, value, callback) => {
    const { form } = this.props
    console.log()
    if (value && value < form.getFieldValue('fromMonth')) {
      callback(i18n().error.toMonth_1)
    }
    if (value && value.isAfter(moment(), 'month')) {
      callback(i18n().error.toMonth_2)
    } else {
      callback()
    }
  }

  render() {
    const {
      form: { getFieldValue, getFieldDecorator },
      // getFieldValue,
      // setFieldsValue
    } = this.props

    const stationType = getFieldValue('stationType')

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
                {getFieldDecorator(FIELDS.STATISTIC, {
                  initialValue: 'rangeTime',
                })(<SelectReportType />)}
              </Item>
            </Col>
            <Col></Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Item label={i18n().label.stationType}>
                {getFieldDecorator('stationType', {
                  initialValue: '',
                })(<SelectStationType isShowAll />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={i18n().label.station}>
                {getFieldDecorator(FIELDS.STATION_IDS, {
                  rules: [
                    {
                      required: true,
                      message: translate(
                        'ticket.required.incident.stationName'
                      ),
                    },
                  ],
                })(<SelectStationAuto stationType={stationType} />)}
              </Item>
            </Col>
            <Col></Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    )
  }
}
