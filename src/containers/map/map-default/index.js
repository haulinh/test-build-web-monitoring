import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import StationAutoApi from 'api/StationAuto'
import MapView from './map-view'
import { resolveMapLocation } from 'utils/resolveMapLocation'
import BoxHideLayout from 'components/map/box-hide-layout'
import stationStatus from 'constants/stationStatus'
// import { warningLevelsNumber, warningLevels } from 'constants/warningLevels'
import searchSidebarType from 'constants/searchSidebarType'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import connectWindowHeight from '../hoc-window-height'
import SidebarNormal from './sidebar/SidebarNormal'
import { getStatusItem } from 'constants/stationStatus'

// import SidebarNotifications from './sidebar/SidebarNotifications.remove'
// import { TYPE } from './components/box-analytic-list/SelectType'

const MapDefaultWrapper = styled.div`
  display: flex;
  height: ${props => props.height}px;
  margin-top: 8px;
  margin-bottom: 8px;
`

const Clearfix = styled.div`
  width: 8px;
`

// const ColLeft = styled.div`
//   width: 240px;
//   display: flex;
// `
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
@protectRole(ROLE.MAP.VIEW)
@connectWindowHeight
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
    isRight: true
  }

  handleChangeSidebarType(e, sidebarType) {
    if (e) e.preventDefault()
    this.setState({
      sidebarType
    })
  }

  handleSelectStation(stationSelected) {
    const defaultZoom = 12
    let updateState = { stationSelected }
    if (this.state.map && this.state.map.getZoom() !== defaultZoom)
      updateState.zoom = defaultZoom
    updateState.timeUpdate = new Date()
    this.setState(updateState, () => {
      if (this.state.map) {
        const panToMap = {
          lat: parseFloat(stationSelected.mapLocation.lat),
          lng: parseFloat(stationSelected.mapLocation.lng)
        }
        // console.log(panToMap)
        this.state.map.panTo(panToMap)
      }
      //this.mapView.closeInfoMarker()
      this.mapView.openInfoMarkerByKey(stationSelected.key)
    })
  }

  componentDidMount() {
    if (this.props.formData.stationAuto) {
      setTimeout(() => {
        this.handleSelectStation(this.props.formData.stationAuto)
      }, 1000)
    }
  }

  async componentWillMount() {
    let resStationsAuto = await StationAutoApi.getLastLog()
    if (resStationsAuto.success) {
      let stationAutoList = resStationsAuto.data
      stationAutoList = stationAutoList.map(item => {
        item.visible = true
        return item
      })
      stationAutoList = await resolveMapLocation(stationAutoList)

      //Qui: Phân tích trạng thái của trạng trước khi view
      const dataAnalytic = stationAutoList.map(item => {
        const statusAnalytic = getStatusItem(item)
        return {
          ...item,
          statusAnalytic
        }
      })

      this.setState({
        stationsAuto: dataAnalytic
      })
    }
  }

  handelOnLickHideLeftLayout({ isLeft, isRight }) {
    this.setState({
      isLeft: isLeft
    })
  }

  handelOnLickHideRightLayout({ isLeft, isRight }) {
    this.setState({
      isRight: isRight
    })
  }

  handleClickNotification(nf) {
    const stationAuto = this.state.stationsAuto.find(
      s => s.key === nf.stationKey
    )
    if (stationAuto) {
      this.handleSelectStation(stationAuto)
    }
  }

  fillStatusChange(focusStatus, findBy) {
    let res = this.state.stationsAuto

    res = res.map(element => {
      element.visible = false
      let status

      if (element.statusAnalytic === stationStatus.GOOD) {
        status = stationStatus.CONNECTED
      }

      if (findBy === 'byStationStatus') {
        element.byStationStatus = true
        if (element.status === stationStatus.DATA_LOSS) {
          status = stationStatus.DATA_LOSS
        }
        if (element.status === stationStatus.NOT_USE) {
          status = stationStatus.NOT_USE
        }
      }

      if (findBy === 'byDataStatus') {
        status = element.statusAnalytic
      }

      if (focusStatus.includes(status)) element.visible = true
      return element
    })

    this.setState({
      stationsAuto: res
    })
  }

  renderSidebar() {
    switch (this.state.sidebarType) {
      /* MARK  LAUNCHING REMOVE CAI CHUONG */
      // case searchSidebarType.NOTIFICATIONS:
      //   return (
      //     <SidebarNotifications
      //       onClickNotificationItem={this.handleClickNotification}
      //     />
      //   )
      default:
        return (
          <SidebarNormal
            analytic={{
              stationsAutoList: this.state.stationsAuto,
              fillStatusChange: this.fillStatusChange
            }}
            searchStation={{
              onSelectStation: this.handleSelectStation,
              stationSelected: this.state.stationSelected,
              stationsAuto: this.state.stationsAuto
            }}
          />
        )
    }
  }

  render() {
    return (
      <MapDefaultWrapper height={this.props.windowHeight}>
        <Clearfix />
        <BoxHideLayout handelOnLick={this.handelOnLickHideLeftLayout} />
        <MapCenter>
          <MapView
            ref={mapView => {
              this.mapView = mapView
            }}
            windowHeight={this.props.windowHeight}
            center={this.state.center}
            getMap={map => this.setState({ map })}
            zoom={this.state.zoom}
            stationsAutoList={this.state.stationsAuto}
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
