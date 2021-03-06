/* libs import */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col, Tabs } from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

/* user import */
import MoreSampling from './sampling/'
import MoreCamera from './camera'
import MoreChart from './chart/index'
import MoreMap from './map'
import MoreStation from './station'
import MoreRating from './rating'

const MoreContentWrapper = styled.div`
  border: ${props => (props.panel === '' ? 'none' : ' solid 1px #80808030')};
  max-width: ${props => (props.isOpen ? '78vw' : '92vw')};
  min-width: 300px;
`

const tabsStyle = panel => ({
  minHeight: 300,
  borderRadius: 4,
})

@connect(state => ({
  isOpen: state.theme.navigation.isOpen,
}))
@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    panel: PropTypes.string,
    stationID: PropTypes.string,
    stationInfo: PropTypes.object,
    cameraList: PropTypes.array,
  }

  static defaultProps = {
    isActive: false,
    panel: '',
    stationID: '',
  }

  state = {}

  render() {
    if (!this.props.isActive) return null
    // console.log("------ stationInfo ------", this.props.stationInfo)
    const { panel, stationID, stationInfo, cameraList } = this.props
    return (
      <MoreContentWrapper panel={panel} isOpen={this.props.isOpen}>
        {panel !== '' && (
          <Row style={{ height: `100%` }}>
            <Col span={24}>
              <Tabs
                activeKey={panel}
                style={tabsStyle(panel)}
                renderTabBar={() => <div />}
              >
                <Tabs.TabPane tab="sampling" key="sampling">
                  <MoreSampling
                    stationID={stationID}
                    measuringList={stationInfo.measuringList}
                    configExceeded={stationInfo.configExceeded}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="camera" key="camera">
                  <MoreCamera station={stationInfo} cameraList={cameraList} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="chart" key="chart">
                  <MoreChart stationID={stationID} isOpen={this.props.isOpen} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="map" key="map">
                  <MoreMap stationID={stationID} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="station" key="station">
                  <MoreStation stationID={stationID} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="rating" key="rating">
                  <MoreRating stationID={stationID} />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        )}
      </MoreContentWrapper>
    )
  }
}
