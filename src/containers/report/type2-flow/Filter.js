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
import SelectReportFlowTime from './select-data/SelectReportFlowTime'
import SelectReportFlowType from './select-data/SelectReportFlowType'

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
  }
  handleSelectChange = value => {
    const { form } = this.props
    form.setFieldsValue({
      [FIELDS.REPORT_TIME]: {
        type: value,
      },
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO)
    if (stationAutoValue !== undefined) {
      const stationAutoList = this.state.stationAutos.filter(stationAuto =>
        stationAutoValue.includes(stationAuto.key)
      )
      const measureList = getMeasuringListFromStationAutos(stationAutoList)
      return measureList
    }
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({ stationAutos: stationAutos })
  }

  onFetchStationTypeSuccess = stationTypes => {
    const { form } = this.props
    const stationType = get(stationTypes, '0.key')

    form.setFieldsValue({
      [FIELDS.STATION_TYPE]: stationType,
    })
  }
  setStationAutoSelected = stationAutoSelected => {
    console.log(stationAutoSelected)
  }
  onChange = value => {
    console.log(value)
  }
  render() {
    const { form } = this.props
    const province = form.getFieldValue(FIELDS.PROVINCE)

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)

    const measureList = this.getMeasuringList()

    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={7}>
            <FormItem label="Loại báo cáo">
              {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
                initialValue: 'month',
                onChange: this.handleSelectChange,
              })(<SelectReportFlowType />)}
            </FormItem>
          </Col>

          <Col span={10}>
            <FormItem label={i18n().detailPage.label.timeLabel}>
              {form.getFieldDecorator(FIELDS.REPORT_TIME, {
                initialValue: {
                  type: 'month',
                },
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<SelectReportFlowTime />)}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label={i18n().detailPage.label.province}>
              {form.getFieldDecorator(
                FIELDS.PROVINCE,
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
            <FormItem label={i18n().detailPage.label.stationType}>
              {form.getFieldDecorator(
                FIELDS.STATION_TYPE,
                {}
              )(
                <SelectStationType
                  onFetchSuccess={this.onFetchStationTypeSuccess}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={i18n().detailPage.label.stationName}>
              {form.getFieldDecorator(FIELDS.STATION_AUTO, {
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(
                <SelectStationAuto
                  // onChange={change => {
                  //   console.log(change)
                  // }}

                  mode="multiple"
                  province={province}
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                  onChangeObject={this.setStationAutoSelected}
                  // valueNames={form.getFieldValue(FIELDS.STATION_NAME)}
                />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label={i18n().detailPage.label.parameter}>
              {form.getFieldDecorator(FIELDS.MEASURING_LIST, {
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(<SelectMeasureParameter measuringList={measureList} />)}
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
                Kiểm duyệt dữ liệu
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
