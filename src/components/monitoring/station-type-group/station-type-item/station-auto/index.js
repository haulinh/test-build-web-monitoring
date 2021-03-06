import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import moment from 'moment-timezone'
import StationAutoHead from './Head'
import MeasuringList from './measuring/measuring-list'
import MoreContent from './more-content'
import slug from 'constants/slug'
import { STATUS_STATION } from 'constants/stationStatus'
import { translate } from 'hoc/create-lang'
import _, { get, map as _map, isEqual } from 'lodash'
import queryFormDataBrowser from 'hoc/query-formdata-browser'

import CameraListView from './camera-list'
import MeasuringAdvancedList from './measuring/measuring-adnvanced'

const StationAutoWrapper = styled.div`
  background-color: #fff;
  padding: 8px 16px;
  box-shadow: 0 4px 10px 0 rgba(241, 241, 241, 0.5);
`

@withRouter
@queryFormDataBrowser(['submit'])
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
      name: PropTypes.string,
    }),
  }

  state = {
    isOpenCamera: false,
    showPanel: '',
  }

  handleShowPanel(panelName, keyOpenTab) {
    // console.log(panelName, keyOpenTab, "anelName, keyOpenTab")
    if (keyOpenTab) {
      const arrMeasures = _map(this.props.measuringList, item => {
        return item.key
      })
      let formSearch = null
      let slugPrefix = ''
      // console.log(arrMeasures)
      let toDate = this.props.lastLog.receivedAt
      let fromDate = moment(toDate)
        .subtract(1, 'day')
        .format()
      switch (keyOpenTab) {
        case 'historyData': {
          formSearch = {
            stationType: this.props.stationType.key,
            stationAuto: this.props.stationID,
            stationAutoName: this.props.name,
            measuringList: arrMeasures,
            measuringData: this.props.measuringList,
            fromDate,
            toDate,
            searchRange: true,
            searchNow: true,
          }
          slugPrefix = slug.dataSearch.base
          break
        }
        case 'avgData': {
          // console.log(arrMeasures)
          formSearch = {
            stationType: this.props.stationType.key,
            stationAuto: this.props.stationID,
            measuringList: arrMeasures,
            measuringData: this.props.measuringList,
            fromDate,
            toDate,
            rangesDate: 'ranges',
            searchNow: true,
          }
          slugPrefix = slug.avgSearchAdvanced.base
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

        window.open(url, '_blank')
      }
    } else {
      if (this.state.showPanel === panelName)
        return this.setState({ showPanel: '' })
      else return this.setState({ showPanel: panelName })
    }
  }

  /* search data trong v??ng 24h t??? l??c nh???n lastlog */
  handleClickDataSearchWithMeasuring(measuringItem) {
    let toDate = measuringItem.receivedAt
    let fromDate = moment(toDate)
      .subtract(1, 'day')
      .format()

    const formSearch = {
      stationType: this.props.stationType.key,
      stationAuto: this.props.stationID,
      measuringList: [measuringItem.key],
      measuringData: this.props.measuringList,
      fromDate,
      toDate,
      searchRange: true,
      searchNow: true,
    }

    this.props.history.push(
      slug.dataSearch.base +
        '?formData=' +
        encodeURIComponent(JSON.stringify(formSearch))
    )
  }

  measuringLastLog() {
    let { measuringList, lastLog } = this.props
    if (!lastLog) return
    let measuringLogs = lastLog.measuringLogs
    if (!measuringLogs) measuringLogs = {}
    measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })

    const measuringListMappingLogs = measuringList.map(measure => ({
      ...measure,
      ...measuringLogs[measure.key],
    }))

    return measuringListMappingLogs
  }

  componentDidMount = () => {
    // console.log(this.props.formData.stationAuto,this.props.stationID, "componentDidMount")
    if (this.props.stationID === get(this.props, 'formData.stationAuto', '')) {
      // console.log(this.props.formData, "componentDidMount run 2")
      this.setState({
        showPanel: 'chart',
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(
        get(nextProps, 'formData.stationAuto', ''),
        get(this.props, 'formData.stationAuto', '')
      )
    ) {
      if (nextProps.stationID === get(nextProps, 'formData.stationAuto', '')) {
        // console.log(this.props.formData, "componentDidMount run 2")
        this.setState({
          showPanel: 'chart',
        })
      }
    }
  }

  getLastLogMeasureListAdvanced = () => {
    const { lastLogMeasureAdvanced } = this.props
    if (!lastLogMeasureAdvanced) return

    const measuringAdvancedLogs = _.get(lastLogMeasureAdvanced, [
      'measuringLogs',
    ])

    const lastLogMeasureAdvancedArr = Object.values(measuringAdvancedLogs)
    return lastLogMeasureAdvancedArr
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
      measuringList,
      _id,
    } = this.props
    let receivedAt = ''
    if (lastLog && lastLog.receivedAt) {
      receivedAt = lastLog.receivedAt
      // receivedAt = moment(lastLog.receivedAt)
      //   .format('YYYY-MM-DD HH:MM')
      //   .toString()
      if (status === STATUS_STATION.DATA_LOSS) {
        receivedAt = `${translate('monitoring.dataLoss')}  ${receivedAt}`
      }
    } else {
      receivedAt = translate('monitoring.notUse')
    }

    const lastLogMeasureAdvancedList = this.getLastLogMeasureListAdvanced()
    const measuringMap = new Map(measuringList.map(item => [item.key, item]))

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
          stationKey={stationID}
        />
        <MeasuringList
          measuringMap={measuringMap}
          statusStation={status}
          onClickItem={this.handleClickDataSearchWithMeasuring}
          data={this.measuringLastLog()}
          receivedAt={receivedAt}
        />

        <MeasuringAdvancedList
          receivedAt={receivedAt}
          statusStation={status}
          lastLogMeasureAdvancedList={lastLogMeasureAdvancedList}
        />

        <MoreContent
          isActive={true}
          stationID={_id}
          panel={this.state.showPanel}
          stationInfo={this.props}
          cameraList={get(options, 'camera.list', [])}
        />

        {this.state.isOpenCamera && get(options, 'camera.allowed') && (
          <CameraListView
            station={this.props}
            cameraList={get(options, 'camera.list', [])}
          />
        )}
      </StationAutoWrapper>
    )
  }
}
