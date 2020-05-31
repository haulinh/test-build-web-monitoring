/* eslint-disable */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import Icon from 'themes/markerIcon'
import { Icon, Tabs } from 'antd'
import { connectAutoDispatch } from 'redux/connect'
import { getStationAuto } from 'redux/actions/map'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { SHAPE, COLOR, COLOR_DEVICE_STATUS } from 'themes/color'
import Clearfix from 'components/elements/clearfix'
import Viewmore from './info-window-viewmore'
import { translate } from 'hoc/create-lang'
// import stationStatus from 'constants/stationStatus'

const { InfoWindow, Circle } = require('react-google-maps')
import Marker from '../utils/marker-with-label-animate'
import { Table } from 'react-bootstrap'
// import DateFormat from 'dateformat'
import { warningLevels } from 'constants/warningLevels'
import { STATUS_STATION } from 'constants/stationStatus'
import moment from 'moment-timezone'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import _, { isEmpty, map, get as _get } from 'lodash'
import { getFormatNumber } from 'constants/format-number'

const TabPane = Tabs.TabPane

const InfoTitle = styled.div`
  color: ${props => (props.color ? props.color : '#37b44c')};
  font-size: 14px;
  font-weight: 600;
`
const Label = styled.span`
  font-size: inherit;
  font-weight: bold;
`

const WrapperInfoWindow = styled.div`
  position: relative;
  max-height: 335px;
  display: flex;
  flex-direction: column;
`

const MarkerImage = styled.img`
  width: 100%;
  height: 145px;
  object-fit: cover;
`

const MHeader = styled.div`
  display: flex;
  flex-direction: column;
`
const MRow = props => {
  //mất kết nối
  if (props.isLoss) {
    return null
  }
  return (
    <div>
      <Label>{props.title}</Label>
      {props.value}
      {/* <span style={{ color: props.isLoss ? 'orange' : 'inherit' }}>
          {props.value}
        </span> */}
    </div>
  )
}

const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
`
@connectAutoDispatch(
  state => ({
    focusStationKey: _get(state, 'map.stationAuto.key', ''),
  }),
  {
    getStationAuto,
  }
)
@autobind
export default class MarkerStation extends PureComponent {
  static propTypes = {
    mapLocation: PropTypes.object,
    name: PropTypes.string,
    stationId: PropTypes.string,
    status: PropTypes.string,
    address: PropTypes.string,
    stationKey: PropTypes.string,
    stationTypeKey: PropTypes.string,
    lastLog: PropTypes.object,
    measuringList: PropTypes.array,
    options: PropTypes.object,
    visible: PropTypes.bool,
    stationStatus: PropTypes.string,
    byStationStatus: PropTypes.string,
    image: PropTypes.object,
  }
  state = {
    tableData: '',
  }

  toggleOpen() {
    const stationSelected = {
      key: this.props.stationKey,
      name: this.props.name,
    }
    this.props.getStationAuto(stationSelected)
  }

  getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas =
      this.getTextWidth.canvas ||
      (this.getTextWidth.canvas = document.createElement('canvas'))
    var context = canvas.getContext('2d')
    context.font = 'Roboto'
    var metrics = context.measureText(text)
    return metrics.width * 1.5
  }

  componentDidMount() {
    if (this.props.getRef) this.props.getRef(this)
    this.setState({
      tableData: this.renderTableData(),
    })
  }

  getColorLevel(warningLevel) {
    let stationStatus = _get(this.props, 'stationStatus')
    if (stationStatus === STATUS_STATION.HIGHTGEST)
      return COLOR[STATUS_STATION.HIGHTGEST]

    if (warningLevel && COLOR[warningLevel]) return COLOR[warningLevel]

    return COLOR.GOOD
  }

  renderTableData() {
    if (!this.props.lastLog || !this.props.lastLog.measuringLogs) return ''
    let lastLog = this.props.lastLog

    let measuringList = map(
      this.props.measuringList,
      ({ name, key, unit }, index) => {
        const statusDevice = _get(
          lastLog.measuringLogs[key],
          'statusDevice',
          null
        )
        const warningLevel = _get(
          lastLog.measuringLogs[key],
          'warningLevel',
          null
        )

        let colorDeviceStatus = COLOR_DEVICE_STATUS[statusDevice]
        // console.log("--------")
        // console.log(lastLog.measuringLogs[key],this.props.statusStation, 'this.props.statusStation')
        // Nếu trạm mất kết nối thì các sensor cũng mất kêt nối theo
        if (
          this.props.stationStatus &&
          this.props.stationStatus === STATUS_STATION.HIGHTGEST
        ) {
          colorDeviceStatus = COLOR[STATUS_STATION.HIGHTGEST]
        }
        // console.log( this.props, 'statusDevice')

        const value = _get(lastLog, ['measuringLogs', key, 'value'], '')
        // console.log(value, "value")
        return (
          <tr key={`${index + 1}`}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td
              style={{
                color: this.getColorLevel(warningLevel),
                fontWeight: '600',
                textAlign: 'right',
              }}
            >
              {typeof value === 'number' ? getFormatNumber(value) : ''}
            </td>
            <td>{unit}</td>
            <td
              style={{
                textAlign: 'center',
                padding: '0px',
                verticalAlign: 'middle',
              }}
            >
              <Dot
                style={{
                  backgroundColor: colorDeviceStatus,
                }}
              />
            </td>
          </tr>
        )
      }
    )

    return (
      <div>
        <MHeader>
          <MRow
            title={`${translate('map.marker.time')}: `}
            value={moment(this.props.lastLog.receivedAt).format(
              DD_MM_YYYY_HH_MM
            )}
          />
          <Clearfix height={8} />
          <InfoTitle color={'rgba(0, 0, 0, 0.65)'}>
            {translate('map.marker.result')}:
          </InfoTitle>
        </MHeader>

        <Clearfix height={8} />
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>{translate('map.dataTable.measuring')}</th>
              <th>{translate('map.dataTable.value')}</th>
              <th>{translate('map.dataTable.unit')}</th>
              <th>{translate('map.dataTable.statusSensor')}</th>
            </tr>
          </thead>
          <tbody>{measuringList}</tbody>
        </Table>
      </div>
    )
  }

  // getColorLevel(status, isStationStatus = false) {
  //   if (isStationStatus && STATUS_OPTIONS[status]) return STATUS_OPTIONS[status].color

  //   if (!isStationStatus) if (status && status !== '') return COLOR[status.toUpperCase()]

  //   return COLOR.GOOD
  // }

  getIconByStatus(status) {
    let icon = ''
    switch (status) {
      case warningLevels.GOOD:
        icon = '/images/marker-icon/station-good.png'
        break
      case warningLevels.LOSS:
        icon = '/images/marker-icon/station-lost-connection.png'
        break
      case warningLevels.EXCEEDED_PREPARING:
        icon = '/images/marker-icon/staion-tend-to-exceed.png'
        break
      case warningLevels.EXCEEDED:
        icon = '/images/marker-icon/station-exceed.png'
        break
    }
    return icon
  }

  renderStationStatus(status) {
    switch (status) {
      case STATUS_STATION.DATA_LOSS:
        return translate('map.marker.dataLoss')
        break
      case STATUS_STATION.NOT_USE:
        return translate('map.marker.notUse')
        break
      default:
        return ''
        break
    }
  }
  renderTabInfoWindow = (html, imageData) => {
    const url = _get(imageData, 'url')
    const views = isEmpty(url) ? (
      html
    ) : (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="info-circle" theme="outlined" />
              {translate('map.marker.info')}
            </span>
          }
          key="1"
        >
          {html}
        </TabPane>
        {!isEmpty(url) && (
          <TabPane
            tab={
              <span>
                <Icon type="picture" theme="outlined" />
                {translate('map.marker.image')}
              </span>
            }
            key="2"
          >
            <MarkerImage src={url} />
          </TabPane>
        )}
      </Tabs>
    )
    return views
  }
  render() {
    return (
      <div>
        <Marker
          //visible={this.props.visible}
          icon={{
            url: this.getIconByStatus(this.props.status), //this.getIconByStatus(this.props.status),
            // scaledSize: new google.maps.Size(30, 30)
            // path:  google.maps.SymbolPath.CIRCLE,
            // scale: 8,
            // strokeWeight: 1,
            // strokeColor: '#00',
            // fillColor: this.getColorLevel(
            //   this.props.byStationStatus
            //     ? this.props.stationStatus
            //     : this.props.status,
            //   this.props.byStationStatus
            // ),
            // fillColor: this.getColorLevel(
            //   this.props.status,
            //   this.props.byStationStatus
            // ),
            // fillOpacity: 1
          }}
          onClick={this.toggleOpen}
          position={this.props.mapLocation}
          labelProps={{
            labelContent: this.props.name
              ? this.props.stationStatus === STATUS_STATION.GOOD
                ? this.props.name
                : this.props.name +
                  '<br/>' +
                  this.renderStationStatus(this.props.stationStatus)
              : 'label',
            labelAnchor: new google.maps.Point(
              this.getTextWidth(this.props.name ? this.props.name : 'label') /
                2,
              -1
            ),
            labelStyle: {
              color: 'white',
              fontSize: '14px',
              fontFamily: 'Roboto, Arial, sans-serif',
              background: '#6AA84F',
              padding: '0px 4px',
              padding: '2px',
              textAlign: 'center',
              whiteteSpace: 'nowrap',
              width:
                this.getTextWidth(this.props.name ? this.props.name : 'label') +
                'px',
            },
          }}
        >
          <div>
            {this.props.stationKey === this.props.focusStationKey &&
              this.props.name &&
              this.props.name != '' && (
                <InfoWindow
                  options={{
                    //disableAutoPan: true,
                    maxWidth: 450,
                  }}
                >
                  <WrapperInfoWindow>
                    <Viewmore
                      measuringList={this.props.measuringList}
                      stationId={this.props.stationId}
                      stationName={this.props.name}
                      stationKey={this.props.stationKey}
                      stationTypeKey={this.props.stationTypeKey}
                      options={this.props.options}
                    />
                    <InfoTitle>{this.props.name}</InfoTitle>
                    <Clearfix height={8} />
                    <div>
                      <Label>{translate('map.dataTable.longitude')}: </Label>
                      {`${this.props.mapLocation.lng} - `}
                      <Label>{translate('map.dataTable.latitude')}: </Label>
                      {`${this.props.mapLocation.lat}`}
                    </div>
                    <Clearfix height={8} />
                    <div>
                      <Label>{translate('map.dataTable.address')}: </Label>
                      {_get(this.props, 'address', '')}
                    </div>
                    <Clearfix height={8} />
                    {/* {this.props.lastLog && this.state.tableData} */}
                    {this.renderTabInfoWindow(
                      this.props.lastLog && this.state.tableData,
                      this.props.image
                    )}
                  </WrapperInfoWindow>
                </InfoWindow>
              )}
          </div>
        </Marker>
      </div>
    )
  }
}
