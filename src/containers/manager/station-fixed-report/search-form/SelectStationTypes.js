import { Select } from 'antd'
import React from 'react'
import { FIELDS, FormItemStyled } from './index'

const SelectStationTypes = ({
  label,
  form,
  getConfig,
  handleOnSelectStationType,
  stationTypes,
}) => {
  return (
    <FormItemStyled label={label}>
      {form.getFieldDecorator(
        FIELDS.STATION_TYPE_ID,
        getConfig()
      )(
        <Select onSelect={handleOnSelectStationType} size="large">
          {stationTypes.map(stationType => (
            <Select.Option key={stationType._id} value={stationType._id}>
              {stationType.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItemStyled>
  )
}

export default SelectStationTypes
