import React from 'react'
import connectWindowHeight from 'hoc/window-height'
import MapView from './MapView'
import { getGoogleMapProps } from 'components/map/utils'

import AqiLevelInfo from './AqiLevelInfo'

@connectWindowHeight
export default class MapComponent extends React.Component {
  render() {
    return (
      <div style={{ height: this.props.windowHeight, flex: 2 }}>
        <AqiLevelInfo />
        <MapView
          ref={map => {
            this.mapTamp = map
          }}
          aqiList={this.props.aqiList}
          // center={this.props.center}
          // getMap={this.setMap}
          // getRefMarker={this.setListMarker}
          zoom={this.props.zoom}
          {...getGoogleMapProps()}
          loadingElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
          containerElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
          mapElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
          onMapClick={this.props.onMapClick}
        />
      </div>
    )
  }
}
