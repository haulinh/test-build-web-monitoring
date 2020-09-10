import React from 'react'
import { InputNumber } from 'antd'
import PropTypes from 'prop-types'

export default class InputNumberCell extends React.Component {
  static propTypes = {
    editable: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultValue: PropTypes.object,
  }

  render() {
    // const value = this.props.value || undefined
    return (
      <div>
        {this.props.editable ? (
          <InputNumber
            {...this.props}
            style={{ margin: '-5px 0', width: '100%' }}
            // value={value}
            disabled={this.props.disabled}
            onChange={this.props.onChange}
          />
        ) : (
          this.props.value
        )}
      </div>
    )
  }
}
