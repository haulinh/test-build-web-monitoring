/* eslint-disable */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from 'themes/markerIcon'
const { InfoWindow } = require('react-google-maps')
import Marker from 'components/map/utils/marker-with-label-animate'
const { InfoBox } = require('react-google-maps/lib/components/addons/InfoBox')

const MIN_WIDTH_INFO = '150px'
export default class MarkerTransitStation extends PureComponent {
  static propTypes = {
    mapLocation: PropTypes.object,
    name: PropTypes.string,
  }

  state = {
    isOpen: false,
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    return (
      <div>
        <Marker
          icon={{
            url: Icon.transitStation, // url
            scaledSize: new google.maps.Size(30, 30),
          }}
          onClick={this.toggleOpen}
          position={this.props.mapLocation}
          labelProps={{
            labelContent: this.props.name ? this.props.name : 'label',
            labelAnchor: new google.maps.Point(this.props.name.length * 2.4, 0),
            labelStyle: {
              //backgroundColor: 'transparent',
              color: '#ff9900',
              fontWeight: 'bold',
              fontSize: '10px',
              width: this.props.name.length * 7,
            },
          }}
        >
          {this.state.isOpen ? (
            <InfoWindow onCloseClick={this.toggleOpen}>
              <div style={{ minWidth: MIN_WIDTH_INFO }}>{this.props.name}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      </div>
    )
  }
}
