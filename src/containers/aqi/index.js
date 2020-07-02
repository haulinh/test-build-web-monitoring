import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { Skeleton } from 'antd'
import InfoComponent from '../../components/aqi/info'
import MapComponent from '../../components/aqi/map'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import aqiApi from 'api/AqiApi'
import stationConfigApi from 'api/StationConfigApi'
import { getListConfigAqi } from 'api/CategoryApi'
import PageAqiStatus from 'containers/aqi/aqi-list-status'

// import AqiListStatus from 'components/aqi/info/aqi-list-status.js'

// import moment from 'moment'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`
@protectRole(ROLE.AQI.VIEW)
export default class AqiContainer extends React.Component {
  state = {
    aqiList: [],
    aqiLevel: [],
    station: null,
    locale: 'vn',
    listConfigAQI: [],

    isNotConfig: false,
    isInitial: false,
  }

  async componentDidMount() {
    try {
      getListConfigAqi()
        .then(async retult => {
          let data = _.get(retult, 'data.value', [])
          // console.log(data, '--data')
          data = _.filter(data, item => {
            return item.activated
          })
          this.setState(
            {
              listConfigAQI: data,
            },
            () => {
              if (this.state.listConfigAQI.length === 0) {
                this.setState({
                  isNotConfig: true,
                })
              }
            }
          )
        })
        .catch(ex => {
          this.setState({
            listConfigAQI: [],
            isNotConfig: false,
          })
          console.log(ex, '--ex--')
        })
        .finally(() => {})

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
        isInitial: true,
      })

      const station = _.head(aqiList)

      if (!_.isEmpty(station)) {
        this.setState({ station })
      }
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

  //  Kiem tra cau hinh AQI truoc sau do moi kiem tra isInitial
  render() {
    return (
      <WrapperContainer style={{ padding: '8px' }}>
        {this.state.isNotConfig && <PageAqiStatus />}
        {!this.state.isNotConfig && (
          <React.Fragment>
            <MapComponent
              // zoom={8}
              locale={this.state.locale}
              center={this.state.center}
              aqiList={this.state.aqiList}
              aqiLevel={this.state.aqiLevel}
              style={{ flex: 2, background: 'blue' }}
              onMarkerClick={this.handleMarkerClick}
              onClose={this.handleOnClosePopup}
              stationKey={this.state.stationKey}
            />
            {!this.state.isInitial && (
              <Skeleton loading={true} paragraph={{ rows: 8 }} />
            )}
            {this.state.isInitial && (
              <InfoComponent
                onChangeLocale={this.hanldleOnChangeLocale}
                locale={this.state.locale}
                aqiLevel={this.state.aqiLevel}
                style={{ flex: 1 }}
                aqiList={this.state.aqiList}
                onSelect={this.handleOnSelect}
                listConfigAQI={this.state.listConfigAQI}
              />
            )}
          </React.Fragment>
        )}
      </WrapperContainer>
    )
  }
}
