import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
import { Input } from 'antd'
import BoxLayout from 'components/map/box-white-layout'
import StationGroupList from 'components/map/station-group-list'
import Clearfix from 'components/elements/clearfix'
import _ from 'lodash'
import styled from 'styled-components'
import SelectStationType from './SelectStationType'
import { translate } from 'hoc/create-lang'

const WrapperList = styled.div`
  overflow: scroll;
  flex: 1;
`

@withRouter
@autobind
export default class SidebarList extends React.PureComponent {
  static propTypes = {
    stationsAuto: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    stationSelected: PropTypes.object,
    onSelectStation: PropTypes.func,
  }

  state = {
    stationType: '',
    filterText: '',
  }

  handleChangeStationType(stationType) {
    this.setState({ stationType })
  }

  handleChangeSearch(e) {
    this.setState({ filterText: e.target.value })
  }

  getStationGroups() {
    const { filterText, stationType } = this.state
    const { stationsAuto } = this.props
    let data = stationsAuto
    if (stationType)
      data = data.filter(item => item.stationType._id === stationType)
    data = data.filter(
      item =>
        (item.name + item.stationType.name)
          .toLowerCase()
          .indexOf((filterText || '').toLowerCase()) > -1
    )
    const groupStationAutoObject = _.groupBy(data, 'stationType.name')
    return Object.keys(groupStationAutoObject).map(stationType => {
      return {
        stationType: stationType,
        stations: groupStationAutoObject[stationType],
      }
    })
  }

  render() {
    return (
      <BoxLayout
        style={{ flex: 1 }}
        onlyTitle
        noPadding
        noTitlePadding
        title={
          <SelectStationType
            onChange={this.handleChangeStationType}
            value={this.state.stationType}
          />
        }
        containerStyle={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 8px',
        }}
      >
        <Input.Search
          placeholder={translate('map.menuLeft.stationSearch')}
          onChange={this.handleChangeSearch}
          style={{ width: '100%' }}
          value={this.state.filterText}
        />
        <Clearfix height={8} />
        <WrapperList>
          <StationGroupList
            stationSelected={this.props.stationSelected}
            stationGroups={this.getStationGroups()}
            onSelectStation={this.props.onSelectStation}
          />
        </WrapperList>
      </BoxLayout>
    )
  }
}
