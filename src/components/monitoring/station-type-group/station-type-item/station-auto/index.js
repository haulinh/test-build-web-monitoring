import React from "react"
import { autobind } from "core-decorators"
import styled from "styled-components"
import { withRouter } from "react-router"
import StationAutoHead from "./Head"
import MeasuringList from "./measuring/measuring-list"
import MoreContent from "./more-content"
import PropTypes from "prop-types"
import slug from "constants/slug"
import { STATUS_STATION } from "constants/stationStatus"
import { translate } from "hoc/create-lang"
import { get, map as _map } from "lodash"
import queryFormDataBrowser from "hoc/query-formdata-browser"

import CameraListView from "./camera-list"

const StationAutoWrapper = styled.div`
  background-color: #fff;
  padding: 8px 16px;
  box-shadow: 0 4px 10px 0 rgba(241, 241, 241, 0.5);
`

@withRouter
@queryFormDataBrowser(["submit"])
@autobind
export default class StationAutoItem extends React.PureComponent {
  static propTypes = {
    orderNumber: PropTypes.number,
    isShowStationName: PropTypes.bool,
    key: PropTypes.string,
    name: PropTypes.string,
    measuringList: PropTypes.array,
    lastLog: PropTypes.object,
    stationID: PropTypes.string,
    options: PropTypes.object,
    stationType: PropTypes.shape({
      name: PropTypes.string
    })
  }

  state = {
    isOpenCamera: false,
    showPanel: ''
  }

  handleShowPanel(panelName, keyOpenTab) {
    // console.log(panelName, keyOpenTab, "anelName, keyOpenTab")
    if (keyOpenTab) {
      const arrMeasures = _map(this.props.measuringList, item => {
        return item.key
      })
      let formSearch = null
      let slugPrefix = ''
      switch (keyOpenTab) {
        case "historyData": {
          // console.log(arrMeasures)
          formSearch = {
            stationType: this.props.stationType.key,
            stationAuto: this.props.stationID,
            measuringList: arrMeasures,
            measuringData: this.props.measuringList,
            searchNow: true
          }
          slugPrefix = slug.dataSearch.base
          break
        }
        case "avgData": {
          // console.log(arrMeasures)
          formSearch = {
            stationType: this.props.stationType.key,
            stationAuto: this.props.stationID,
            measuringList: arrMeasures,
            measuringData: this.props.measuringList,
            searchNow: true
          }
          slugPrefix = slug.avgSearch.base
          break
        }
        default: {
          break
        }
      }

      if (formSearch) {
        const url = `${slugPrefix}?formData=${encodeURIComponent(
          JSON.stringify(formSearch)
        )}`

        window.open(url, "_blank")
      }
    } else {
      if (this.state.showPanel === panelName)
        return this.setState({ showPanel: "" })
      else return this.setState({ showPanel: panelName })
    }
  }

  handleClickDataSearchWithMeasuring(measuringItem) {
    const formSearch = {
      stationType: this.props.stationType.key,
      stationAuto: this.props.stationID,
      measuringList: [measuringItem.key],
      measuringData: this.props.measuringList,
      searchNow: true
    }
    this.props.history.push(
      slug.dataSearch.base +
        "?formData=" +
        encodeURIComponent(JSON.stringify(formSearch))
    )
  }

  // /* #region  MARK Không sử dụng nữa */

  // handleClickViewMap() {
  //   const formSearch = {
  //     stationAuto: {
  //       ...this.props,
  //       mapLocation: {
  //         lat: this.props.mapLocation.lat,
  //         lng: this.props.mapLocation.long
  //       },
  //       key: this.props.stationID
  //     }
  //   }
  //   this.props.history.push(
  //     slug.map.base +
  //       "?formData=" +
  //       encodeURIComponent(JSON.stringify(formSearch))
  //   )
  // }

  // onClickViewCamera = () => {
  //   this.setState({ isOpenCamera: !this.state.isOpenCamera })
  // }

  // handleClickDataSearch() {
  //   const formSearch = {
  //     stationType: this.props.stationType.key,
  //     stationAuto: this.props.stationID,
  //     measuringList: this.props.measuringList.map(m => m.key),
  //     measuringData: this.props.measuringList,
  //     searchNow: true
  //   }
  //   this.props.history.push(
  //     slug.dataSearch.base +
  //       "?formData=" +
  //       encodeURIComponent(JSON.stringify(formSearch))
  //   )
  // }

  // /* #endregion */

  measuringLastLog() {
    let { measuringList, lastLog } = this.props
    if (!lastLog) return
    let measuringLogs = lastLog.measuringLogs
    if (!measuringLogs) return
    measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })
    measuringList.forEach(item => {
      if (measuringLogs[item.key]) {
        item.value = measuringLogs[item.key].value
        item.warningLevel = measuringLogs[item.key].warningLevel
        item.maxLimit = measuringLogs[item.key].maxLimit
        item.minLimit = measuringLogs[item.key].minLimit
        item.minTend = measuringLogs[item.key].minTend
        item.maxTend = measuringLogs[item.key].maxTend
        item.statusDevice = measuringLogs[item.key].statusDevice
      }
    })
    return measuringList
  }

  componentDidMount = () =>{
    // console.log(this.props.formData.stationAuto,this.props.stationID, "componentDidMount")
    if(this.props.stationID === get(this.props,'formData.stationAuto','')){
      // console.log(this.props.formData, "componentDidMount run 2")
      this.setState({
        showPanel:'chart'
      })
    }
    
  }

  render() {
    // console.log(this.props,"StationAutoWrapper")
    let {
      stationID,
      name,
      lastLog,
      orderNumber,
      isShowStationName,
      stationType,
      options,
      status,
      _id
    } = this.props
    let receivedAt = ""
    if (lastLog && lastLog.receivedAt) {
      receivedAt = lastLog.receivedAt
      // receivedAt = moment(lastLog.receivedAt)
      //   .format('YYYY-MM-DD HH:MM')
      //   .toString()
      if (status === STATUS_STATION.DATA_LOSS) {
        receivedAt = `${translate("monitoring.dataLoss")}  ${receivedAt}`
      }
    } else {
      receivedAt = translate("monitoring.notUse")
    }

    return (
      <StationAutoWrapper className="stationAutoWrapper">
        <StationAutoHead
          name={name}
          stationTypeName={isShowStationName ? stationType.name : null}
          receivedAt={receivedAt}
          orderNumber={orderNumber}
          stationID={stationID}
          options={options}
          status={status}
          currentActionDefault={this.state.showPanel}
          onClickActionButton={this.handleShowPanel}
          // onClickDataSearch={this.handleClickDataSearch}
          // onClickViewMap={this.handleClickViewMap}
          // onClickViewCamera={this.onClickViewCamera}
          _id={_id}
        />
        <MeasuringList
          statusStation={status}
          onClickItem={this.handleClickDataSearchWithMeasuring}
          data={this.measuringLastLog()}
        />

        <MoreContent
          isActive={true}
          stationID={_id}
          panel={this.state.showPanel}
          stationInfo={this.props}
        />

        {this.state.isOpenCamera && get(options, "camera.allowed") && (
          <CameraListView cameraList={get(options, "camera.list", [])} />
        )}
      </StationAutoWrapper>
    )
  }
}
