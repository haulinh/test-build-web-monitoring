import React from 'react'
import { translate } from 'hoc/create-lang'
import { Select } from 'antd'

export default class SelectTimeRange extends React.PureComponent {
  render() {
    return (
      <Select {...this.props}  defaultValue={15} showSearch>
        <Select.Option value={15}>
          15 {translate('avgSearchFrom.selectTimeRange.minute')}
        </Select.Option>
        <Select.Option value={30}>
          30 {translate('avgSearchFrom.selectTimeRange.minute')}
        </Select.Option>
        <Select.Option value={60}>
          1 {translate('avgSearchFrom.selectTimeRange.hour')}
        </Select.Option>
        <Select.Option value={8 * 60}>
          8 {translate('avgSearchFrom.selectTimeRange.hour')}
        </Select.Option>
        <Select.Option value={24 * 60}>
          {translate('avgSearchFrom.selectTimeRange.day')}
        </Select.Option>
        <Select.Option value={'month'}>
          {translate('avgSearchFrom.selectTimeRange.month')}
        </Select.Option>
        <Select.Option value={'year'}>
          {translate('avgSearchFrom.selectTimeRange.year')}
        </Select.Option>
      </Select>
    )
  }
}
