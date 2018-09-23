/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Polygon
} from 'react-google-maps'
import { withProps } from 'recompose'
import { getGoogleMapProps } from 'components/map/utils'
import { map as mapLodash, get, find, inRange } from 'lodash'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'

import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox'
import aqiLevel from '../../../constants/aqi-level'
import { GOOGLE_MAP } from 'config'

const AqiMarker = ({ mapLocation, name, aqi }) => {
  const value = get(aqi, 'value', '')
  const level = find(aqiLevel, ({ min, max }) => inRange(value, min, max))
  const color = get(level, 'color', null)
  return (
    <InfoBox
      defaultPosition={
        new google.maps.LatLng(mapLocation.lat, mapLocation.long)
      }
      options={{ closeBoxURL: ``, enableEventPropagation: true }}
    >
      <div
        style={{
          backgroundColor: color || 'yellow',
          padding: `4px 8px`,
          borderRadius: 3,
          borderColor: '#fff',
          borderWidth: 1
        }}
      >
        <div>
          <span style={{ fontSize: `16px`, color: `#fff` }}>{value}</span>
        </div>
      </div>
    </InfoBox>
  )
}

@withProps({
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
    GOOGLE_MAP.KEY
  }&v=3.exp&libraries=geometry,drawing,places`
})
@withScriptjs
@withGoogleMap
class CustomGoogleMap extends PureComponent {
  state = {
    isBounds: false
  }

  getBounds() {
    if (_.size(this.props.aqiList) > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      _.map(this.props.aqiList, item => {
        bounds.extend(
          new google.maps.LatLng(item.mapLocation.lat, item.mapLocation.long)
        )
      })
      if (this.map && this.map.fitBounds) {
        this.state.isBounds = true
        this.map.fitBounds(bounds)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      zoom: nextProps.zoom
    })
  }

  render() {
    const defaultCenter = { lat: 10.7607494, lng: 106.6954122 }
    return (
      <GoogleMap
        ref={map => {
          if (!this.state.isBounds) this.getBounds()
          this.map = map
        }}
        defaultZoom={12}
        defaultCenter={defaultCenter}
        zoom={12}
      >
        <div>
          {mapLodash(this.props.aqiList, (item, index) => (
            <AqiMarker
              mapLocation={item.mapLocation}
              name={item.name}
              aqi={item.aqi}
              key={`${index}`}
            />
          ))}
        </div>
      </GoogleMap>
    )
  }
}

export default CustomGoogleMap
