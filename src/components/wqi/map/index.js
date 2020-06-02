import React from 'react'
import connectWindowHeight from 'hoc/window-height'
import MapView from './MapView'
import { getGoogleMapProps } from 'components/map/utils'

import WqiLevelInfo from './WqiLevelInfo'

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
        <WqiLevelInfo wqiLevel={this.props.wqiLevel} />
        <MapView
          wqiList={this.props.wqiList}
          wqiLevel={this.props.wqiLevel}
          stationKey={this.props.stationKey}
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
          onMarkerClick={this.props.onMarkerClick}
          onClose={this.props.onClose}
        />
      </div>
    )
  }
}
