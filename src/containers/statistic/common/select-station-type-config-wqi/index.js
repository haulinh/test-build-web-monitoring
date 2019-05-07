import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import stationConfigApi from 'api/StationConfigApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

@autobind
export default class SelectStationTypeConfigAQI extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    isShowAll: PropTypes.bool
  }

  static defaultProps = {
    isAuto: true
  }

  state = {
    stationTypes: [],
    value: ''
  }

  async componentDidMount() {
    const stationConfigs = await stationConfigApi.getStationsConfig(
      {},
      { config: 'WQI' }
    )
    if (stationConfigs.success) {
      const listStationConfig = _.get(stationConfigs, 'data', [])
      const stationTypeConfigAQI = []
      const keys = []
      _.forEach(listStationConfig, ({ stationType: { key, name } }) => {
        if (!_.includes(keys, key)) {
          keys.push(key)
          stationTypeConfigAQI.push({ name: name, key: key })
        }
      })
      this.setState({
        stationTypes: stationTypeConfigAQI,
        value: this.props.value
      })
    }
  }

  onChange(value) {
    let res = this.state.stationTypes.find(item => item.key === value)
    this.setState({
      value: value
    })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return (
      <Select
        showSearch
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      >
        {this.props.isShowAll && (
          <Select.Option value={''}>
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {this.state.stationTypes.map(stationType => (
          <Select.Option key={stationType.key} value={stationType.key}>
            {stationType.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
