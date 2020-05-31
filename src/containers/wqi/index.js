import React from 'react'
import styled from 'styled-components'

import InfoComponent from 'components/wqi/info'
import MapComponent from 'components/wqi/map'
import * as _ from 'lodash'
import wqiApi from 'api/WqiApi'
import protectRole from 'hoc/protect-role'
import { getConfigApi } from 'config'
import PageInfo from 'components/pageInfo'
import ROLE from 'constants/role'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`
@protectRole(ROLE.WQI.VIEW)
export default class WqiContainer extends React.Component {
  state = {
    station: null,
    wqiList: [],
  }

  async componentDidMount() {
    const rsWqi = await wqiApi.fetchWqi()
    const wqiList = _.get(rsWqi, 'data', [])

    this.setState({ wqiList })

    // const station = _.head(wqiList)
    const station = wqiList[1]

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
            <MapComponent
              wqiList={this.state.wqiList}
              style={{ flex: 2, background: 'blue' }}
              onMapClick={this.handleMarkerClick}
            />
            <InfoComponent
              station={this.state.station}
              style={{ flex: 1 }}
              wqiList={this.state.wqiList}
            />
          </WrapperContainer>
        )}
        {!getConfigApi().isAdvanced && <PageInfo />}
      </div>
    )
  }
}
