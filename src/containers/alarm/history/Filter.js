import { Col, Row } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'
import { translate as t } from 'hoc/create-lang'

const i18n = () => ({
  time: t('alarm.label.history.time'),
  province: t('alarm.label.history.province'),
  station: t('alarm.label.history.station'),
  requiredStation: t('alarm.required.station'),
  requiredProvince: t('alarm.required.province'),
})

export const Filter = ({ form }) => {
  const onStationAutosFetchSuccess = stationAutos => {
    const stationAutoIds = stationAutos.map(stationAuto => stationAuto._id)
    form.setFieldsValue({
      [FIELDS.STATION_IDS]: stationAutoIds,
    })
  }

  const handleOnFieldChange = () => {
    form.setFieldsValue({
      [FIELDS.STATION_IDS]: undefined,
    })
  }

  const province = form.getFieldValue(FIELDS.PROVINCE)
  return (
    <Row gutter={32}>
      <Col span={8}>
        <FormItem label={i18n().time}>
          {form.getFieldDecorator(FIELDS.TIME, {
            initialValue: 1,
          })(<OptionsTimeRange />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label={i18n().province}>
          {form.getFieldDecorator(FIELDS.PROVINCE, {
            onChange: handleOnFieldChange
          })(<SelectProvince isShowAll allowClear={false} />)}
        </FormItem>
      </Col>
      <Col span={8}>
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
              onFetchSuccess={onStationAutosFetchSuccess} />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}
