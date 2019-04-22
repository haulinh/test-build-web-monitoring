/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import {Row, Col, Tabs, Icon} from 'antd';
/* user import */
import StationAPI from 'api/SamplingApi'
import { translate } from 'hoc/create-lang'
import Sampling from './tabpanes/sampling'
import History from './tabpanes/history'
import Config from './tabpanes/config'
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px
`

const LoadingCmp = ()=> <LoadingContainer>
  <Icon type="loading" theme="outlined" style={{color: "#4090ff", fontSize: 25}} />
</LoadingContainer>

const TabPane = Tabs.TabPane;

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string
  }

  static defaultProps = {
    stationID: null,
  }

  state = {
    isLoading: false,
    isConfig: false,
    stationData: {}
  }

  async componentWillMount(){
    this.setState({isLoading: true})
    console.log(StationAPI)
    const res = await StationAPI.getStatus(this.props.stationID)
    this.setState({
      isConfig: res.data.configSampling ? true : false,
      isLoading: false,
      stationData: res.data
    })
  }

  render(){
    const {isLoading, isConfig, stationData} = this.state
    return (
      <div>
        { isLoading ? (<LoadingCmp />) : (
          <Tabs defaultActiveKey={isConfig ? "sampling" : "config"}>
            <TabPane 
              key="sampling"
              tab={translate('monitoring.moreContent.sampling.tabs.sampling')}
              disabled={!isConfig}>
              <Sampling />
            </TabPane>
            <TabPane 
              key="history"
              disabled={!isConfig}
              tab={translate('monitoring.moreContent.sampling.tabs.history')}>
              <History />
            </TabPane>
            <TabPane 
              key="config"
              tab={translate('monitoring.moreContent.sampling.tabs.config')}>
              <Config stationData={stationData.configSampling}/>
            </TabPane>
          </Tabs>
        )}
      </div>
    )
  }
}

