import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Select } from 'antd'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { removeAccents } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'

@connect(state => ({
  language: _.get(state, 'language.locale')
}))
@autobind
export default class SelectStationAuto extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    provinceKey: PropTypes.string,
    getRef: PropTypes.func
  }

  state = {
    isLoaded: false,
    stationAutoSelects: [],
    searchString: ''
  }

  async componentWillMount() {
    const responseStationAuto = await StationAutoApi.getStationAutos({
      page: 1,
      itemPerPage: 10000000
    })

    this.setState({
      stationAutoSelects: responseStationAuto.data,
      isLoaded: true
    })

    if (this.props.getRef) this.props.getRef(this)
  }

  getByTypeAndProvince = () => {
    return _.filter(this.state.stationAutoSelects, stationAuto => {
      return (
        _.isEqual(
          this.props.stationTypeKey,
          _.get(stationAuto, 'stationType.key', null)
        ) &&
        (!this.props.provinceKey ||
          _.isEqual(
            this.props.provinceKey,
            _.get(stationAuto, 'province.key', null)
          ))
      )
    })
  }

  getStationAutos() {
    const stationAutos = this.getByTypeAndProvince()
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return stationAutos.filter(
        stationAuto =>
          replaceVietnameseStr(stationAuto.name).indexOf(searchString) > -1
      )
    }
    return stationAutos
  }

  handleChange(stationTypeValue) {
    this.setState({ searchString: '' })
    const stationType = this.state.stationAutoSelects.find(
      s => s.key === stationTypeValue
    )
    this.props.onChange(stationTypeValue)
    if (this.props.onChangeObject) {
      this.props.onChangeObject(stationType)
    }
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  render() {
    const stationAutos = this.getStationAutos()
    const { language } = this.props
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        {...this.props}
        allowClear
        showSearch
        onChange={this.handleChange}
        value={this.props.setKey ? this.props.stationAutoKey : this.props.value}
        onSearch={this.handleSearch}
        filterOption={false}
      >
        {stationAutos.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {removeAccents(language, item.name)}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
