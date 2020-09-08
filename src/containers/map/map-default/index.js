import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import StationAutoApi from 'api/StationAuto'
import MapView from './map-view'
import { resolveMapLocation } from 'utils/resolveMapLocation'
import BoxHideLayout from 'components/map/box-hide-layout'
import { STATUS_STATION } from 'constants/stationStatus'
import { connectAutoDispatch } from 'redux/connect'
import { getStationAuto } from 'redux/actions/map'
import { removeAccents } from 'hoc/create-lang'
import searchSidebarType from 'constants/searchSidebarType'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import connectWindowHeight from '../hoc-window-height'
import SidebarNormal from './sidebar/SidebarNormal'
import { getStatusItem } from 'constants/stationStatus'
import { pick as _pick, set as _set, get as _get } from 'lodash'

// import SidebarNotifications from './sidebar/SidebarNotifications.remove'
// import { TYPE } from './components/box-analytic-list/SelectType'

const MapDefaultWrapper = styled.div`
  display: flex;
  height: ${props => props.height}px;
  padding-top: 8px;
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

  handleSelectStation(stationSelected) {
    // const defaultZoom = 12
    // let updateState = { stationSelected }
    // updateState.center = stationSelected.mapLocation
    // if (this.state.map && this.state.map.getZoom() !== defaultZoom)
    //   updateState.zoom = defaultZoom
    // this.setState(updateState, () => {
    //   this.props.getStationAuto(_pick(stationSelected, ['_id', 'key', 'name']))
    // })

    this.setState(
      {
        center: stationSelected.mapLocation,
        stationSelected,
        zoom: 12,
      },
      () => {
        this.props.getStationAuto(
          _pick(stationSelected, ['_id', 'key', 'name'])
        )
      }
    )
  }

  componentDidMount() {
    if (this.props.formData.stationAuto) {
      setTimeout(() => {
        this.handleSelectStation(this.props.formData.stationAuto)
      }, 1000)
    }
  }

  async componentWillMount() {
    const { lang } = this.props
    let resStationsAuto = await StationAutoApi.getLastLog()
    if (resStationsAuto.success) {
      let stationAutoList = resStationsAuto.data

      stationAutoList = stationAutoList.map(item => {
        _set(item, 'name', removeAccents(lang, _get(item, 'name', '')))
        _set(
          item,
          'stationType.name',
          removeAccents(lang, _get(item, 'stationType.name', ''))
        )
        item.visible = true
        return item
      })
      stationAutoList = await resolveMapLocation(stationAutoList)

      //Qui: Phân tích trạng thái của trạng trước khi view
      const dataAnalytic = stationAutoList.map(item => {
        const statusAnalytic = getStatusItem(item)
        return {
          ...item,
          statusAnalytic,
        }
      })

      this.setState({
        stationsAuto: dataAnalytic,
      })
    }
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
              fillStatusChange: this.fillStatusChange,
            }}
            searchStation={{
              onSelectStation: this.handleSelectStation,
              stationSelected: this.state.stationSelected,
              stationsAuto: this.state.stationsAuto,
            }}
          />
        )
    }
  }

  render() {
    // console.log('this.state.zoom', this.state.zoom)
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
            lang={this.props.lang}
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
