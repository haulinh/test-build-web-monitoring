import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { removeAccents } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'
import { get } from 'lodash'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi'

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
export default class SelectStationFixed extends React.PureComponent {
  static propTypes = {
    onChangeObject: PropTypes.func,
    getRef: PropTypes.func,
    stationFixKey: PropTypes.func,
    province: PropTypes.string,
    stationType: PropTypes.string,
  }

  state = {
    isLoaded: false,
    stationFixedSelects: [],
    searchString: '',
  }

  async componentWillMount() {
    const res = await StationFixedPointApi.getStationFixedPoints({
      page: 1,
      itemPerPage: Number.MAX_SAFE_INTEGER,
    })

    const data = get(res, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )

    this.setState({
      stationFixedSelects: data,
      isLoaded: true,
    })

    if (this.props.onFetchSuccess) {
      this.props.onFetchSuccess(data)
    }

    if (this.props.getRef) this.props.getRef(this)
  }

  getStationFixs = () => {
    const { province, stationType, fieldValue } = this.props
    let stationFixs = this.state.stationFixedSelects

    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      stationFixs = stationFixs.filter(
        stationFix =>
          replaceVietnameseStr(stationFix.name).indexOf(searchString) > -1
      )
    }

    if (province) {
      stationFixs = stationFixs.filter(stationFix => {
        const provinceValue = _.get(
          stationFix,
          ['province', fieldValue || 'key'],
          ''
        )
        return provinceValue === province
      })
    }

    if (stationType) {
      stationFixs = stationFixs.filter(
        stationFix =>
          stationFix.stationType[fieldValue || 'key'] === stationType
      )
    }

    return stationFixs
  }

  handleChange = list => {
    this.setState({ searchString: '' })

    const { stationFixedSelects } = this.state
    const { mode, onChange, onChangeObject } = this.props
    let stationType = stationFixedSelects.find(s => s.key === list)
    let stationKeys = list

    if (mode === 'multiple') {
      const stationFixMaps = new Map(
        stationFixedSelects.map(item => [item.key, item.name])
      )
      stationKeys = list.filter(key => stationFixMaps.has(key))
      stationType = stationFixedSelects.filter(item => {
        return stationKeys.includes(item.key)
      })
    }

    onChange(stationKeys)
    if (onChangeObject) onChangeObject(stationType)
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  render() {
    const stationFixs = this.getStationFixs()
    const stationFixMaps = new Map(
      stationFixs.map(item => [item.key, item.name])
    )
    const { language, setKey, stationFixKey, value, valueNames } = this.props

    let selectValue = setKey ? stationFixKey : value

    selectValue = Array.isArray(selectValue)
      ? selectValue.map((key, idx) =>
        stationFixMaps.has(key) ? key : get(valueNames, idx, key)
      )
      : stationFixMaps.get(selectValue) || valueNames

    return (
      <Select
        {...this.props}
        style={{ width: '100%' }}
        allowClear
        showSearch
        onChange={this.handleChange}
        value={!value ? value : selectValue}
        onSearch={this.handleSearch}
        filterOption={false}
      >
        {stationFixs.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {removeAccents(language, item.name)}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
