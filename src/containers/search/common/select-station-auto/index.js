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
  language: _.get(state, 'language.locale'),
}))
@autobind
export default class SelectStationAuto extends React.PureComponent {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    provinceKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    onFetchSuccess: PropTypes.func,
    getRef: PropTypes.func,
  }

  state = {
    value: undefined,
    isLoaded: false,
    stationAutoSelects: [],
    searchString: '',
  }

  async componentDidMount() {
    const results = await StationAutoApi.getStationAutos({
      page: 1,
      itemPerPage: 10000000,
    })

    this.setState({
      stationAutoSelects: results.data,
      isLoaded: true,
      value: this.props.setKey
        ? this.props.stationAutoKey
        : this.props.value || undefined,
    })

    const { onFetchSuccess } = this.props
    if (typeof onFetchSuccess === 'function') {
      onFetchSuccess(results.data)
    }

    if (this.props.getRef) this.props.getRef(this)
  }

  getByTypeAndProvince = () => {
    return _.filter(this.state.stationAutoSelects, stationAuto => {
      return (
        (!this.props.stationTypeKey ||
          this.props.stationTypeKey === 'ALL' ||
          _.isEqual(
            this.props.stationTypeKey,
            _.get(stationAuto, 'stationType.key', null)
          )) &&
        (!this.props.provinceKey ||
          this.props.provinceKey === 'ALL' ||
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

  getValue() {
    return this.props.setKey
      ? this.props.stationAutoKey
      : this.props.value || undefined
  }

  render() {
    const value = this.getValue()
    const stationAutos = this.getStationAutos()
    const { language } = this.props
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        maxTagCount={5}
        {...this.props}
        allowClear
        showSearch
        onChange={this.handleChange}
        value={value}
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
