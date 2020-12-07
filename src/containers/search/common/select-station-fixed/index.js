import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Select } from 'antd'
// import stationFixedApi from 'api/StationFixedApi'
import * as _ from 'lodash'

@autobind
export default class SelectStationAuto extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    provinceKey: PropTypes.string,
  }

  state = {
    isLoaded: false,
    stationFixedSelects: [],
  }

  // async componentWillMount() {
  //   const responseStationAuto = await stationFixedApi.getStationFixeds({
  //     itemPerPage: 10000000,
  //   })

  //   this.setState({
  //     stationFixedSelects: responseStationAuto.data,
  //     isLoaded: true,
  //   })
  // }

  getStationAutos() {
    return _.filter(this.state.stationFixedSelects, stationFixed => {
      return (
        _.isEqual(
          this.props.stationTypeKey,
          _.get(stationFixed, 'stationType.key', null)
        ) &&
        (!this.props.provinceKey ||
          _.isEqual(
            this.props.provinceKey,
            _.get(stationFixed, 'province.key', null)
          ))
      )
    })
  }

  handleChange(stationTypeValue) {
    const stationType = this.state.stationFixedSelects.find(
      s => s.key === stationTypeValue
    )
    this.props.onChange(stationTypeValue)
    if (this.props.onChangeObject) {
      this.props.onChangeObject(stationType)
    }
  }

  render() {
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        {...this.props}
        onChange={this.handleChange}
        showSearch
        value={
          this.props.setKey ? this.props.stationFixedKey : this.props.value
        }
      >
        {this.getStationAutos().map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
