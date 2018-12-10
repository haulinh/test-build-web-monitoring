import React from 'react'
import connectWindowHeight from 'hoc/window-height'
import MapView from './MapView'
import { getGoogleMapProps } from 'components/map/utils'

import WqiLevelInfo from './WqiLevelInfo'

@connectWindowHeight
export default class MapComponent extends React.Component {
  render() {
    return (
      <div style={{ height: this.props.windowHeight, flex: 2 }}>
        <WqiLevelInfo />
        <MapView
          ref={map => {
            this.mapTamp = map
          }}
          wqiList={this.props.wqiList}
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
