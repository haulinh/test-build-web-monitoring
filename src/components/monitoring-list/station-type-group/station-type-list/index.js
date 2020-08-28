import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import StationTypeItem from '../station-type-item'
import _ from 'lodash'
import { warningLevels } from 'constants/warningLevels'
import stationStatus from 'constants/stationStatus'
import playSound from 'utils/audio'

const StationTypeListWrapper = styled.div`
  zoom: 0.8;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
  .stationTypeItem {
    margin-bottom: 16px;
  }
`

const StationTypeContainer = styled.div`
  padding: 8px 8px;
  flex: 1;
  width: 100%;
`

@autobind
export default class StationTypeList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(StationTypeItem.propTypes)),
  }

  constructor(props) {
    super(props)
    this.audio = React.createRef()
  }

  sortStationType(a, b) {
    return a.stationType.numericalOrder - b.stationType.numericalOrder
  }

  getMonitoringList = () => {
    return this.props.data
      .sort(this.sortStationType)
      .filter(item => item.stationAutoList.length > 0)
  }

  getAlert = () => {
    const monitoringList = this.getMonitoringList()
    const monitoringListStatusGood = monitoringList.map(element =>
      element.stationAutoList.filter(
        monitoring => monitoring.status === stationStatus.GOOD
      )
    )
    const monitoringListStatusGoodFilter = monitoringListStatusGood.filter(
      monitoring => monitoring.length !== 0
    )
    return monitoringListStatusGoodFilter.some(stationAuto => {
      return stationAuto.some(stationAutoProperties => {
        return _.some(
          stationAutoProperties.lastLog.measuringLogs,
          measuringLog => {
            return measuringLog.warningLevel === warningLevels.EXCEEDED
          }
        )
      })
    })
  }

  componentDidMount() {
    if (this.getAlert()) {
      try {
        playSound('audio/alert.mp3')
      } catch (error) {
        console.log(error)
      }

      // if (this.audio.current && this.audio.current.play) {
      //   try {
      //     this.audio.current.play()
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
    }
  }

  componentDidUpdate(prevProps) {
    if ( 
      JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data) &&
      this.getAlert()
    ) {
      try {
        playSound('audio/alert.mp3')
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const monitoringList = this.getMonitoringList()
    return (
      <StationTypeListWrapper>
        {/* <audio ref={this.audio} controls src={'audio/alert.mp3'} /> */}
        <StationTypeContainer>
          {monitoringList.map((item, index) => {
            return (
              <div key={index} className="stationTypeItem">
                <StationTypeItem {...item} />
              </div>
            )
          })}
        </StationTypeContainer>
      </StationTypeListWrapper>
    )
  }
}
