import React from "react"
import styled from "styled-components"

import InfoComponent from "../../components/aqi/info"
import MapComponent from "../../components/aqi/map"
import * as _ from "lodash"

import aqiApi from "api/AqiApi"
import stationConfigApi from "api/StationConfigApi"
// import moment from 'moment'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

export default class AqiContainer extends React.Component {
  state = {
    aqiList: [],
    station: null
  }

  async componentDidMount() {
    try {
      const stationConfigs = await stationConfigApi.getStationsConfig(
        {},
        { config: "AQI" }
      )
      const stationData = _.map(
        _.get(stationConfigs, "data", []),
        itemStation => {
          return itemStation.key
        }
      )

      const listKey = _.join(stationData, ",")
      // console.log(listKey,'listKey')
      const params = {
        // from: moment().utc().startOf('day').format(),
        // to:  moment().utc().startOf('day').format(),
        // timezoneDay:  moment().format("HH"),
        listKey: listKey
      }
      let rs = await aqiApi.fetchAqiDayLastLogs({ ...params })

      // const rs = await fetchAqiByHour()
      let dataRes = _.get(rs, "data", [])
      // console.log(dataRes,"dataRes")
      dataRes = _.map(dataRes, item => {
        const time = _.get(item, "time", null)
        const valuesData = _.values(_.omit(item, "time"))
        if (time) {
          return {
            time,
            ...valuesData[0]
          }
        } else {
          return null
        }
      })
      const aqiList =_.compact(dataRes) 
      // console.log(aqiList, "aqiList")
      this.setState({ aqiList })

      const station = _.head(aqiList)

      if (!_.isEmpty(station)) {
        this.setState({ station })
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  handleMarkerClick = station => {
    this.setState({ station })
  }

  render() {
    return (
      <WrapperContainer>
        <MapComponent
          aqiList={this.state.aqiList}
          style={{ flex: 2, background: "blue" }}
          onMapClick={this.handleMarkerClick}
        />
        <InfoComponent
          station={this.state.station}
          style={{ flex: 1 }}
          aqiList={this.state.aqiList}
        />
      </WrapperContainer>
    )
  }
}
