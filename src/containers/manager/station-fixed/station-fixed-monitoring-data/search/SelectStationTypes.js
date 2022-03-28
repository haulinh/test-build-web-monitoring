import { Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'
import { replaceVietnameseStr } from 'utils/string'
import { translate } from 'hoc/create-lang'

export default class SelectStationTypes extends React.Component {
  state = {
    searchString: '',
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getStationTypes = () => {
    const { searchString } = this.state
    const { stationTypes } = this.props

    if (searchString) {
      const newSearchString = replaceVietnameseStr(searchString)

      return stationTypes.filter(stationType =>
        replaceVietnameseStr(stationType.name).includes(newSearchString)
      )
    }
    return stationTypes
  }

  render() {
    const { form, handleOnSelectStationType, label, isShowAll } = this.props
    const stationTypeList = this.getStationTypes()

    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.STATION_TYPE_ID, {
          initialValue: '',
          onChange: () => form.resetFields([FIELDS.POINT]),
        })(
          <Select
            onSelect={handleOnSelectStationType}
            onSearch={this.handleSearch}
            size="large"
            allowClear
            showSearch
            filterOption={false}
          >
            {isShowAll && (
              <Select.Option value="">
                {translate('dataSearchFrom.form.all')}
              </Select.Option>
            )}
            {stationTypeList.map(stationType => (
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
