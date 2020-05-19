/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'
import { withProps } from 'recompose'
import {
  map as mapLodash,
  get,
  find,
  inRange,
  values as _values,
  omit as _omit
} from 'lodash'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import { Tooltip, Popover, Typography, Row, Col } from 'antd'
const { Text } = Typography

// import aqiLevel from 'constants/aqi-level'
import { GOOGLE_MAP } from 'config'

const WinDowInfoWrapper = styled.div`
  max-width: 330px;
`
const WindowInfo = ({
  name,
  address,
  aqiDay,
  backgroundColor,
  color,
  description
}) => {
  // console.log(time,"WindowInfo")

  return (
    <WinDowInfoWrapper>
      <div style={{ padding: 8 }}>
        <div>
          <Text style={{ fontSize: 16, color: '#1890FF' }} strong>
            {name}
          </Text>
        </div>
        <div>
          <Text type="secondary">{address}</Text>
        </div>
      </div>

      <div
        style={{
          background: backgroundColor,
          borderRadius: 10,
          color: color,
          display: 'flex'
        }}
      >
        <Row>
          <Col
            span={10}
            style={{
              // background: "url(/images/background_1.png) no-repeat",

              padding: 8
            }}
          >
            <div>
              <div style={{ fontSize: 15 }}>AQI</div>
              <div style={{ fontSize: 38, fontWeight: 'bold' }}> {aqiDay}</div>
            </div>
          </Col>
          <Col
            style={{
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
            span={14}
          >
            <div>{description}</div>
          </Col>
        </Row>
      </div>
    </WinDowInfoWrapper>
  )
}

const InfoBoxWrapper = styled.div`
  .ant-popover-inner-content {
    padding: 0px;
  }
`

const AqiMarker = ({ item, aqiLevel, onMapClick }) => {
  const value = get(item, 'aqiDay', '')
  const name = get(item, 'name', '')
  const address = get(item, 'address', '')
  const level = find(aqiLevel, ({ min, max }) => {
    return (
      inRange(value, min, max) ||
      value === max ||
      (min < value && !max) ||
      (max > value && !min)
    )
  })
  const backgroundColor = get(level, 'backgroundColor', null)
  const colorFont = get(level, 'color', null)
  const description = get(level, 'description', null)
  // console.log(colorFont, get(level, "name", null), "colorFont")
  const colorBorder = '#FFFFFF'
  return (
    <InfoBoxWrapper id="popover-marker">
      <InfoBox
        defaultPosition={
          new google.maps.LatLng(item.mapLocation.lat, item.mapLocation.long)
        }
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <Popover
          content={
            <WindowInfo
              description={description}
              color={colorFont}
              aqiDay={value}
              address={address}
              name={name}
              backgroundColor={backgroundColor}
            />
          }
          title=""
          trigger="click"
          getPopupContainer={() => document.getElementById('popover-marker')}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor || 'yellow',
                padding: `4px`,
                borderRadius: '50%',
                border: `2px solid ${colorBorder}`,
                width: 45,
                height: 45,
                marginBottom: 6
              }}
              onClick={() => {
                if (onMapClick) {
                  onMapClick(item)
                }
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: `16px`,
                    color: colorFont,
                    fontWeight: 'bold'
                  }}
                >
                  {value}
                </span>
              </div>
            </div>

            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `8px solid ${colorBorder}`,
                zIndex: 2,
                position: 'absolute',
                bottom: '-1px'
              }}
            />
          </div>
        </Popover>
      </InfoBox>
    </InfoBoxWrapper>
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
    // console.log(this.props.aqiList,"this.props.aqiList,")
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
              onMapClick={this.props.onMapClick}
              aqiLevel={this.props.aqiLevel}
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
