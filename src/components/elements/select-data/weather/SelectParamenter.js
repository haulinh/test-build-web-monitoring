import { Select } from 'antd'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { translate as t } from 'hoc/create-lang'

export const optionsWeather = [
    { key: 'temp', label: t('apiSharingNew.weather.temp'), unit: 'oC' },
    { key: 'rh', label: t('apiSharingNew.weather.rh'), unit: '%' },
    { key: 'wind_spd', label: t('apiSharingNew.weather.wind_spd'), unit: 'm/s' },
    { key: 'wind_cdir_full', label: t('apiSharingNew.weather.wind_cdir_full'), unit: '' },
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
        const { value, ...otherProps } = this.props
        return (
            <Select
                {...otherProps}
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