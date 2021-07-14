import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { weatherApi } from 'api/ShareApiApi'

@connect(state => ({
  language: _get(state, 'language.locale'),
}))
@autobind
export default class SelectCities extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onHandleChange: PropTypes.func,
  }

  state = {
    cities: [],
  }

  async componentDidMount() {
    const { onFetchSuccess } = this.props
    const results = await weatherApi.getCities({})
    if (results) {
      this.setState({
        cities: results,
      })
      if (onFetchSuccess) {
        onFetchSuccess(results)
      }
    }

  }

  handleOnChange(value) {
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  getCities = () => {
    return this.state.cities
  }

  render() {
    const cities = this.getCities()
    return (
      <Select
        {...this.props}
        style={{ width: '100%', ...this.props.style }}
        onChange={this.handleOnChange}
        filterOption={false}
      >
        {cities.map(city => (
          <Select.Option
            key={city.city_id}
            value={city.city_id}
          >
            {city.city_name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
