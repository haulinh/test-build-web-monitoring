/* eslint-disable */
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'
import { withProps } from 'recompose'

import { map as mapLodash, get, find, inRange } from 'lodash'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import { GOOGLE_MAP } from 'config'
import { Popover, Typography, Row, Col, Icon } from 'antd'
const { Text } = Typography

const WinDowInfoWrapper = styled.div`
  max-width: 330px;
`

const WindowInfo = ({
  name,
  address,
  aqiDay,
  backgroundColor,
  color,
  description,
  onClose,
}) => {
  return (
    <WinDowInfoWrapper>
      <div style={{ padding: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Text style={{ fontSize: 16, color: '#1890FF' }} strong>
              {name}
            </Text>
          </div>
          <div style={{ cursor: 'pointer' }}>
            <Icon
              onClick={() => {
                if (onClose) {
                  onClose()
                }
              }}
              type="close-circle"
            />
          </div>
        </div>
        <div>
          <Text type="secondary">{address}</Text>
        </div>
      </div>

      <div
        style={{
          background: backgroundColor,
          borderRadius: '10px 10px 0px 0px',
          color: color,
          display: 'flex',
        }}
      >
        <Row>
          <Col
            span={6}
            style={{
              // background: "url(/images/background_1.png) no-repeat",

              padding: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 15 }}>WQI</div>
              <div style={{ fontSize: 38, fontWeight: 'bold' }}> {aqiDay}</div>
            </div>
          </Col>
          <Col
            style={{
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
            span={18}
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
  .infoBox {
    width: 'auto !important';
  }
`

const WqiMarker = ({ item, wqiLevel, onMarkerClick, stationKey, onClose }) => {
  const value = get(item, 'wqiDay', '')
  const name = get(item, 'name', '')
  const address = get(item, 'address', '')
  const level = find(wqiLevel, ({ min, max }) => {
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

  const isFocus = stationKey === get(item, 'key', null) ? true : false
  console.log(isFocus, '---isFocus--')
  return (
    <InfoBoxWrapper id="popover-marker">
      <InfoBox
        defaultPosition={
          new google.maps.LatLng(item.mapLocation.lat, item.mapLocation.long)
        }
        options={{
          closeBoxURL: ``,
          enableEventPropagation: true,
        }}
        zIndex={isFocus ? 1 : 0}
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
              onClose={onClose}
            />
          }
          visible={isFocus}
          title=""
          trigger="click"
          getPopupContainer={() => document.getElementById('popover-marker')}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
                width: isFocus ? 55 : 45,
                height: isFocus ? 55 : 45,
                // width:55,
                // height: 55,
                marginBottom: 6,
              }}
              onClick={() => {
                if (onMarkerClick) {
                  onMarkerClick(item)
                }
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: isFocus ? `18px` : '16px',
                    color: colorFont,
                    fontWeight: 'bold',
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
                bottom: '-1px',
              }}
            />
          </div>
        </Popover>
      </InfoBox>
    </InfoBoxWrapper>
  )
}

@withProps({
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP.KEY}&v=3.exp&libraries=geometry,drawing,places`,
})
@withScriptjs
@withGoogleMap
class CustomGoogleMap extends React.Component {
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
  onClosePopup = () => {
    if (this.props.onClose && this.props.stationKey) {
      this.props.onClose()
    }
  }

  render() {
    const DEFAULT_CENTER = { lat: 10.7607494, lng: 106.6954122 }
    return (
      <GoogleMap
        ref={map => {
          if(map){
            this.map = map
            if (!this.state.isBounds) this.getBounds()
          }       
        }}
        defaultZoom={11}
        defaultCenter={DEFAULT_CENTER}
        center={this.props.center}
        zoom={11}
        onZoomChanged={() => {
          this.onClosePopup()
        }}
        onDragStart={() => {
          console.log('---onDragStart--')
          this.onClosePopup()
        }}
      >
        <div>
          {mapLodash(this.props.wqiList, (item, index) => {
            return (
              <WqiMarker
                mapLocation={item.mapLocation}
                wqiLevel={this.props.wqiLevel}
                stationKey={this.props.stationKey}
                onClose={this.onClosePopup}
                onMarkerClick={this.props.onMarkerClick}
                item={item}
                key={`${item.key}`}
              />
            )
          })}
        </div>
      </GoogleMap>
    )
  }
}

export default CustomGoogleMap
