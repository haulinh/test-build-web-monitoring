import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'

export default class SelectStation extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    isShowAll: PropTypes.bool,
    stationType: PropTypes.string
  }

  state = {
    stations: [],
    value: 'ALL'
  }

  async componentDidMount() {
    const stations = await StationAutoApi.getStationAutos({
      page: 1,
      itemPerPage: 10000000
    })
    // const stations = await StationAutoApi.getCamera();

    if (stations.success)
      this.setState({
        stations: stations.data || [],
        value: this.props.value
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stationType !== this.props.stationType) {
      this.onChange('ALL')
      // const station = this.state.stations.find(
      //   ({ stationType }) => stationType.key === nextProps.stationType
      // );
      // if (station) {
      //   this.onChange(station.key);
      // } else {
      //   this.onChange("ALL");
      // }
    }
  }

  getStations = () => {
    const { stationType } = this.props
    return this.state.stations.filter(
      station =>
        station.stationType.key === stationType || stationType === 'ALL'
    )
  }

  onChange = value => {
    let res = this.state.stations.find(item => item.key === value)
    this.setState({
      value: value
    })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    const stations = this.getStations()
    return (
      <Select
        showSearch
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      >
        {this.props.isShowAll && (
          <Select.Option value={'ALL'}>
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        <Select.Option key={'ALL'} value={'ALL'}>
          {translate('dataSearchFrom.form.all')}
        </Select.Option>
        {stations.map(station => (
          <Select.Option key={station.key} value={station.key}>
            {station.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
