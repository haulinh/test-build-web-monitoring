import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import MonitoringMapView from './map'
import { getLastLog } from 'api/StationAuto'
import { map as _map, pick as _pick } from 'lodash'

const MapWrapper = styled.div`
  flex: 1;
`

@withRouter
export default class MapMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string
  }

  state = {
    isLoading: false,
    stationMap: [],
    stationFocus: null
  }

  async componentWillMount() {
    this.setState({ isLoading: true })

    let res = await getLastLog()
    if (res.success) {
      res.data = _map(res.data, item => {
        const customNew = _pick(item, ['_id', 'key', 'name', 'stationType'])
        const mapLocation = {
          lat: parseFloat(item.mapLocation.lat),
          lng: parseFloat(item.mapLocation.long)
        }
        let focusStaion = false
        if (this.props.stationID === customNew._id) {
          focusStaion = true
          this.setState({
            stationFocus: mapLocation
          })
        }
        return { ...customNew, mapLocation, focusStaion }
      })
      this.setState({
        isLoading: false,
        stationMap: res.data
      })
    }
  }

  render() {
    return (
      <MapWrapper>
        {!this.state.isLoading && (
          <MonitoringMapView
            stationFocus={this.state.stationFocus}
            stationMap={this.state.stationMap ? this.state.stationMap : []}
          />
        )}
      </MapWrapper>
    )
  }
}
