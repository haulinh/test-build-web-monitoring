import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Input } from 'antd'
import BoxLayout from 'components/map/box-white-layout'
import StationGroupList from 'components/map/station-group-list'
import Clearfix from 'components/elements/clearfix'
import _ from 'lodash'
import SelectStationType from './SelectStationType'

@autobind
export default class SidebarList extends React.PureComponent {
  static propTypes = {
    stationsAuto: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    ),
    stationSelected: PropTypes.object,
    onSelectStation: PropTypes.func
  }

  state = {
    stationType: '',
    filterText: ''
  }

  handleChangeStationType(stationType) {
    this.setState({ stationType })
  }

  handleChangeSearch(e) {
    this.setState({ filterText: e.target.value })
  }

  getStationGroups() {
    let stationsAuto = this.props.stationsAuto
    if (this.state.filterText !== '') {
      stationsAuto = stationsAuto.filter(
        sAuto =>
          sAuto.name
            .toLowerCase()
            .indexOf(this.state.filterText.toLowerCase()) > -1
      )
    }
    if (this.state.stationType) {
      stationsAuto = stationsAuto.filter(
        sAuto => sAuto.stationType.key === this.state.stationType
      )
    }
    const groupStationAutoObject = _.groupBy(stationsAuto, 'stationType.name')
    return Object.keys(groupStationAutoObject).map(stationType => {
      return {
        stationType: stationType,
        stations: groupStationAutoObject[stationType]
      }
    })
  }

  render() {
    /**
     * <SelectStationType
     onChange={this.handleChangeStationType}
     value={this.state.stationType}
     />
     */
    return (
      <BoxLayout
        style={{ flex: 1 }}
        title="Search"
        right={
          <SelectStationType
            onChange={this.handleChangeStationType}
            value={this.state.stationType}
          />
        }
      >
        <Input.Search
          placeholder="Search station"
          onChange={this.handleChangeSearch}
          style={{ width: '100%' }}
          value={this.state.filterText}
        />
        <Clearfix height={16} />
        <StationGroupList
          stationSelected={this.props.stationSelected}
          stationGroups={this.getStationGroups()}
          onSelectStation={this.props.onSelectStation}
        />
      </BoxLayout>
    )
  }
}