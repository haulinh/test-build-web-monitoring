import React from 'react'
import connectWindowHeight from 'hoc/window-height'
import MapView from './MapView'
import { getGoogleMapProps } from 'components/map/utils'

import AqiLevelInfo from './AqiLevelInfo'

@connectWindowHeight
export default class MapComponent extends React.Component {
  render() {
    return (
      <div
        style={{
          height: this.props.windowHeight,
          flex: 2,
          position: 'relative',
        }}
      >
        <AqiLevelInfo locale={this.props.locale} />
        <MapView
          stationKey={this.props.stationKey}
          aqiLevel={this.props.aqiLevel}
          aqiList={this.props.aqiList}
          // zoom={this.props.zoom}
          center={this.props.center}
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
          onMarkerClick={this.props.onMarkerClick}
          onClose={this.props.onClose}
        />
      </div>
    )
  }
}
