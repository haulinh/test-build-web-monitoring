import React from 'react'
import styled from 'styled-components'

import stationConfigApi from 'api/StationConfigApi'
import MapComponent from 'components/wqi/map'
import * as _ from 'lodash'
import wqiApi from 'api/WqiApi'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

const stationType = 'WQI'
@protectRole(ROLE.WQI.VIEW)
export default class WqiContainer extends React.Component {
  state = {
    wqiList: [],
    wqiLevel: [],
    station: null,
    stationKey: null,
  }

  async componentDidMount() {
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
    }

    const rsWqi = await wqiApi.fetchWQILastLogs({ ...params })
    let dataRes = _.get(rsWqi, 'data', [])
    // console.log(dataRes,"dataRes")
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

    this.setState({ wqiList, wqiLevel: _.get(rsWqi, 'wqiLevel', []) })

    const station = _.head(wqiList)

    if (!_.isEmpty(station)) {
      this.setState({ station })
    }
  }

  handleOnClosePopup = () => {
    this.setState({
      stationKey: null,
    })
  }

  handleMarkerClick = station => {
    console.log(station, '-handleMarkerClick-')
    this.setState({
      stationKey: _.get(station, 'key'),
    })
  }

  render() {
    return (
      <WrapperContainer>
        <MapComponent
          wqiList={this.state.wqiList}
          wqiLevel={this.state.wqiLevel}
          style={{ flex: 2, background: 'blue' }}
          onMarkerClick={this.handleMarkerClick}
          stationKey={this.state.stationKey}
          onClose={this.handleOnClosePopup}

        />
      </WrapperContainer>
    )
  }
}
