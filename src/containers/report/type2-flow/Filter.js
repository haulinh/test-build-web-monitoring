import { Col, Row } from 'antd'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { get } from 'lodash'
import React from 'react'
import SelectReportFlowTime from './select-data/SelectReportFlowTime'
import SelectReportFlowType from './select-data/SelectReportFlowType'

export default class Filter extends React.Component {
  state = {
    stationAutos: [],
  }
  handleSelectChange = value => {
    const { form } = this.props
    form.setFieldsValue({
      reportTime: `${value}`,
    })
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({ stationAutos: stationAutos })
  }
  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    const stationType = get(stationTypes, '0.key')

    form.setFieldsValue({
      reportStationType: stationType,
    })
  }

  render() {
    const { form } = this.props
    this.province = form.getFieldValue('reportProvince')

    this.stationType = form.getFieldValue('reportStationType')

    this.stationAutoValue = form.getFieldValue('reportSelectStationAuto')

    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={7}>
            <FormItem label="Loại báo cáo">
              {form.getFieldDecorator('reportType', {
                initialValue: 'month',
                onChange: this.handleSelectChange,
              })(<SelectReportFlowType />)}
            </FormItem>
          </Col>

          <Col span={10}>
            <FormItem label="Chọn ngày">
              {form.getFieldDecorator('reportTime', {
                initialValue: 'month',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<SelectReportFlowTime />)}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label="Đơn vị quản lý">
              {form.getFieldDecorator(
                'reportProvince',
                {}
              )(
                <SelectProvince
                  isShowAll
                  // onChange={handleOnFieldChange}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={7}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(
                'reportStationType',
                {}
              )(
                <SelectStationType
                  onFetchSuccess={this.onFetchStationTypeSuccess}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator('reportSelectStationAuto', {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn trạm quan trắc',
                  },
                ],
              })(
                <SelectStationAuto
                  // onChange={change => {
                  //   console.log(change)
                  // }}
                  mode="multiple"
                  province={this.province}
                  stationType={this.stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label="Thông số">
              {form.getFieldDecorator('reportSelectParameter', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<SelectMeasureParameter mode="single" />)}
            </FormItem>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
