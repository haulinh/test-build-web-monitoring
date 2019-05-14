import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Sticky, StickyContainer } from 'react-sticky'
import { Collapse } from 'reactstrap'
import StationAutoList from './station-auto-list'
import HeadStationType from './HeadStationType'
import { Icon } from 'antd'
import { filter } from 'lodash'

const StationTypeWrapper = styled.div``

const IconToggle = styled.span`
  transition: all 0.3s linear;
  transform: rotate(-0deg);
  display: inline-block;
  margin-right: 4px;
  font-size: 10px;
  position: relative;
  top: -2px;
  ${props => (props.isOpen ? `transform: rotate(90deg);` : ``)};
`

const TextSpan = styled.span`
  &:hover {
    cursor: pointer;
  }
`

@autobind
export default class StationTypeSummary extends React.Component {
  static propTypes = {
    stationType: PropTypes.object,
    stationAutoList: PropTypes.array
  }

  state = {
    isOpen: true
  }

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { stationType, stationAutoList } = this.props
    const goodTotal = filter(
      stationAutoList || [],
      ({ status }) => status === 'GOOD'
    ).length
    if (stationAutoList.length === 0) return null
    return (
      <StickyContainer>
        <StationTypeWrapper>
          <Sticky>
            {props => (
              <div
                style={{
                  ...props.style,
                  top: props.isSticky ? '68.8px' : null,
                  transition: 'all .3s linear',
                  zIndex: 99999
                }}
              >
                <HeadStationType>
                  <TextSpan onClick={this.toggleOpen}>
                    {stationType.name} ({goodTotal}/{stationAutoList.length})
                    <IconToggle
                      isOpen={this.state.isOpen}
                      style={{ marginLeft: 10 }}
                    >
                      <Icon type="caret-right" />
                    </IconToggle>
                  </TextSpan>
                </HeadStationType>
              </div>
            )}
          </Sticky>
          <Collapse isOpen={this.state.isOpen}>
            <StationAutoList
              isShowStationName={stationType.name === 'All'}
              stationAutoList={stationAutoList}
            />
          </Collapse>
        </StationTypeWrapper>
      </StickyContainer>
    )
  }
}
