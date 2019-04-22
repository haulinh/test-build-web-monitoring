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
    stationID: '',
  }

  state = {
    isLoading: false,
    isConfig: false,
    stationData: null
  }

  async componentWillMount(){
    this.setState({isLoading: true})
    const res = await StationAPI.getStatus(this.props.stationID)
    console.log('res.datares.data',this.props.stationID)
    this.setState({
      isConfig: res.data.configSampling ? true : false,
      isLoading: false,
      configSampling: res.data.configSampling ? res.data.configSampling: undefined
    })
  }

  render(){
    const {stationID} = this.props
    const {isLoading, isConfig, configSampling} = this.state
    return (
      <div>
        { isLoading ? (<LoadingCmp />) : (
          <Tabs defaultActiveKey={isConfig ? "sampling" : "config"}>
            <TabPane 
              key="sampling"
              tab={translate('monitoring.moreContent.sampling.tabs.sampling')}
              disabled={!isConfig}>
              <Sampling stationID={stationID}/>
            </TabPane>
            <TabPane 
              key="history"
              disabled={!isConfig}
              tab={translate('monitoring.moreContent.sampling.tabs.history')}>
              <History stationID={stationID}/>
            </TabPane>
            <TabPane 
              key="config"
              tab={translate('monitoring.moreContent.sampling.tabs.config')}>
              <Config stationID={stationID} configSampling={configSampling}/>
            </TabPane>
          </Tabs>
        )}
      </div>
    )
  }
}

