import { Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'
export default class SelectStationTypes extends React.Component {
  render() {
    const { form, stationTypes, handleOnSelectStationType, label } = this.props
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.STATION_TYPE_ID, {
          initialValue: stationTypes
            .filter(stationType => stationType.key === 'all')
            .map(item => item._id),
          onChange: () => form.resetFields([FIELDS.POINT]),
        })(
          <Select onSelect={handleOnSelectStationType} size="large">
            {stationTypes.map(stationType => (
              <Select.Option key={stationType._id} value={stationType._id}>
                {stationType.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </FormItem>
    )
  }
}
