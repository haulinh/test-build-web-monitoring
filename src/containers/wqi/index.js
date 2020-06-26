import React from 'react'
import styled from 'styled-components'

import stationConfigApi from 'api/StationConfigApi'
import MapComponent from 'components/wqi/map'
import InfoComponent from 'components/wqi/info'
import ReferencesComponent from 'components/elements/references'

import * as _ from 'lodash'
import wqiApi from 'api/WqiApi'
import { getListConfigWqi } from 'api/CategoryApi'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'
import { Radio, Spin } from 'antd'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

const WrapperInfoContainer = styled.div`
  padding: 16px;
  flex: 1;
  .ant-radio-group {
    display: flex;
    .ant-radio-button-wrapper {
      flex: 1;
      text-align: center;
      border-radius: 4px;
      border-left: 1px solid #d9d9d9;
      &.ant-radio-button-wrapper-checked {
        border-left: 0;
      }
      &.ant-radio-button-wrapper:not(:first-child)::before {
        display: none;
      }
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
`

const stationType = 'WQI'
@protectRole(ROLE.WQI.VIEW)
export default class WqiContainer extends React.Component {
  state = {
    wqiList: [],
    wqiLevel: [],
    wqiConfig: [],
    wqiSelected: null,
    station: null,
    stationKey: null,
    center: null,
    qsListKey: '',
    isLoaded: false,
    isLoading: false,
  }

  async componentDidMount() {
    try {
      const wqiConfigListRes = await getListConfigWqi()
      let wqiConfigList = _.get(wqiConfigListRes, 'data.value', [])
      wqiConfigList = wqiConfigList.filter(item => item.activated)
      const firstConfig = _.first(wqiConfigList)
      const wqiSelected = firstConfig ? firstConfig.key : null

      const stationConfigs = await stationConfigApi.getStationsConfig(
        {},
        { config: stationType }
      )
      const stationData = _.map(
        _.get(stationConfigs, 'data', []),
        itemStation => {
          return itemStation.key
        }
      )

      const listKey = _.join(stationData, ',')
      const params = {
        listKey: listKey,
        code: wqiSelected,
      }

      const rsWqi = await wqiApi.fetchWQILastLogs({ ...params })
      let dataRes = _.get(rsWqi, 'data', [])
      dataRes = _.map(dataRes, item => {
        const time = _.get(item, 'time', null)
        const valuesData = _.values(_.omit(item, 'time'))
        if (time) {
          return {
            time,
            ...valuesData[0],
          }
        } else {
          return null
        }
      })
      const wqiList = _.compact(dataRes)

      this.setState({
        wqiList,
        wqiConfig: wqiConfigList,
        wqiSelected,
        wqiLevel: _.get(rsWqi, 'wqiLevel', []),
        qsListKey: listKey,
        isLoaded: true,
      })

      const station = _.head(wqiList)

      if (!_.isEmpty(station)) {
        this.setState({ station })
      }
    } catch (e) {
      this.setState({ isLoaded: true })
    }
  }

  handleOnClosePopup = () => {
    this.setState({
      stationKey: null,
    })
  }

  handleMarkerClick = station => {
    this.setState({
      stationKey: _.get(station, 'key'),
    })
  }

  handleOnSelect = ({ key, mapLocation }) => {
    this.setState({
      center: mapLocation,
      stationKey: null,
    })
    setTimeout(() => {
      this.setState({
        stationKey: key,
      })
    }, 500)
  }

  wqiKeyChange = async ({ target }) => {
    const wqiSelected = target.value
    this.setState({ wqiSelected, isLoading: true })

    const rsWqi = await wqiApi.fetchWQILastLogs({
      listKey: this.state.qsListKey,
      code: wqiSelected,
    })
    let dataRes = _.get(rsWqi, 'data', [])
    dataRes = _.map(dataRes, item => {
      const time = _.get(item, 'time', null)
      const valuesData = _.values(_.omit(item, 'time'))
      if (time) {
        return {
          time,
          ...valuesData[0],
        }
      } else {
        return null
      }
    })
    const wqiList = _.compact(dataRes)

    this.setState({
      wqiList,
      wqiLevel: _.get(rsWqi, 'wqiLevel', []),
      isLoading: false,
    })
  }

  render() {
    const { wqiConfig, isLoaded } = this.state
    if (!isLoaded) return null

    const isHaveConfig = wqiConfig.length > 0
    if (!isHaveConfig)
      return (
        <ReferencesComponent
          title={translate('wqi.reference')}
          pathGoto={slug.advance.configWqi}
        />
      )

    return (
      <Spin spinning={this.state.isLoading}>
        <WrapperContainer>
          <MapComponent
            wqiList={this.state.wqiList}
            wqiLevel={this.state.wqiLevel}
            style={{ flex: 2, background: 'blue' }}
            onMarkerClick={this.handleMarkerClick}
            stationKey={this.state.stationKey}
            onClose={this.handleOnClosePopup}
            center={this.state.center}
          />
          <WrapperInfoContainer>
            <Radio.Group
              value={this.state.wqiSelected}
              buttonStyle="solid"
              onChange={this.wqiKeyChange}
            >
              {wqiConfig.map(config => (
                <Radio.Button key={config.key} value={config.key}>
                  {config.name}
                </Radio.Button>
              ))}
            </Radio.Group>
            <InfoComponent
              wqiList={this.state.wqiList}
              wqiLevel={this.state.wqiLevel}
              onSelect={this.handleOnSelect}
            />
          </WrapperInfoContainer>
        </WrapperContainer>
      </Spin>
    )
  }
}
