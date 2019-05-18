import React from 'react'
import styled from 'styled-components'

import InfoComponent from '../../components/aqi/info'
import MapComponent from '../../components/aqi/map'
import * as _ from 'lodash'
import protectRole from 'hoc/protect-role/index.backup'
import ROLE from 'constants/role'
import { fetchAqiByHour } from '../../api/AqiApi'
import { getConfigApi } from 'config'
import PageInfo from 'components/pageInfo'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

@protectRole(ROLE.AQI.VIEW)
export default class AqiContainer extends React.Component {
  state = {
    aqiList: [],
    station: null
  }

  async componentDidMount() {
    const rs = await fetchAqiByHour()
    const aqiList = _.get(rs, 'data', [])

    this.setState({ aqiList })

    const station = _.head(aqiList)

    if (!_.isEmpty(station)) {
      this.setState({ station })
    }
  }

  handleMarkerClick = station => {
    this.setState({ station })
  }

  render() {
    return (
      <div>
        {getConfigApi().isAdvanced && (
          <WrapperContainer>
            <MapComponent aqiList={this.state.aqiList} style={{ flex: 2, background: 'blue' }} onMapClick={this.handleMarkerClick} />
            <InfoComponent station={this.state.station} style={{ flex: 1 }} aqiList={this.state.aqiList} />
          </WrapperContainer>
        )}
        {!getConfigApi().isAdvanced && <PageInfo />}
      </div>
    )
  }
}
