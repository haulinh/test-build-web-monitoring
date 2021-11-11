import { Col, Row, Switch, Form } from 'antd'
import ReportType from 'components/elements/select-data/report/SelectReportType'
import TimeReport from 'components/elements/select-data/report/SelectTimeReport'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectProvince from 'components/elements/select-province'
import { FormItem } from 'components/layouts/styles'
import { ToolTip } from 'containers/search/common/tooltip'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { FIELDS, i18n } from './index'
import _ from 'lodash'

const ColSwitch = styled(Col)`
  .ant-form-item .ant-switch {
    margin: 20px 0 4px;
  }
`
@Form.create()
export default class Filter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      stationAutos: [],
    }
  }

  handleOnChangeReportType = type => {
    const { form, resetData } = this.props
    const { stationAutos, stationTypes } = this.state

    const stationAutoKeys = this.getDefaultStationAutos(stationAutos, stationTypes)

    resetData()
    form.resetFields()
    form.setFieldsValue({
      [FIELDS.STATION_KEY]: stationAutoKeys,
    })
    const time = form.getFieldValue(FIELDS.TIME)
    form.setFieldsValue({ [FIELDS.TIME]: { ...time, type } })
  }

  handleOnChangeFilter = value => {
    const { form } = this.props
    form.setFieldsValue({ isFilter: value })
  }

  handleOnProvinceChange = (value) => {
    const { form } = this.props
    let { stationAutos } = this.state
    if (value) {
      stationAutos = stationAutos.filter(
        station => _.get(station, 'province.key') === value
      )
    }
    const stationAutoKeys = stationAutos.map(stationAuto => stationAuto.key)
    form.setFieldsValue({ [FIELDS.STATION_KEY]: stationAutoKeys })
  }

  onStationAutosFetchSuccess = (stationAutos, stationTypes) => {
    const { form, onSearch } = this.props

    this.setState({ stationAutos, stationTypes })

    const stationAutoKeys = this.getDefaultStationAutos(stationAutos, stationTypes)

    form.setFieldsValue({
      [FIELDS.STATION_KEY]: stationAutoKeys,
    })
    onSearch()
  }

  getDefaultStationAutos = (stationAutos, stationTypes) => {
    let firstStationType = _.get(stationTypes, '0._id')
    const stationAutoKeys = stationAutos
      .map(stationAuto => {
        if (!firstStationType) firstStationType = stationAuto.stationType._id
        if (stationAuto.stationType._id === firstStationType) return stationAuto.key
        return null
      }).filter(Boolean)

    return stationAutoKeys
  }

  render() {
    const { form } = this.props
    const { reportType } = form.getFieldsValue() || {}
    const province = form.getFieldValue('province')
    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={6}>
            <FormItem label={i18n().reportType.label}>
              {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
                initialValue: 'date',
                onChange: this.handleOnChangeReportType,
              })(<ReportType form={form} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={i18n().time.label}>
              {form.getFieldDecorator(FIELDS.TIME, {
                initialValue: { type: 'date', value: moment() },
                rules: [
                  {
                    required: true,
                    message: i18n().time.required,
                  },
                ],
              })(<TimeReport reportType={reportType} />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={i18n().province.label}>
              {form.getFieldDecorator(FIELDS.PROVINCE, {
                initialValue: '',
                onChange: this.handleOnProvinceChange,
              })(<SelectProvince isShowAll allowClear={false} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label={i18n().station.label}>
            {form.getFieldDecorator(FIELDS.STATION_KEY, {
              rules: [
                {
                  required: true,
                  message: i18n().station.required,
                },
              ],
            })(<TreeSelectStation onStationAutosFetchSuccess={this.onStationAutosFetchSuccess} province={province} />)}
          </FormItem>
        </Row>
        <Row type="flex" justify="end">
          <Col>
            <Row type="flex" align="middle">
              <Col>
                <ToolTip />
              </Col>
              <Col>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {t('report.qaqc.approveData')}
                </div>
              </Col>
              <ColSwitch>
                <div style={{ marginLeft: '10px' }}>
                  <FormItem>
                    {form.getFieldDecorator('isFilter', {
                      initialValue: false,
                      onChange: this.handleOnChangeFilter,
                      valuePropName: 'checked',
                    })(<Switch form={form} />)}
                  </FormItem>
                </div>
              </ColSwitch>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
