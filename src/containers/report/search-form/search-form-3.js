import { Button, Col, DatePicker, Form, Row, Switch } from 'antd'
import { default as SearchFormContainer } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
import SelectStationAuto from 'containers/search/common/select-station-auto' //'.././common/select-station-auto'
import { ToolTip } from 'containers/search/common/tooltip'
import createLang, { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

const { MonthPicker } = DatePicker

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

function i18n() {
  return {
    label: {
      buttonSearch: translate('addon.search'),
      headerSearch: translate('addon.searchSelect'),
      province: translate('qaqc.province.label'),
      stationType: translate('dataSearchFrom.form.stationType.label'),
      stationAuto: translate('dataSearchFrom.form.stationAuto.label'),
      selectTimeRange: translate('avgSearchFrom.selectTimeRange.month'),
      selectTimeRange2: translate('avgSearchFrom.selectTimeRange.day'),
      processData: translate('dataSearchFrom.processData'),
    },
    error: {
      stationAuto: translate('avgSearchFrom.form.stationAuto.error'),
      selectTimeRange: translate('avgSearchFrom.selectTimeRange.error'),
      stationType: translate('dataSearchFrom.form.stationType.require'),
    },
  }
}

@Form.create()
@createLang
export default class SearchForm extends React.Component {
  static propTypes = {
    cbSubmit: PropTypes.func,
    isDatePicker: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // this.submit = this.submit.bind(this);
    this.state = {
      measuringList: [],
      stationName: '',
    }
  }

  submit = () => {
    // let me = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (this.props.cbSubmit) {
          const measuringListStr = this.state.measuringList.map(item =>
            encodeURIComponent(item.key)
          )

          const measuringListUnitStr = this.state.measuringList.map(item =>
            encodeURIComponent(item.unit)
          )
          // .join(",");
          this.props.cbSubmit({
            ...values,
            measuringListStr,
            measuringListUnitStr,
            measuringList: this.state.measuringList,
            stationName: this.state.stationName,
          })
        }
      }
    })
  }

  setDefaultStationType = stationTypes => {
    const { form } = this.props
    form.setFieldsValue({ stationType: get(stationTypes, '0.key') })
  }

  setDefaultStationAuto = stationAutos => {
    const { form } = this.props
    const stationType = form.getFieldValue('stationType')
    const results = stationAutos.filter(
      station => station.stationType.key === stationType
    )
    form.setFieldsValue({ stationAuto: get(results, '0.key') })
    this.setState(
      {
        measuringList: get(results, '0.measuringList'),
        stationName: get(results, '0.name'),
      },
      () => {
        this.submit()
      }
    )
  }

  render() {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form

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
              {i18n().label.buttonSearch}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {i18n().label.headerSearch}
        </Heading>
        <div style={{ padding: '8px 16px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Item label={i18n().label.province}>
                {getFieldDecorator('province', {
                  onChange: val => {
                    setFieldsValue({ stationAuto: null })
                  },
                })(<SelectProvince isShowAll size="large" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={i18n().label.stationType}>
                {getFieldDecorator('stationType', {
                  rules: [
                    {
                      required: true,
                      message: i18n().error.stationType,
                    },
                  ],
                  onChange: val => {
                    setFieldsValue({ stationAuto: null })
                  },
                })(
                  <SelectStationType
                    size="large"
                    onFetchSuccess={this.setDefaultStationType}
                  />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={i18n().label.stationAuto}>
                {getFieldDecorator('stationAuto', {
                  rules: [
                    {
                      required: true,
                      message: i18n().error.stationAuto,
                    },
                  ],
                })(
                  <SelectStationAuto
                    size="large"
                    onFetchSuccess={this.setDefaultStationAuto}
                    stationTypeKey={getFieldValue('stationType')}
                    provinceKey={getFieldValue('province')}
                    onChangeObject={station => {
                      if (station && station.measuringList)
                        this.setState({
                          measuringList: station.measuringList,
                          stationName: station.name,
                        })
                      else this.setState({ measuringList: [] })
                    }}
                    style={{ width: '100%' }}
                  />
                )}
              </Item>
            </Col>
            {!this.props.isDatePicker && (
              <Col span={6}>
                <Item label={i18n().label.selectTimeRange}>
                  {getFieldDecorator('time', {
                    initialValue: moment(),
                    rules: [
                      {
                        required: true,
                        message: i18n().error.selectTimeRange,
                      },
                    ],
                  })(
                    <MonthPicker
                      style={{ width: '100%' }}
                      size="large"
                      format={MM_YYYY}
                    />
                  )}
                </Item>
              </Col>
            )}
            {this.props.isDatePicker && (
              <Col span={6}>
                <Item label={i18n().label.selectTimeRange2}>
                  {getFieldDecorator('time', {
                    initialValue: moment(),
                    rules: [
                      {
                        required: true,
                        message: i18n().error.selectTimeRange,
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      format={DD_MM_YYYY}
                    />
                  )}
                </Item>
              </Col>
            )}
          </Row>
          <Row type="flex" justify="end">
            <Col>
              <Row type="flex" align="middle">
                <Col>
                  <ToolTip />
                </Col>
                <Col>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {i18n().label.processData}
                  </div>
                </Col>
                <Col>
                  <div style={{ marginLeft: '10px' }}>
                    <Item>
                      {getFieldDecorator('isFilter', {
                        initialValue: false,
                      })(<Switch />)}
                    </Item>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    )
  }
}
