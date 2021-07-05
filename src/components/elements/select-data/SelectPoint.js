import { Select } from 'antd'
import { getPoint } from 'api/station-fixed/StationFixedPointApi'
import React from 'react'

export class SelectPoint extends React.Component {
  state = {
    points: [],
  }

  fetchPoints = async () => {
    const filterPoint = {
      limit: 100,
      skip: 0,
      where: {
        active: true,
      },
    }
    const points = await getPoint({ filter: filterPoint })

    this.setState({
      points: points.data,
    })
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

  handleOnChange = pointKey => {
    const { onChange, onChangeObject } = this.props
    onChange(pointKey)
    if (onChangeObject) {
      const point = this.state.points.find(point => point.key === pointKey)
      console.log({ point })
      onChangeObject(point)
    }
  }

  render() {
    const { mode } = this.props
    const points = this.getPoints()
    return (
      <Select
        onChange={this.handleOnChange}
        autoClearSearchValue
        allowClear
        mode={mode || 'default'}
        optionFilterProp="children"
        // this props allow search name and _id
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0 ||
          option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{ width: '100%' }}
      >
        {points.map(point => (
          <Select.Option key={point.key} value={point.key}>
            {point.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
