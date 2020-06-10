import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { removeAccents } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
export default class SelectStationAuto extends React.PureComponent {
  static propTypes = {
    onChangeObject: PropTypes.func,
    getRef: PropTypes.func,
    stationAutoKey: PropTypes.func,
  }

  state = {
    isLoaded: false,
    stationAutoSelects: [],
    searchString: '',
  }

  async componentWillMount() {
    const res = await StationAutoApi.getStationAutos({
      page: 1,
      itemPerPage: 10000000,
    })

    this.setState({
      stationAutoSelects: res.data,
      isLoaded: true,
    })

    if (this.props.getRef) this.props.getRef(this)
  }

  getStationAutos = () => {
    const stationAutos = this.state.stationAutoSelects
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return stationAutos.filter(
        stationAuto =>
          replaceVietnameseStr(stationAuto.name).indexOf(searchString) > -1
      )
    }
    return stationAutos
  }

  handleChange = stationTypeValue => {
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
    // if (!this.state.isLoaded) return <div />
    console.log(
      this.props.setKey ? this.props.stationAutoKey : this.props.value
    )
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
