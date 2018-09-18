import React from 'react'
import styled from 'styled-components'

import InfoComponent from '../../components/aqi/info'
import MapComponent from '../../components/aqi/map'
import * as _ from 'lodash'

import { fetchAqiByHour } from '../../api/AqiApi'

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 3;
`

export default class AqiContainer extends React.Component {
  state = {
    aqiList: [],
    selected: null
  }

  async componentDidMount() {
    const rs = await fetchAqiByHour()
    const aqiList = _.get(rs, 'data', [])

    this.setState({ aqiList })

    const selected = _.head(aqiList)

    if (!_.isEmpty(selected)) {
      this.setState({ selected })
    }
  }

  render() {
    return (
      <WrapperContainer>
        <MapComponent
          aqiList={this.state.aqiList}
          style={{ flex: 2, background: 'blue' }}
        />
        <InfoComponent style={{ flex: 1 }} aqiList={this.state.aqiList} />
      </WrapperContainer>
    )
  }
}
