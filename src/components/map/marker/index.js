/* eslint-disable */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import Icon from 'themes/markerIcon'
import { Menu, Dropdown, Icon } from 'antd'
import LinkA from 'components/elements/link-a'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { SHAPE } from 'themes/color'
import Clearfix from 'components/elements/clearfix'
import Viewmore from './info-window-viewmore'
import { translate } from 'hoc/create-lang'
// import stationStatus from 'constants/stationStatus'

const { InfoWindow, Circle } = require('react-google-maps')
import Marker from '../utils/marker-with-label-animate'
import { Table } from 'react-bootstrap'
// import DateFormat from 'dateformat'
import { colorLevels } from 'constants/warningLevels'
import stStatus from 'constants/stationStatus'
import moment from 'moment'

const MIN_WIDTH_INFO = 150

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
    stationStatus: PropTypes.string
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
    let measuringList = this.props.measuringList.map((item, index) => {
      return (
        <tr key={index + 1}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td
            style={{
              color: lastLog.measuringLogs[item.key]
                ? colorLevels[lastLog.measuringLogs[item.key].warningLevel]
                : colorLevels.DEFAULT
            }}
          >
            {lastLog.measuringLogs[item.key]
              ? lastLog.measuringLogs[item.key].value
              : ''}
          </td>
          <td>{item.unit}</td>
        </tr>
      )
    })
    return (
      <div>
        <span
          style={{
            color:
              this.props.stationStatus !== stStatus.DATA_LOSS
                ? 'inherit'
                : 'orange'
          }}
        >
          {this.props.stationStatus !== stStatus.DATA_LOSS
            ? translate('map.dataTable.dataReceived')
            : translate('map.dataTable.dataLossAt')}{' '}
          {/* {DateFormat(new Date(lastLog.receivedAt), 'yyyy/mm/dd hh:mm:ss')} */}
          {moment(lastLog.receivedAt, 'YYYY-MM-DD hh:mm').format(
            'YYYY/MM/DD hh:mm'
          )}
        </span>
        <Clearfix height={8} />
        <Table striped={true} bordered condensed hover responsive={true}>
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

  getColorLevel(status) {
    if (status && status !== '') return colorLevels[status.toUpperCase()]
    else return colorLevels.GOOD
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
            fillColor: this.getColorLevel(this.props.status),
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
              backgroundColor: '#2ecc71',
              borderRadius: '3px',
              fontSize: '12px',
              padding: '2px',
              color: 'white',
              textAlign: 'center',
              whiteteSpace: 'nowrap',
              width:
                this.getTextWidth(this.props.name ? this.props.name : 'label') +
                'px'
            }
          }}
        >
          <div>
            {this.state.isOpen &&
              this.props.name &&
              this.props.name != '' && (
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
                        {translate('map.dataTable.address')}:{' '}
                        {this.props.address}
                      </div>
                    )}
                    <Clearfix height={8} />
                    {this.props.lastLog && this.state.tableData}
                  </WrapperInfoWindow>
                </InfoWindow>
              )}
          </div>
        </Marker>
      </div>
    )
  }
}
