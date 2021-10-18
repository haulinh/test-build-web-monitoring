import { Col, Row } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'

export const Filter = ({ form }) => {
  const province = form.getFieldValue(FIELDS.PROVINCE)
  return (
    <Row gutter={32}>
      <Col span={8}>
        <FormItem>
          {form.getFieldDecorator(FIELDS.TIME)(<OptionsTimeRange />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem>
          {form.getFieldDecorator(FIELDS.PROVINCE)(<SelectProvince />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem>
          {form.getFieldDecorator(FIELDS.STATION_IDS)(
            <SelectStationAuto fieldValue="_id" province={province} />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}
