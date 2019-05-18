/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'
// import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { map as _map } from 'lodash'
import { getGoogleMapProps } from 'components/map/utils'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const MapContainer = styled.div`
  position: relative;
`

@withScriptjs
@withGoogleMap
class CustomGoogleMap extends PureComponent {
  static propTypes = {
    defaultCenter: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }),
    defaultZoom: PropTypes.number.isRequired,
    stationMap: PropTypes.array
  }

  state = {
    zoom: null
  }

  calculateString = value => {
    if (!value) {
      return 0
    }
    return value.length * 3.7
  }
  render() {
    // console.log(this.props.stationMap, 'stationMap')
    return (
      <GoogleMap
        defaultZoom={this.props.defaultZoom}
        defaultCenter={this.props.defaultCenter}
      >
        <div className="googleMap--maker">
          {/* <MarkerClusterer
            averageCenter
            enableRetinaIcons
            // gridSize={70}
            // maxZoom={11}
          > */}
          {this.props.stationMap.length &&
            _map(this.props.stationMap, (item, index) => {
              const item_location = item.mapLocation
              if (!item_location) return null

              let styleLable = {
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Roboto, Arial, sans-serif',
                background: '#6AA84F',
                padding: '0px 4px'
              }
              let item_icon ='/images/marker-icon/station-normal.png'
              if (item.focusStaion) {
                styleLable = {
                  ...styleLable,
                  color: 'white',
                  fontWeight: '600'
                }
                item_icon = '/images/marker-icon/station-select-1.png'
              }
              return (
                <MarkerWithLabel
                  position={item_location}
                  labelAnchor={
                    new google.maps.Point(this.calculateString(item.name), 0)
                  }
                  labelStyle={styleLable}
                  icon={item_icon}
                >
                  <div>{item.name}</div>
                </MarkerWithLabel>
              )
            })}

          {/* </MarkerClusterer> */}
        </div>
      </GoogleMap>
    )
  }
}

const defaultCenter = { lat: 10.7607494, lng: 106.6954122 }
const defaultZoom = 19

@connect(state => ({
  lang: state.language.locale
}))
export default class MonitoringMapView extends PureComponent {
  static propTypes = {
    stationMap: PropTypes.array,
    stationFocus: PropTypes.object
  }
  state = {}

  render() {
    // console.log(getGoogleMapProps(), 'getGoogleMapProps()')
    return (
      <MapContainer>
        <CustomGoogleMap
          defaultCenter={
            this.props.stationFocus ? this.props.stationFocus : defaultCenter
          }
          defaultZoom={defaultZoom}
          {...getGoogleMapProps(this.props.lang)}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          stationMap={this.props.stationMap}
        />
      </MapContainer>
    )
  }
}
