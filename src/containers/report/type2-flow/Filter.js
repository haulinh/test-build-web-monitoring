import { Col, Form, Row, Switch } from 'antd'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { i18n } from 'containers/api-sharing/constants'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { ToolTip } from 'containers/search/common/tooltip'
import { get } from 'lodash'
import React from 'react'
import { FIELDS } from './index'
import SelectReportTime from './select-data/SelectReportTime'
import SelectReportType from './select-data/SelectReportType'
import moment from 'moment'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'

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
export default class Filter extends React.Component {
  state = {
    stationAutos: [],
    stationTypes: [],
  }
  handleSelectTimeChange = type => {
    const { form } = this.props
    let value = moment()
    if (['custom', 'anyYear'].includes(type)) {
      value = [moment(), moment()]
    }
    form.setFieldsValue({
      [FIELDS.REPORT_TIME]: {
        value,
        type,
      },
    })

    form.resetFields([
      FIELDS.PROVINCE,
      FIELDS.MEASURING_LIST,
      FIELDS.STATION_TYPE,
      FIELDS.STATION_AUTO,
    ])

    this.setInitFieldValue()
  }

  setInitFieldValue = province => {
    const { form } = this.props
    const provinceForm = form.getFieldValue(FIELDS.PROVINCE)
    const stationTypes = this.getStationTypes(province || provinceForm)
    const stationTypeKeys = stationTypes.map(stationType => stationType.key)
    form.setFieldsValue({ [FIELDS.STATION_TYPE]: stationTypeKeys[0] })
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)

    const stationAutos = this.getStationAutos(
      province || provinceForm,
      stationType
    )
    const stationAutosKey = stationAutos.map(
      stationAutoKey => stationAutoKey.key
    )
    form.setFieldsValue({
      [FIELDS.STATION_AUTO]: stationAutosKey,
    })
  }

  getStationTypes = province => {
    const stationAutoTypeKeys = this.state.stationAutos
      .filter(stationAuto => {
        const provinceValue = _.get(stationAuto, ['province', 'key'], '')
        return provinceValue === province
      })
      .filter(station => station.stationType)
      .map(station => station.stationType.key)

    return this.state.stationTypes.filter(stationType =>
      stationAutoTypeKeys.includes(stationType.key)
    )
  }

  getMeasuringList = () => {
    const { form } = this.props
    const stationAutoValues = form.getFieldValue(FIELDS.STATION_AUTO)

    if (!stationAutoValues) return []

    const stationAutoList = this.state.stationAutos.filter(stationAuto =>
      stationAutoValues.includes(stationAuto.key)
    )
    const measureList = getMeasuringListFromStationAutos(stationAutoList)
    return measureList
  }

  onStationAutosFetchSuccess = stationAutos => {
    const { form } = this.props

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)

    const stationAutosList = stationAutos.filter(
      stationAuto => _.get(stationAuto, 'stationType.key') === stationType
    )
    const stationAutosSelected = stationAutosList.map(
      stationAutoSelect => stationAutoSelect.key
    )
    form.setFieldsValue({
      [FIELDS.STATION_AUTO]: stationAutosSelected,
    })

    this.setState({ stationAutos })
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    const stationType = get(stationTypes, '0.key')
    this.setState({ stationTypes })
    form.setFieldsValue({
      [FIELDS.STATION_TYPE]: stationType,
    })
  }

  getStationAutos = (province, stationType) => {
    let { stationAutos } = this.state

    if (province) {
      stationAutos = stationAutos.filter(stationAuto => {
        const provinceValue = _.get(stationAuto, ['province', 'key'], '')
        return provinceValue === province
      })
    }

    if (stationType) {
      stationAutos = stationAutos.filter(
        stationAuto => stationAuto.stationType.key === stationType
      )
    }
    return stationAutos
  }

  handleProvinceChange = async province => {
    const { form } = this.props
    form.resetFields([FIELDS.MEASURING_LIST])

    this.setInitFieldValue(province)
  }

  handleStationTypeChange = stationType => {
    const { form } = this.props
    form.resetFields([FIELDS.MEASURING_LIST])
    const province = form.getFieldValue(FIELDS.PROVINCE)

    const stationAutos = this.getStationAutos(province, stationType)
    const stationAutosKey = stationAutos.map(
      stationAutoKey => stationAutoKey.key
    )
    form.setFieldsValue({
      [FIELDS.STATION_AUTO]: stationAutosKey,
    })
  }
  handleStationAutosChange = () => {
    const { form } = this.props
    form.resetFields([FIELDS.MEASURING_LIST])
  }

  getMoment = () => {
    const { form } = this.props
    const type = form.getFieldValue(FIELDS.REPORT_TYPE)
    if (type === 'custom' || type === 'anyYear') {
      return [moment(), moment()]
    }
    if (type === 'month' || type === 'year') {
      return moment()
    }
  }

  render() {
    const { form } = this.props
    const { stationAutos } = this.state
    const province = form.getFieldValue(FIELDS.PROVINCE)

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)

    const measureList = this.getMeasuringList()

    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={7}>
            <FormItem label={t('report.label.reportType')}>
              {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
                initialValue: 'custom',
                onChange: this.handleSelectTimeChange,
              })(<SelectReportType />)}
            </FormItem>
          </Col>

          <Col span={10}>
            <FormItem label={i18n().detailPage.label.timeLabel}>
              {form.getFieldDecorator(FIELDS.REPORT_TIME, {
                initialValue: {
                  type: 'custom',
                  value: this.getMoment(),
                },
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(<SelectReportTime />)}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label={i18n().detailPage.label.province}>
              {form.getFieldDecorator(FIELDS.PROVINCE, {
                initialValue: '',
                onChange: this.handleProvinceChange,
              })(<SelectProvince isShowAll allowClear={false} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={7}>
            <FormItem label={i18n().detailPage.label.stationType}>
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.handleStationTypeChange,
              })(
                <SelectStationType
                  province={province}
                  stationAutos={stationAutos}
                  onFetchSuccess={this.onFetchStationTypeSuccess}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={i18n().detailPage.label.stationName}>
              {form.getFieldDecorator(FIELDS.STATION_AUTO, {
                onChange: this.handleStationAutosChange,
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(
                <SelectStationAuto
                  mode="multiple"
                  province={province}
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label={t('report.type2_flow.parameters')}>
              {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                rules: [
                  {
                    required: true,
                    message: t('report.type2_flow.required.measure'),
                  },
                ],
              })(
                <SelectMeasureParameter
                  mode="single"
                  measuringList={measureList}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Row type="flex" align="middle">
            <Col>
              <ToolTip />
            </Col>
            <Col>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {t('report.type2_flow.dataprocessing')}
              </div>
            </Col>
            <Col>
              <div style={{ marginLeft: '10px' }}>
                <Item>
                  {form.getFieldDecorator(FIELDS.FILTER_DATA, {
                    initialValue: false,
                  })(<Switch />)}
                </Item>
              </div>
            </Col>
          </Row>
        </Row>
      </React.Fragment>
    )
  }
}
