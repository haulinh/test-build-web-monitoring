import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  map as _map,
  forEach as _forEach,
  differenceBy as _differenceBy,
  compact as _compact
} from 'lodash'
import { Transfer, Spin } from 'antd'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi'

const ContainerWrapper = styled.div`
  .ant-transfer-list {
    width: 47%;
  }
`

export default class SelectMeasuring extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    stationTypeId: PropTypes.string,
  }

  state = {
    dataSource: [],
    targetKeys: [],
    loading: false,
    selectedKeys: [],
  }

  componentDidUpdate = (propsPrev, statePrev) => {
    if (propsPrev.stationTypeId !== this.props.stationTypeId) {
      this.loadData()
    }

    if (statePrev.targetKeys !== this.state.targetKeys) {
      if (this.props.onChange) this.props.onChange(this.state.targetKeys)
    }
  }

  loadData = () => {
    this.setState({
      loading: true,
    })
    StationFixedPointApi.getStationFixedPoints(
      {},
      { stationTypeId: this.props.stationTypeId }
    )
      .then(res => {
        const data = []
        _forEach(res.data, item => {
          if (item.measuringList) {
            const itemArr = _map(item.measuringList, itemMeasuring => {
              if (itemMeasuring.key) {
                return {
                  key: itemMeasuring.key,
                  title: itemMeasuring.name,
                  description: itemMeasuring.name,
                }
              }
            })

            const newData = _differenceBy(_compact(itemArr), data, 'key')
            data.push(...newData)
          }
        })

        this.setState({
          dataSource: data,
        })
      })
      .catch(ex => {
        this.setState({
          dataSource: [],
        })
      })
      .finally(() => {
        this.setState({
          targetKeys: [],
          selectedKeys: [],
          loading: false,
        })
      })
  }

  handleOnChange = (newTargetKeys, direction, moveKeys) => {
    this.setState({
      targetKeys: newTargetKeys,
    })
  }
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
    })
  }

  render() {
    return (
      <ContainerWrapper>
        <Spin size="large" spinning={this.state.loading}>
          <Transfer
            showSearch
            className="tree-transfer"
            filterOption={(inputValue, item) =>
              item.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            listStyle={{
              height: 300,
            }}
            dataSource={this.state.dataSource}
            targetKeys={this.state.targetKeys}
            selectedKeys={this.state.selectedKeys}
            onChange={this.handleOnChange}
            onSelectChange={this.handleSelectChange}
            render={item => `${item.title} [${item.key}]`}
            oneWay={true}
            // pagination
          />
        </Spin>
      </ContainerWrapper>
    )
  }
}
