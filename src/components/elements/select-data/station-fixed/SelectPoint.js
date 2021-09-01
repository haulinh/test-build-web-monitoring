import { Select } from 'antd'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import { get } from 'lodash-es'
import React from 'react'

export class SelectPoint extends React.Component {
  state = {
    points: [],
  }

  fetchPoints = async () => {
    const { condition } = this.props
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {
        active: true,
        ...condition,
      },
    }

    const points = await getPoint({ filter: filterPoint })

    this.setState({
      points: points.data,
    })

    if (this.props.onFetchSuccess) {
      this.props.onFetchSuccess(points.data)
    }
  }

  componentDidMount() {
    this.fetchPoints()
  }

  getPoints = () => {
    let points = this.state.points
    const { provinceId, stationTypeId } = this.props
    if (provinceId) {
      points = points.filter(point => point.provinceId === provinceId)
    }

    if (stationTypeId) {
      points = points.filter(point => point.stationTypeId === stationTypeId)
    }

    return points
  }

  handleOnChange = list => {
    const { points } = this.state
    const { onChange, onChangeName } = this.props
    const pointMaps = new Map(points.map(item => [item.key, item.name]))

    const pointKeys = list.filter(key => pointMaps.has(key))

    onChange(pointKeys)

    if (typeof onChangeName === 'function') {
      const pointNames = pointKeys.map(key => pointMaps.get(key))
      onChangeName(pointNames)
    }
  }

  render() {
    const { mode, value, pointNames, ...otherProps } = this.props
    const points = this.getPoints()

    const pointMap = new Map(points.map(item => [item.key, item.name]))

    const selectValue = Array.isArray(value)
      ? value.map((key, idx) =>
          pointMap.has(key) ? key : get(pointNames, idx, key)
        )
      : pointMap.has(value)
      ? value
      : pointNames

    return (
      <Select
        {...otherProps}
        allowClear
        value={!value ? value : selectValue}
        onChange={this.handleOnChange}
        autoClearSearchValue
        mode={mode || 'default'}
        optionFilterProp="name"
        style={{ width: '100%' }}
      >
        {points.map(point => (
          <Select.Option key={point.key} value={point.key} name={point.name}>
            {point.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
