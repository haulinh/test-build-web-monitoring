import { Select } from 'antd'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import React from 'react'

export class SelectPoint extends React.Component {
  state = {
    points: [],
  }

  fetchPoints = async () => {
    const {condition} = this.props
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {
        active: true,
        ...condition
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

  handleOnChange = pointKeys => {
    const { onChange, onChangeName } = this.props
    const { points } = this.state
    onChange(pointKeys)
    if (typeof onChangeName === 'function') {
      const pointNameMap = new Map(points.map(item => [item.key, item.name]))
      const pointNames = pointKeys.map(key => pointNameMap.get(key));
      onChangeName(pointNames);
    }
  }

  render() {
    const { mode, value, pointNames, ...otherProps } = this.props
    const points = this.getPoints()

    const pointMap = new Map(points.map(item => [item.key, item]));

    const selectValue = Array.isArray(value)
      ? value.map((key, idx) => pointMap.has(key) ? key : pointNames[idx])
      : value

    return (
      <Select
        {...otherProps}
        allowClear
        value={selectValue}
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
