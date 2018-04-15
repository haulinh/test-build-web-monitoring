import React from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import StationAuto from '../station-auto'

const StationListWrapper = styled.div`
  .stationAutoItem:last-child .stationAutoWrapper {
    padding-bottom: 16px;
  }
`

@autobind
export default class StationAutoList extends React.PureComponent {
  static propTypes = {
    stationAutoList: PropTypes.arrayOf(PropTypes.shape(StationAuto.props))
  }
  render() {
    return (
      <StationListWrapper>
        {this.props.stationAutoList
          .filter(item => item.measuringList.length > 0)
          .map((item, index) => {
            const { key, ...otherProps } = item
            return (
              <div className="stationAutoItem" key={key}>
                <StationAuto
                  {...otherProps}
                  stationID={key}
                  orderNumber={index + 1}
                />
              </div>
            )
          })}
      </StationListWrapper>
    )
  }
}
