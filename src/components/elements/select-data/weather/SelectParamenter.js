import { Select } from 'antd'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'

export const optionsWeather = [
    { key: 'temp', label: 'Nhiệt độ', unit: 'oC' },
    { key: 'rh', label: 'Độ ẩm', unit: '%' },
    { key: 'wind_spd', label: 'Gió', unit: 'm/s' },
    { key: 'wind_cdir_full', label: 'Hướng gió', unit: '' },
]

@autobind
export default class SelectParamenterWeather extends PureComponent {
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
        const { value } = this.props
        return (
            <Select
                value={value}
                style={{ width: '100%', ...this.props.style }}
                onChange={this.handleOnChange}
                mode='multiple'
            >
                {optionsWeather.map(item => (
                    <Select.Option key={item.key} value={item.key}>
                        {item.label}
                    </Select.Option>
                ))}
            </Select>
        )
    }
}