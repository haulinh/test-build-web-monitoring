import React, { Component } from 'react'
import { getStationTypes } from 'api/CategoryApi'
import { Cascader } from 'antd'
import StationFixedPhaseApi from 'api/station-fixed/StationFixedPhaseApi'

export default class SelectPhase extends Component {
  state = {
    options: [],
  }

  componentDidMount() {
    this.getListStationType()
  }

  getListStationType = async () => {
    const results = await getStationTypes({ itemPerPage: 100 }, {isAuto: false})
    this.setState({
      options: results.data.map(item => ({
        stationTypeId: item._id,
        value: item._id,
        label: item.name,
        isLeaf: false,
      })),
    })
  }

  onChange = (value, selectedOptions) => {
    const {onChange} = this.props
    onChange(selectedOptions)
  }

  loadData = async selectedOptions => {
    const { options } = this.state
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const params = {
      stationTypeId: targetOption.stationTypeId
    }
    targetOption.loading = true
    const results = await StationFixedPhaseApi.getStationFixedPhases(
      { itemPerPage: 100 },
      params
    )
    targetOption.loading = false
    targetOption.children = results.map(item => ({
      value: item._id,
      label: item.name,
    }))

    this.setState({ options: [...options] })
  }

  render() {
    const { options } = this.state
    return (
      <Cascader
        placeholder=""
        options={options}
        onChange={this.onChange}
        loadData={this.loadData}
      />
    )
  }
}
