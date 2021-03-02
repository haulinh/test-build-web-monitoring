import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { translate as t } from 'hoc/create-lang'

export const OPERATOR = {
  AVG: 'avg',
  MIN: 'min',
  MAX: 'max',
}

const OPERATOR_OPTIONS = [
  {
    text: t('dataAnalytics.filterForm.operator.avg'),
    value: OPERATOR.AVG,
  },
  {
    text: t('dataAnalytics.filterForm.operator.min'),
    value: OPERATOR.MIN,
  },
  {
    text: t('dataAnalytics.filterForm.operator.max'),
    value: OPERATOR.MAX,
  },
]

export default class SelectOperator extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const { value, onChange } = this.props
    return (
      <Select value={value} onChange={onChange} style={{ width: '100%' }}>
        {OPERATOR_OPTIONS.map(item => (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
