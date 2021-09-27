import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import _ from 'lodash'

export default class AutoCompleteCell extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onchange: PropTypes.func,
    options: PropTypes.array,
    editable: PropTypes.bool,
    autoFocus: PropTypes.bool,
  }

  render() {
    const value = this.props.value || undefined
    return (
      <div>
        {this.props.editable ? (
          <Select
            showSearch
            style={{ width: 200 }}
            {...this.props}
            optionFilterProp="children"
            onChange={e => this.props.onChange(e)}
            filterOption={(input, option) =>
              _.get(option, 'props.children', '')
                .toLowerCase()
                .indexOf((input || '').toLowerCase()) >= 0
            }
            value={value}
            autoFocus={this.props.autoFocus}
          >
            {this.props.options}
          </Select>
        ) : (
          this.props.value
        )}
      </div>
    )
  }
}
