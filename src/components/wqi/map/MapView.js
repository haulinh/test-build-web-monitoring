/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Polygon,
} from 'react-google-maps'
import { withProps } from 'recompose'
import { getGoogleMapProps } from 'components/map/utils'

import { map as mapLodash, get, find, inRange } from 'lodash'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { Tooltip } from 'antd'
import moment from 'moment-timezone'
import { DD_MM_YYYY_HH_MM } from '../../../constants/format-date'
import wqiLevel from 'constants/wqi-level'
import { GOOGLE_MAP } from 'config'
import { isNumber } from 'util'

const StationNameView = styled.b`
  color: white;
  font-size: 13px;
  font-style: bold;
`

const TimeView = styled.b`
  font-style: bold;
  color: white;
  font-size: 10px;
`

const WindowInfo = ({ aqi, name }) => {
  const time = moment(get(aqi, 'time', new Date())).format(DD_MM_YYYY_HH_MM)

  return (
    <div>
      <div>
        <StationNameView>{name}</StationNameView>
      </div>
      <div>
        <TimeView>{time}</TimeView>
      </div>
    </div>
  )
}

const WqiMarker = ({ item, onMapClick }) => {
  const value = get(item, 'wqi.value', ' - ')
  let level = null
  if (isNumber(value))
    level = find(wqiLevel, ({ min, max }) => inRange(value, min, max))
  const color = get(level, 'color', null)
  return (
    <InfoBox
      defaultPosition={
        new google.maps.LatLng(item.mapLocation.lat, item.mapLocation.long)
      }
      options={{ closeBoxURL: ``, enableEventPropagation: true }}
    >
      <Tooltip title={<WindowInfo {...item} />}>
        <div
          style={{
            backgroundColor: color || 'green',
            padding: `4px 8px`,
            borderRadius: 3,
            borderColor: '#fff',
            borderWidth: 1,
          }}
          onClick={() => {
            if (onMapClick) {
              onMapClick(item)
            }
          }}
        >
          <div>
            <span style={{ fontSize: `16px`, color: `#000` }}>{value}</span>
          </div>
        </div>
      </Tooltip>
    </InfoBox>
  )
}

@withProps({
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
    GOOGLE_MAP.KEY
  }&v=3.exp&libraries=geometry,drawing,places`,
})
@withScriptjs
@withGoogleMap
class CustomGoogleMap extends PureComponent {
  state = {
    isBounds: false,
  }

  getBounds() {
    if (_.size(this.props.wqiList) > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      _.map(this.props.wqiList, item => {
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
      zoom: nextProps.zoom,
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
          {mapLodash(this.props.wqiList, (item, index) => (
            <WqiMarker
              onMapClick={this.props.onMapClick}
              mapLocation={item.mapLocation}
              item={item}
              key={`${index}`}
            />
          ))}
        </div>
      </GoogleMap>
    )
  }
}

export default CustomGoogleMap
