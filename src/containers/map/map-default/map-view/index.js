/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Polygon,
} from 'react-google-maps'
import { getGoogleMapProps } from 'components/map/utils'
import MarkerStation from 'components/map/marker'
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer'
import LevelIntro from 'components/map/level-intro'

import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { warningLevelsNumber, warningLevels } from 'constants/warningLevels'

const MapContainer = styled.div`
  position: relative;
`
const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: #ffffff;
  border: 1px solid #eee;
  padding: 4px;
  z-index: 2;
`

@withScriptjs
@withGoogleMap
class CustomGoogleMap extends PureComponent {
  static propTypes = {
    getMap: PropTypes.func,
    getRefMarker: PropTypes.func,
    stationAutoMarker: PropTypes.array,
  }
  state = {
    zoom: 12,
    isBounds: false,
  }

  onMarkerClustererClick(markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers()
  }

  async componentDidMount() {
    if (this.props.getMap) this.props.getMap(this.map)
  }

  getRefMarker(marker) {
    if (this.props.getRefMarker) this.props.getRefMarker(marker)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      zoom: nextProps.zoom,
    })
  }

  getBounds() {
    if (this.props.stationAutoMarker.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      this.props.stationAutoMarker.map(item => {
        bounds.extend(item.mapLocation)
      })
      if (this.map && this.map.fitBounds) {
        this.state.isBounds = true
        this.map.fitBounds(bounds)
      }
    }
  }

  getStatusStation(measuringLogs) {
    let result = warningLevels.GOOD
    for (let key in measuringLogs) {
      if (
        warningLevelsNumber[result] <
        warningLevelsNumber[measuringLogs[key].warningLevel]
      )
        result = measuringLogs[key].warningLevel
    }
    return result
  }

  render() {
    const defaultCenter = { lat: 10.7607494, lng: 106.6954122 }
    return (
      <GoogleMap
        ref={map => {
          window.map = map
          if (!this.state.isBounds) this.getBounds()
          this.map = map
        }}
        defaultZoom={12}
        //defaultCenter={defaultCenter}
        // center={this.props.center ? this.props.center : defaultCenter}
        center={this.props.center && this.props.center}
        zoom={this.state.zoom}
        onZoomChanged={() => {
          this.setState({
            zoom: this.map.getZoom(),
          })
          // if (this.state.isBound)
          //   this.setState({
          //     zoom: this.map.getZoom(),
          //   })
        }}
      >
        <div>
          <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={70}
            maxZoom={11}
          >
            {this.props.stationAutoMarker.map((item, index) => {
              if (item.visible) {
                item.measuringList.sort(function(a, b) {
                  return a.numericalOrder - b.numericalOrder
                })
                // debugger
                // console.log(item.mapLocation,"mapLocationr")
                return (
                  <MarkerStation
                    code={item.key}
                    visible={false}
                    stationKey={item.key}
                    stationId={item._id}
                    stationTypeKey={item.stationType.key}
                    stationType={item.stationType}
                    getRef={this.getRefMarker.bind(this)}
                    mapLocation={item.mapLocation}
                    visible={item.visible}
                    name={item.name}
                    key={item.key}
                    status={
                      item.statusAnalytic
                        ? item.statusAnalytic
                        : warningLevels.GOOD
                    }
                    stationStatus={item.status}
                    byStationStatus={item.byStationStatus}
                    address={item.address}
                    lastLog={item.lastLog}
                    options={item.options}
                    measuringList={item.measuringList}
                    image={item.image}
                  />
                )
              } else return <div key={item.key} />
            })}
            <Polygon
              paths={[
                { lat: 14.561882, lng: 112.208539 },
                { lat: 16.33181, lng: 112.3315 },
                { lat: 16.33181, lng: 116.446871 },
                { lat: 14.453348, lng: 116.446871 },
              ]}
              options={{
                fillColor: '#B3D9FB',
                strokeColor: '#B3D9FB',
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: '#B3D9FB',
                fillOpacity: 1,
              }}
            />
          </MarkerClusterer>
        </div>
      </GoogleMap>
    )
  }
}

@autobind
export default class MapStationAuto extends PureComponent {
  static propTypes = {
    handleGetStationAuto: PropTypes.func,
    stationAutoMarker: PropTypes.array,
    getMap: PropTypes.func,
    lang: PropTypes.string,
  }
  state = {
    map: {},
    listStationMarker: [],
    isHidden: false,
  }
  setMap(map) {
    this.setState({ map })
    if (this.props.getMap) this.props.getMap(map)
  }

  setListMarker(marker) {
    this.state.listStationMarker.push(marker)
  }

  openInfoMarkerByKey(stationKey) {
    this.state.listStationMarker.forEach(item => {
      if (item.props.code === stationKey) item.openToggle()
      else item.closeToggle()
    })
  }

  closeInfoMarker() {
    this.state.listStationMarker.forEach(item => {
      item.closeToggle()
    })
  }

  async componentDidMount() {}

  handelIsHidden() {
    this.setState(
      {
        isHidden: !this.state.isHidden,
      },
      () => {
        if (this.props.handleIsHidden)
          this.props.handleIsHidden(this.state.isHidden)
      }
    )
  }

  render() {
    return (
      <MapContainer>
        <LevelWrapper>
          <LevelIntro />
        </LevelWrapper>
        <CustomGoogleMap
          ref={map => {
            this.mapTamp = map
          }}
          stationAutoMarker={this.props.stationsAutoList}
          center={this.props.center}
          getMap={this.setMap}
          getRefMarker={this.setListMarker}
          zoom={this.props.zoom}
          {...getGoogleMapProps(this.props.lang)}
          loadingElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
          containerElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
          mapElement={
            <div style={{ height: this.props.windowHeight + 'px' }} />
          }
        />
      </MapContainer>
    )
  }
}
