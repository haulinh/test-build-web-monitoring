import { Select, Tooltip } from 'antd'
import CategoryApi from 'api/CategoryApi'
import _ from 'lodash'
import React, { Component } from 'react'

export default class SelectMeasure extends Component {
  state = {
    measuringList: [],
  }

  async componentDidMount() {
    const res = await CategoryApi.getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )
    this.setState({ measuringList: res.data })
  }

  render() {
    const { measuringList } = this.state
    return (
      <Select
        {...this.props}
        showSearch
        maxTagCount={5}
        maxTagTextLength={5}
        style={{ width: '100%' }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          _.get(option, 'props.children', '')
            .toLowerCase()
            .indexOf((input || '').toLowerCase()) >= 0
        }
      >
        {measuringList.map(item => (
          <Select.Option key={item.key} value={item.key}>
            <Tooltip title={item.name}>{item.name}</Tooltip>
          </Select.Option>
        ))}
      </Select>
    )
  }
}
