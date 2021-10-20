import { Col, Row } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS } from './index'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'

const i18n = () => ({
  time: t('alarm.label.history.time'),
  province: t('alarm.label.history.province'),
  station: t('alarm.label.history.station'),
  requiredStation: t('alarm.required.station'),
  requiredProvince: t('alarm.required.province'),
})

export default class Filter extends Component {
  state = {
    stationAutos: []
  }

  onStationAutosFetchSuccess = stationAutos => {
    const { form, onSearch } = this.props

    const stationAutoIds = stationAutos.map(stationAuto => stationAuto._id)
    form.setFieldsValue({
      [FIELDS.STATION_IDS]: stationAutoIds,
    })
    this.setState({ stationAutos })
    onSearch()
  }

  handleOnFieldChange = () => {
    let { stationAutos } = this.state
    const { form } = this.props
    const province = form.getFieldValue(FIELDS.PROVINCE)
    console.log({ province })

    // if (province) {
    //   stationAutos = stationAutos.filter(
    //     stationAuto => _.get(stationAuto, 'province.key') === province
    //   )
    // }
    // // const stationId = stationAutos.map(item => item._id)
    // // form.setFieldsValue({
    // //   [FIELDS.STATION_IDS]: stationId,
    // // })
  }

  render() {
    const { form } = this.props
    const province = form.getFieldValue(FIELDS.PROVINCE)

    return (
      <Row gutter={32} >
        <Col span={8}>
          <FormItem label={i18n().time}>
            {form.getFieldDecorator(FIELDS.TIME, {
              initialValue: 1,
            })(<OptionsTimeRange />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label={i18n().province}>
            {form.getFieldDecorator(FIELDS.PROVINCE, {
              onChange: this.handleOnFieldChange
            })(<SelectProvince isShowAll allowClear={false} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={i18n().station}>
            {form.getFieldDecorator(FIELDS.STATION_IDS, {
              rules: [
                {
                  required: true,
                  message: i18n().requiredStation,
                },
              ]
            })(
              <SelectStationAuto
                fieldValue="_id"
                province={province}
                mode="multiple"
                onFetchSuccess={this.onStationAutosFetchSuccess} />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}
