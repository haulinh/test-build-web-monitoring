import CategoryApi from 'api/CategoryApi'
import React, { Component } from 'react'
import StationAutoApi from 'api/StationAuto'
import { get } from 'lodash-es'
import { TreeSelect } from 'antd'

const { SHOW_PARENT } = TreeSelect

export default class TreeSelectStation extends Component {
  state = {
    stationTypes: [],
    stationAutos: [],
  }

  async componentDidMount() {
    const resStationTypes = await CategoryApi.getStationTypes(
      {},
      { isAuto: true }
    )

    const resStationAuto = await StationAutoApi.getStationAutoAll({
      page: 1,
      itemPerPage: Number.MAX_SAFE_INTEGER,
    })

    const stationAutos = get(resStationAuto, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )

    this.setState({ stationTypes: resStationTypes.data, stationAutos })
  }

  treeData = this.state.stationTypes.map(stationType => ({
    title: stationType.name,
    value: stationType.key,
    key: stationType.key,
  }))

  getTreeData = () => {
    const { stationTypes, stationAutos } = this.state
    const treeData = stationTypes.map(stationType => {
      const stationAutosOfStationType = stationAutos.filter(
        stationAuto => stationAuto.stationType._id === stationType._id
      )
      return {
        title: stationType.name,
        value: stationType._id,
        key: stationType._id,
        children: stationAutosOfStationType.map(station => ({
          title: station.name,
          value: station._id,
          key: station._id,
        })),
      }
    })
    return treeData
  }

  handleOnChange = value => {
    const { stationTypes, stationAutos } = this.state
    const { onChange } = this.props

    const stationTypeIds = stationTypes.map(stationType => stationType._id)

    const stationAutoIds = value.reduce((baseStationAutoIds, current) => {
      if (stationTypeIds.includes(current)) {
        const stationAutosOfStationType = stationAutos
          .filter(stationAuto => stationAuto.stationType._id === current)
          .map(stationAuto => stationAuto._id)

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
      showCheckedStrategy: SHOW_PARENT,
      placeholder: 'Please select',
      style: {
        width: '100%',
      },
    }

    return <TreeSelect {...this.props} {...tProps} />
  }
}
