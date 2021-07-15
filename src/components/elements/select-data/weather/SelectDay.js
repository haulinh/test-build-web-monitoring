import { Select } from 'antd'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'

export const optionsDay = [
    { key: '5', label: 5 },
    { key: '7', label: 7 }
]

@autobind
export default class SelectDayWeather extends PureComponent {
    static propTypes = {
        query: PropTypes.object,
        label: PropTypes.string,
        onChange: PropTypes.func,
        onHandleChange: PropTypes.func,
    }

    handleOnChange(value) {
        const { onChange } = this.props
        if (onChange) {
            onChange(value)
        }
    }

    render() {
        const { value, ...otherProps } = this.props
        return (
            <Select
                {...otherProps}
                value={value}
                style={{ width: '100%', ...this.props.style }}
                onChange={this.handleOnChange}
            >
                {optionsDay.map(item => (
                    <Select.Option key={item.key} value={item.key}>
                        {item.label}
                    </Select.Option>
                ))}
            </Select>
        )
    }
}