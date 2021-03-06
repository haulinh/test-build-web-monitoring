import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import CategoryApi from 'api/CategoryApi'
import { get as _get } from 'lodash'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { connect } from 'react-redux'
import { replaceVietnameseStr } from 'utils/string'
import {getContent} from 'components/language/language-content'

@connect(state => ({
  languageContents: _get(state, 'language.languageContents'),
}))
@autobind
export default class SelectStationType extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onHandleChange: PropTypes.func,
    value: PropTypes.string,
    isShowAll: PropTypes.bool,
    isAuto: PropTypes.bool,
    getRef: PropTypes.func,
    api: PropTypes.func,
  }

  static defaultProps = {
    isAuto: true,
    style: {},
  }

  state = {
    stationTypes: [],
    value: undefined,
    searchString: '',
  }

  async componentDidMount() {
    const { isAuto, value, isShowAll, getRef, api, onFetchSuccess } = this.props
    const fetchApi =
      typeof api === 'function' ? api : CategoryApi.getStationTypes
    const results = await fetchApi({}, { isAuto })

    const data = (Array.isArray(results) ? results : results.data) || []
    if (typeof onFetchSuccess === 'function') onFetchSuccess(data)

    this.setState({
      stationTypes: data,
      value: value || (isShowAll ? '' : undefined),
    })

    if (typeof getRef === 'function') getRef(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  getFirstValue() {
    if (this.state.stationTypes.length > 0) return this.state.stationTypes[0]
  }

  setFirstValue() {
    if (this.state.stationTypes.length > 0)
      this.setState({
        value: this.state.stationTypes[0].key,
      })
  }

  handleOnChange(value) {
    this.setState({ searchString: '' })
    if (!value && this.props.isShowAll) {
      this.setState({ value: '' }, () => {
        this.props.onChange('')
      })
      return
    }
    let res = this.state.stationTypes.find(item => item.key === value)
    this.setState({ value })
    if (res) {
      if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    }
    if (this.props.onChange) this.props.onChange(value)
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getStationTypes = () => {
    let { province, stationAutos, fieldValue } = this.props
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return this.state.stationTypes.filter(
        stationType =>
          replaceVietnameseStr(stationType.name).indexOf(searchString) > -1
      )
    }

    if (province && stationAutos) {
      const stationAutoTypeKeys = stationAutos
        .filter(stationAuto => {
          const provinceValue = _get(
            stationAuto,
            ['province', fieldValue || 'key'],
            ''
          )
          return provinceValue === province
        })
        .filter(station => station.stationType)
        .map(station => station.stationType[fieldValue || 'key'])

      return this.state.stationTypes.filter(stationType =>
        stationAutoTypeKeys.includes(stationType.key)
      )
    }

    return this.state.stationTypes
  }

  render() {
    const { languageContents, fieldValue } = this.props
    const stationTypes = this.getStationTypes()
    return (
      <Select
        {...this.props}
        showSearch
        onSearch={this.handleSearch}
        style={{ width: '100%', ...this.props.style }}
        onChange={this.handleOnChange}
        value={this.props.value}
        filterOption={false}
      >
        {this.props.isShowAll && (
          <Select.Option value="">
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {stationTypes.map(stationType => (
          <Select.Option
            key={stationType.key}
            value={stationType[fieldValue || 'key']}
          >
            {getContent(languageContents, {type: 'StationType', itemId: stationType._id, field: 'name', value: stationType.name})}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
