/* eslint-disable */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import Icon from 'themes/markerIcon'
import { Menu, Dropdown, Icon, Tabs } from 'antd'
import LinkA from 'components/elements/link-a'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { SHAPE, COLOR_STATUS } from 'themes/color'
import Clearfix from 'components/elements/clearfix'
import Viewmore from './info-window-viewmore'
import { translate } from 'hoc/create-lang'
// import stationStatus from 'constants/stationStatus'

const { InfoWindow, Circle } = require('react-google-maps')
import Marker from '../utils/marker-with-label-animate'
import { Table } from 'react-bootstrap'
// import DateFormat from 'dateformat'
import { colorLevels } from 'constants/warningLevels'
import stStatus, { STATUS_OPTIONS } from 'constants/stationStatus'
import moment from 'moment'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { get, isEmpty, map, isEqual, round } from 'lodash'

const MIN_WIDTH_INFO = 150
const TabPane = Tabs.TabPane

const InfoTitle = styled.div`
  color: #37b44c;
  font-size: 14px;
  font-weight: 600;
`

const WrapperInfoWindow = styled.div`
  min-width: ${MIN_WIDTH_INFO}px;
  position: relative;
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
const MRow = props => (
  <div>
    <span style={{ color: props.isLoss ? 'orange' : 'inherit' }}>
      {props.title}
      {props.value}
    </span>
  </div>
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
    options: PropTypes.array,
    visible: PropTypes.bool,
    stationStatus: PropTypes.string,
    byStationStatus: PropTypes.string,
    image: PropTypes.object
  }
  state = {
    isOpen: false,
    tableData: ''
  }

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  closeToggle() {
    this.setState({
      isOpen: false
    })
  }

  openToggle() {
    if (!this.state.isOpen)
      this.setState({
        isOpen: true
      })
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
      tableData: this.renderTableData()
    })
  }

  renderTableData() {
    if (!this.props.lastLog) return ''
    let lastLog = this.props.lastLog
    let measuringList = map(
      this.props.measuringList,
      ({ name, key, unit }, index) => {
        return (
          <tr key={`${index + 1}`}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td
              style={{
                color: get(
                  colorLevels,
                  [lastLog.measuringLogs[key], 'warningLevel'],
                  colorLevels.DEFAULT
                ),
                textAlign: 'right'
              }}
            >
              {round(get(lastLog, ['measuringLogs', key, 'value'], ''), 2)
              // lastLog.measuringLogs[item.key]
              // ? lastLog.measuringLogs[item.key].value
              // : ''
              }
            </td>
            <td>{unit}</td>
          </tr>
        )
      }
    )
    return (
      <div>
        <MHeader>
          <MRow
            title={`${translate('map.marker.status')}: `}
            value={`${translate(
              `map.marker.${
                isEqual(this.props.stationStatus, stStatus.DATA_LOSS)
                  ? 'dataLoss'
                  : 'transmitting'
              }`
            )}`}
          />
          <MRow
            isLoss={isEqual(this.props.stationStatus, stStatus.DATA_LOSS)}
            title={`${translate('map.marker.time')}: `}
            value={moment(
              this.props.lastLog.receivedAt,
              'YYYY-MM-DD hh:mm'
            ).format(DD_MM_YYYY_HH_MM)}
          />
          <MRow title={`${translate('map.marker.result')}: `} value="" />
        </MHeader>

        <Clearfix height={8} />
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>{translate('map.dataTable.measuring')}</th>
              <th>{translate('map.dataTable.value')}</th>
              <th>{translate('map.dataTable.unit')}</th>
            </tr>
          </thead>
          <tbody>{measuringList}</tbody>
        </Table>
      </div>
    )
  }

  getColorLevel(status, isStationStatus = false) {
    if (isStationStatus && STATUS_OPTIONS[status])
      return STATUS_OPTIONS[status].color

    if (!isStationStatus)
      if (status && status !== '') return COLOR_STATUS[status.toUpperCase()]

    return COLOR_STATUS.GOOD
  }

  renderStationStatus(status) {
    switch (status) {
      case stStatus.DATA_LOSS:
        return translate('map.marker.dataLoss')
        break
      case stStatus.NOT_USE:
        return translate('map.marker.notUse')
        break
      default:
        return ''
        break
    }
  }
  renderTabInfoWindow = (html, imageData) => {
    const url = get(imageData, 'url')
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
            // url: this.getIconByStatus(this.props.status), // url
            // scaledSize: new google.maps.Size(30, 30)
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            strokeWeight: 1,
            strokeColor: '#00',
            // fillColor: this.getColorLevel(
            //   this.props.byStationStatus
            //     ? this.props.stationStatus
            //     : this.props.status,
            //   this.props.byStationStatus
            // ),
            fillColor: this.getColorLevel(
              this.props.status,
              this.props.byStationStatus
            ),
            fillOpacity: 1
          }}
          onClick={this.toggleOpen}
          position={this.props.mapLocation}
          labelProps={{
            labelContent: this.props.name
              ? this.props.stationStatus === stStatus.GOOD
                ? this.props.name
                : this.props.name +
                  '<br/>' +
                  this.renderStationStatus(this.props.stationStatus)
              : 'label',
            labelAnchor: new google.maps.Point(
              this.getTextWidth(this.props.name ? this.props.name : 'label') /
                2,
              -15
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
                'px'
            }
          }}
        >
          <div>
            {this.state.isOpen && this.props.name && this.props.name != '' && (
              <InfoWindow
                ref={info => {
                  if (!info && this.state.isOpen)
                    this.setState({ isOpen: false })
                }}
                options={{
                  //disableAutoPan: true,
                  maxWidth: 300
                }}
                onCloseClick={this.toggleOpen.bind(this)}
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
                    {translate('map.dataTable.longitude')}:{' '}
                    {this.props.mapLocation.lng} -{' '}
                    {translate('map.dataTable.latitude')}:{' '}
                    {this.props.mapLocation.lat}
                  </div>
                  <Clearfix height={8} />
                  {this.props.address && (
                    <div>
                      {' '}
                      {translate('map.dataTable.address')}: {this.props.address}
                    </div>
                  )}
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
