/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import {Tabs} from 'antd'
import {withRouter} from 'react-router'

/* user import */
import { translate } from 'hoc/create-lang'
import MoreSampling from './sampling';
import MoreCamera from './camera';
import MoreChart from './chart';
import MoreMap from './map';
import MoreImage from './image';
import MoreStation from './station';
import MoreRating from './rating';


const MoreContentWrapper = styled.div`
  min-width: 300px;
`

const tabsStyle = (panel) => ({
  minHeight: panel === '' ? 0 : 300, 
  border: panel === '' ? 'none' : 'solid 1px #80808030', 
  borderRadius: 4,

})

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    panel: PropTypes.string
  }

  static defaultProps = {
    isActive: false,
    panel: ''
  }

  state = {}


  render(){
    if (!this.props.isActive) return null;
    const {panel} = this.props;
    return ((
      <Tabs 
        activeKey={panel} 
        style={tabsStyle(panel)} 
        renderTabBar={() => <div></div>}>
        <Tabs.TabPane tab="sampling" key="sampling">
          <MoreSampling/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="camera" key="camera">
          <MoreCamera/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="chart" key="chart">
          <MoreChart/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="map" key="map">
          <MoreMap/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="image" key="image">
          <MoreImage/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="station" key="station">
          <MoreStation/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="rating" key="rating">
          <MoreRating/>
        </Tabs.TabPane>
      </Tabs>
    ))
  }
}