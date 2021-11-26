import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { removeAccents } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'
import { get } from 'lodash'
import CalculateApi from 'api/CalculateApi'

@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
export default class SelectStationAuto extends React.PureComponent {
  static propTypes = {
    onChangeObject: PropTypes.func,
    getRef: PropTypes.func,
    stationAutoKey: PropTypes.func,
    province: PropTypes.string,
    stationType: PropTypes.string,
  }

  state = {
    isLoaded: false,
    stationAutoSelects: [],
    searchString: '',
    conditionFilterData: [],
  }

  async componentWillMount() {
    const res = await StationAutoApi.getStationAutoAll({
      page: 1,
      itemPerPage: Number.MAX_SAFE_INTEGER,
    })

    const data = get(res, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )
    const dataWithCondition = await CalculateApi.getQaqcConfigs({
      limit: 999999,
      offset: 0,
    })
    const conditionFilterData = dataWithCondition.results.filter(
      item => item.type === 'value'
    )

    this.setState({
      stationAutoSelects: data,
      isLoaded: true,
      conditionFilterData: conditionFilterData,
    })

    if (this.props.onFetchSuccess) {
      this.props.onFetchSuccess(data)
    }

    if (this.props.getRef) this.props.getRef(this)
  }

  getStationAutos = () => {
    const { province, stationType, fieldValue } = this.props

    let stationAutos = this.state.stationAutoSelects
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      stationAutos = stationAutos.filter(
        stationAuto =>
          replaceVietnameseStr(stationAuto.name).indexOf(searchString) > -1
      )
    }

    if (province) {
      stationAutos = stationAutos.filter(stationAuto => {
        const provinceValue = _.get(
          stationAuto,
          ['province', fieldValue || 'key'],
          ''
        )
        return provinceValue === province
      })
    }

    if (stationType) {
      stationAutos = stationAutos.filter(
        stationAuto =>
          stationAuto.stationType[fieldValue || 'key'] === stationType
      )
    }
    stationAutos = stationAutos.filter(stationAuto =>
      this.state.conditionFilterData.every(
        station => station.stationId !== stationAuto._id
      )
    )
    return stationAutos
  }

  handleChange = list => {
    this.setState({ searchString: '' })

    const { stationAutoSelects } = this.state
    const { mode, onChange, onChangeObject, fieldValue } = this.props
    let stationType = stationAutoSelects.find(
      s => s[fieldValue || 'key'] === list
    )
    let stationKeys = list

    if (mode === 'multiple') {
      const stationAutoMaps = new Map(
        stationAutoSelects.map(item => [item[fieldValue || 'key'], item.name])
      )
      stationKeys = list.filter(key => stationAutoMaps.has(key))
      stationType = stationAutoSelects.filter(item => {
        return stationKeys.includes(item[fieldValue || 'key'])
      })
    }

    onChange(stationKeys)
    if (onChangeObject) onChangeObject(stationType)
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  render() {
    const {
      language,
      setKey,
      stationAutoKey,
      value,
      valueNames,
      fieldValue,
    } = this.props
    const stationAutos = this.getStationAutos()
    const stationAutoMaps = new Map(
      stationAutos.map(item => [item[fieldValue || 'key'], item.name])
    )

    let selectValue = setKey ? stationAutoKey : value

    selectValue = Array.isArray(selectValue)
      ? selectValue.map((key, idx) =>
          stationAutoMaps.has(key) ? key : get(valueNames, idx, key)
        )
      : stationAutoMaps.get(selectValue) || valueNames

    return (
      <Select
        maxTagCount={3}
        style={{ width: '100%' }}
        allowClear
        showSearch
        onChange={this.handleChange}
        value={!value ? value : selectValue}
        onSearch={this.handleSearch}
        filterOption={false}
        {...this.props}
      >
        {stationAutos.map(item => (
          <Select.Option key={item.key} value={item[fieldValue || 'key']}>
            {removeAccents(language, item.name)}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
