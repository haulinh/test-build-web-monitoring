import CategoryApi from 'api/CategoryApi'
import React, { Component } from 'react'
import StationAutoApi from 'api/StationAuto'
import { get } from 'lodash-es'
import { TreeSelect } from 'antd'
import _ from 'lodash'

export default class TreeSelectStation extends Component {
  state = {
    stationTypes: [],
    stationAutos: [],
  }

  async componentDidMount() {
    const [resStationTypes, resStationAuto] = await Promise.all([
      CategoryApi.getStationTypes( {}, { isAuto: true }),
      StationAutoApi.getStationAutoAll({ page: 1, itemPerPage: Number.MAX_SAFE_INTEGER})
    ]) 

    const stationAutos = get(resStationAuto, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )

    if (this.props.onStationAutosFetchSuccess) {
      this.props.onStationAutosFetchSuccess(stationAutos, resStationTypes.data)
    }

    this.setState({ stationTypes: resStationTypes.data, stationAutos })
  }

  treeData = this.state.stationTypes.map(stationType => ({
    title: stationType.name,
    value: stationType.key,
    key: stationType.key,
  }))

  getStationAutos = () => {
    const { province, fieldValue } = this.props
    let stationAutos = this.state.stationAutos

    if (province && (province !=='other')) {
      stationAutos = stationAutos.filter(stationAuto => {
        const provinceValue = _.get(
          stationAuto,
          ['province', fieldValue || 'key'],
          ''
        )
        return provinceValue === province
      })
    }

    if (province === 'other') {
      stationAutos = stationAutos.filter(stationAuto => !get(stationAuto, 'province.key'))
    }
    
    return stationAutos
  }

  getTreeData = () => {
    const { stationTypes } = this.state
    const { fieldValue } = this.props
    const stationAutos = this.getStationAutos()
    const treeData = stationTypes
      .map(stationType => {
        const stationAutosOfStationType = stationAutos.filter(
          stationAuto => stationAuto.stationType._id === stationType._id
        )
        return {
          title: stationType.name,
          value: stationType._id,
          key: stationType._id,
          children: stationAutosOfStationType.map(station => ({
            title: station.name,
            value: station[fieldValue || 'key'],
            key: station._id,
          })),
        }
      })
      .filter(item => item.children.length !== 0)
    return treeData
  }

  handleOnChange = value => {
    const { stationTypes } = this.state
    const { onChange, fieldValue } = this.props

    const stationAutos = this.getStationAutos()

    const stationTypeIds = stationTypes.map(stationType => stationType._id)

    const stationAutoIds = value.reduce((baseStationAutoIds, current) => {
      if (stationTypeIds.includes(current)) {
        const stationAutosOfStationType = stationAutos
          .filter(stationAuto => stationAuto.stationType._id === current)
          .map(stationAuto => stationAuto[fieldValue || 'key'])

        return [...baseStationAutoIds, ...stationAutosOfStationType]
      }
      return [...baseStationAutoIds, current]
    }, [])

    if (onChange) {
      onChange(stationAutoIds)
    }
  }

  render() {
    const tProps = {
      treeData: this.getTreeData(),
      treeCheckable: true,
      onChange: this.handleOnChange,
      // showCheckedStrategy: SHOW_PARENT,
      maxTagCount: 5,
      style: {
        width: '100%',
      },
      allowClear: true,
    }

    return <TreeSelect {...tProps} {...this.props} />
  }
}
