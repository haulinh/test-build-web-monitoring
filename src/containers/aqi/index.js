import React from 'react'
import styled from 'styled-components'

import InfoComponent from '../../components/aqi/info'
import MapComponent from '../../components/aqi/map'
import * as _ from 'lodash'

import aqiApi from 'api/AqiApi'
import stationConfigApi from 'api/StationConfigApi'
import { getListConfigAqi } from 'api/CategoryApi'
import slug from 'constants/slug'

// import AqiListStatus from 'components/aqi/info/aqi-list-status.js'

// import moment from 'moment'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

export default class AqiContainer extends React.Component {
  state = {
    aqiList: [],
    aqiLevel: [],
    station: null,
    locale: 'vn',
    listConfigAQI: [],
  }

  async componentDidMount() {
    try {
      getListConfigAqi()
        .then(async retult => {
          const data = _.get(retult, 'data.value', [])
          // console.log(data, '--data')
          this.setState(
            {
              listConfigAQI: _.filter(data, item => {
                return item.activated
              }),
            },
            () => {
              if (this.state.listConfigAQI.length === 0) {
                window.location = slug.aqi.status
              }
            }
          )

          const stationConfigs = await stationConfigApi.getStationsConfig(
            {},
            { config: 'AQI' }
          )
          const stationData = _.map(
            _.get(stationConfigs, 'data', []),
            itemStation => {
              return itemStation.key
            }
          )

          const listKey = _.join(stationData, ',')
          const params = {
            listKey: listKey,
            locale: this.state.locale,
          }
          let rs = await aqiApi.fetchAqiDayLastLogs({ ...params })

          // const rs = await fetchAqiByHour()
          let dataRes = _.get(rs, 'data', [])
          // console.log(dataRes,"dataRes")
          dataRes = _.map(dataRes, item => {
            const time = _.get(item, 'time', null)
            const valuesData = _.values(_.omit(item, 'time'))
            if (time) {
              return {
                time,
                ...valuesData[0],
              }
            } else {
              return null
            }
          })
          const aqiList = _.compact(dataRes)
          // console.log(aqiList, "aqiList")
          this.setState({
            aqiList,
            aqiLevel: _.get(rs, 'aqiLevel', []),
          })

          const station = _.head(aqiList)

          if (!_.isEmpty(station)) {
            this.setState({ station })
          }
        })
        .catch(ex => {
          this.setState({
            listConfigAQI: [],
          })
          console.log(ex, '--ex--')
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  handleMarkerClick = station => {
    this.setState({
      stationKey: _.get(station, 'key'),
    })
  }
  handleOnClosePopup = () => {
    this.setState({
      stationKey: null,
    })
  }

  handleOnSelect = ({ key, mapLocation }) => {
    // console.log("---onSlelect--", key, mapLocation);
    this.setState({
      center: mapLocation,
      stationKey: null,
    })
    setTimeout(() => {
      this.setState({
        stationKey: key,
      })
    }, 500)
  }

  hanldleOnChangeLocale = value => {
    // console.log('hanldleOnChangeLocale', value)
    this.setState(
      {
        locale: value,
      },
      () => {
        this.componentDidMount()
      }
    )
  }

  render() {
    return (
      <WrapperContainer>
        {this.state.listConfigAQI && this.state.listConfigAQI.length > 0 && (
          <React.Fragment>
            <MapComponent
              center={this.state.center}
              aqiList={this.state.aqiList}
              aqiLevel={this.state.aqiLevel}
              style={{ flex: 2, background: 'blue' }}
              onMarkerClick={this.handleMarkerClick}
              onClose={this.handleOnClosePopup}
              stationKey={this.state.stationKey}
            />
            <InfoComponent
              onChangeLocale={this.hanldleOnChangeLocale}
              locale={this.state.locale}
              aqiLevel={this.state.aqiLevel}
              style={{ flex: 1 }}
              aqiList={this.state.aqiList}
              onSelect={this.handleOnSelect}
              listConfigAQI={this.state.listConfigAQI}
            />
          </React.Fragment>
        )}
      </WrapperContainer>
    )
  }
}
