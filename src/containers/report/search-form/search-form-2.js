import React from 'react'
import PropTypes from 'prop-types'
import { default as SearchFormContainer } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import { Row, Col, Button, Form, DatePicker } from 'antd'
import { translate } from 'hoc/create-lang'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
import moment from 'moment-timezone'
import { MM_YYYY } from 'constants/format-date'
// import { DD_MM_YYYY_HH_MM } from "constants/format-date.js";

const { MonthPicker } = DatePicker

const i18n = {
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
  },
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
            // fromDate: moment(values.fromMonth).startOf("month").utc().format(), // NOTE lấy thời điẻm người dung mún seartch sau đó convert sang giờ UTC để rếarch data
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
      callback(i18n.error.toMonth_1)
    }
    if (value && value.isAfter(moment(), 'month')) {
      callback(i18n.error.toMonth_2)
    } else {
      callback()
    }
  }

  render() {
    const {
      getFieldDecorator,
      // getFieldValue,
      // setFieldsValue
    } = this.props.form
    // console.log(i18n, "i18n");
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
              <Item label={i18n.label.stationType}>
                {getFieldDecorator('stationType', {
                  initialValue: '',
                })(<SelectStationType isShowAll />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={i18n.label.fromMonth}>
                {getFieldDecorator('fromMonth', {
                  initialValue: moment().add(-2, 'months'),
                  rules: [
                    {
                      required: true,
                      message: i18n.error.fromMonth,
                    },
                  ],
                })(<MonthPicker style={{ width: '100%' }} format={MM_YYYY}/>)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label={i18n.label.toMonth}>
                {getFieldDecorator('toMonth', {
                  initialValue: moment().add(-1, 'months'),
                  rules: [
                    {
                      required: true,
                      message: i18n.error.toMonth,
                    },
                    {
                      validator: this.compareTofromDate,
                    },
                  ],
                })(<MonthPicker style={{ width: '100%' }} format={MM_YYYY}/>)}
              </Item>
            </Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    )
  }
}
