import React from 'react'
// import PropTypes from "prop-types";
// import styled from "styled-components";
import { TreeSelect } from 'antd'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'

// const { SHOW_PARENT } = TreeSelect;

export default class SelectStationTreeView extends React.Component {
  state = {
    value: [],
    stationAutoSelects: [],
    treeData: [],
  }

  async componentWillMount() {
    try {
      const response = await StationAutoApi.getStationAutos({
        page: 1,
        itemPerPage: 10000000,
      })

      const stationTypeTamp = _.map(response.data, 'stationType')
      const stationTypeData = _.uniqBy(stationTypeTamp, 'key')
      const groupData = _.groupBy(response.data, 'stationType.key')

      let treeData = stationTypeData.map(stationType => {
        const stationList = groupData[stationType.key]
        const nodeChilren = stationList.map(station => {
          return {
            title: station.name,
            value: station.key,
            key: `station_${station.key}`,
          }
        })
        return {
          title: stationType.name,
          value: stationType.key,
          key: `type_${stationType.key}`,
          children: nodeChilren,
        }
      })
      // console.log("treeData", treeData);
      const defaultObject = _.get(treeData, '[0].children', [])
      const listKey = defaultObject.map(data => data.value)

      this.setState({
        stationAutoSelects: response.data,
        isLoaded: true,
        treeData,
        value: [...listKey]
      })

      const { onAutoSubmit } = this.props
      if (typeof onAutoSubmit === 'function') {
        onAutoSubmit(listKey)
      }


    } catch (e) { }
  }


  onChange = value => {
    this.setState({ value })
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {

    return (
      <TreeSelect
        dropdownPopupAlign={{
          overflow: { adjustX: false, adjustY: false },
        }}
        treeData={this.state.treeData}

        value={this.state.value}
        onChange={this.onChange}
        treeCheckable
        maxTagCount={10}
        maxTagTextLength={15}
        maxTagPlaceholder={15}
        showCheckedStrategy="SHOW_CHILD"
        searchPlaceholder={translate(
          'avgSearchFrom.form.stationAuto.placeholder'
        )}
        style={{
          width: '100%',
        }}
      />
    )
  }
}
