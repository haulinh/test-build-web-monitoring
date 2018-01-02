/* eslint-disable */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'
import MarkerCar from 'components/map/marker/marker-car'
import MarkerCarReal from 'components/map/marker/marker-car/real'
import { getGoogleMapProps } from 'components/map/utils'
import carList from 'fake-data/car'
import carRealList from 'fake-data/carReal'

const MapCarContainer = styled.div``

@withScriptjs
@withGoogleMap
class CustomGoogleMap extends PureComponent {
  static propTypes = {
    markerFilter: PropTypes.object
  }

  static defaultProps = {
    markerFilter: {}
  }

  render() {
    const markerFilter = this.props.markerFilter
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 10.726909, lng: 106.616678 }}
      >
        <div>
          {markerFilter.isXe &&
            this.props.carList.map(location => (
              <MarkerCar
                mapLocation={location.mapLocation}
                name={location.name}
                key={location.id}
                listLocation={location.listLocation}
                status={location.status}
                stationDetails={location.stationDetails}
                stationDistance={location.stationDistance}
                truckLoad={location.truckLoad}
                type={location.type}
                organization={location.organization}
              />
            ))}
          {markerFilter.isXe &&
            this.props.carRealList.map(location => (
              <MarkerCarReal
                mapLocation={location.mapLocation}
                name={location.name}
                key={location.id}
                listLocation={location.listLocation}
                status={location.status}
                stationDetails={location.stationDetails}
                stationDistance={location.stationDistance}
                truckLoad={location.truckLoad}
                type={location.type}
                organization={location.organization}
              />
            ))}
        </div>
      </GoogleMap>
    )
  }
}

export default class MapCar extends PureComponent {
  static propTypes = {
    markerFilter: PropTypes.object
  }

  render() {
    return (
      <MapCarContainer>
        <CustomGoogleMap
          carList={carList}
          carRealList={carRealList}
          markerFilter={this.props.markerFilter}
          {...getGoogleMapProps()}
        />
      </MapCarContainer>
    )
  }
}
