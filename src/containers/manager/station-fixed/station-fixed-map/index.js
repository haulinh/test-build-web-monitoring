import React from 'react'
import { pick } from 'lodash'
import styled from 'styled-components'
import { autobind } from 'core-decorators'
import BoxHideLayout from 'components/map/box-hide-layout'
import { STATUS_STATION } from 'constants/stationStatus'
import { connectAutoDispatch } from 'redux/connect'
import { getStationAuto } from 'redux/actions/map'
import searchSidebarType from 'constants/searchSidebarType'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import MapView from './map-view'
import SidebarNormal from './sidebar/SidebarNormal'
import connectWindowHeight from './hoc-window-height'
import { getStatusItem } from 'constants/stationStatus'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi'

const MapDefaultWrapper = styled.div`
  display: flex;
  height: ${props => props.height}px;
  padding-top: 8px;
  margin-bottom: 8px;
  overflow: hidden;
`

const Clearfix = styled.div`
  width: 8px;
`

const MapCenter = styled.div`
  flex: 1;
`
const ColRight = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
`

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
`


@queryFormDataBrowser([])
@protectRole(ROLE.MAP_STATION_FIXED.VIEW)
@connectWindowHeight
@connectAutoDispatch(
  state => ({
    lang: state.language.locale,
  }),
  {
    getStationAuto,
  }
)
@autobind
export default class MapDefault extends React.PureComponent {
  state = {
    stationsAuto: [],
    stationSelected: {},
    sidebarType: searchSidebarType.NORMAL,
    center: null,
    map: null,
    zoom: 5,
    isHidden: false,
    isLeft: true,
    isRight: true,
  }

  handleChangeSidebarType(e, sidebarType) {
    if (e) e.preventDefault()
    this.setState({
      sidebarType,
    })
  }

  setStateZoom = zoom => this.setState({ zoom })

  handleSelectStation(stationSelected) {
    this.setState(
      {
        center: stationSelected.mapLocation,
        stationSelected,
        zoom: 20,
      },
      () => {
        this.props.getStationAuto(pick(stationSelected, ['_id', 'key', 'name']))
      }
    )
  }

  handleMarkerClick = center => {
    this.setState({ zoom: 20, center })
  }

  componentDidMount() {
    if (this.props.formData.stationAuto) {
      setTimeout(() => {
        this.handleSelectStation(this.props.formData.stationAuto)
      }, 1000)
    }
  }

  async componentWillMount() {
    const result = await StationFixedPointApi.getLastLog()
    const data = result.map(item => {
      const statusAnalytic = !item.isUsed ? STATUS_STATION.NOT_USE : getStatusItem(item);
      return {
        ...item,
        mapLocation: {
          lat: +item.mapLocation.lat,
          lng: +item.mapLocation.lng,
        },
        statusAnalytic,
        status: !item.isUsed ? STATUS_STATION.NOT_USE : undefined
      }
    })

    this.setState({ stationsAuto: data })
  }

  handelOnLickHideLeftLayout({ isLeft, isRight }) {
    this.setState({
      isLeft: isLeft,
    })
  }

  handelOnLickHideRightLayout({ isLeft, isRight }) {
    this.setState({
      isRight: isRight,
    })
  }

  fillStatusChange(focusStatus, findBy) {
    let res = this.state.stationsAuto
    res = res.map(element => {
      element.visible = false
      let status
      if (element.statusAnalytic === STATUS_STATION.GOOD) {
        status = STATUS_STATION.GOOD
      }

      if (findBy === 'byStationStatus') {
        element.byStationStatus = true
        if (element.status === STATUS_STATION.DATA_LOSS) {
          status = STATUS_STATION.DATA_LOSS
        }
        if (element.status === STATUS_STATION.NOT_USE) {
          status = STATUS_STATION.NOT_USE
        }
      }

      if (findBy === 'byDataStatus') {
        status = element.statusAnalytic
      }

      if (focusStatus.includes(status)) element.visible = true
      return element
    })

    this.setState({
      stationsAuto: res,
    })
  }

  renderSidebar = () => (
    <SidebarNormal
      analytic={{
        stationsAutoList: this.state.stationsAuto,
        fillStatusChange: this.fillStatusChange,
      }}
      searchStation={{
        onSelectStation: this.handleSelectStation,
        stationSelected: this.state.stationSelected,
        stationsAuto: this.state.stationsAuto,
      }}
    />
  )

  render() {
    return (
      <MapDefaultWrapper height={this.props.windowHeight}>
        <Clearfix />
        <BoxHideLayout handelOnLick={this.handelOnLickHideLeftLayout} />
        <MapCenter>
          <MapView
            setStateZoom={this.setStateZoom}
            ref={mapView => {
              this.mapView = mapView
            }}
            windowHeight={this.props.windowHeight}
            center={this.state.center}
            getMap={map => this.setState({ map })}
            zoom={this.state.zoom}
            lang={this.props.lang}
            stationsAutoList={this.state.stationsAuto}
            handleMarkerClick={this.handleMarkerClick}
          />
        </MapCenter>
        <BoxHideLayout
          isRight={true}
          handelOnLick={this.handelOnLickHideRightLayout}
        />
        {this.state.isRight && (
          <ColRight>
            <RightWrapper>{this.renderSidebar()}</RightWrapper>
          </ColRight>
        )}
        <Clearfix />
      </MapDefaultWrapper>
    )
  }
}
