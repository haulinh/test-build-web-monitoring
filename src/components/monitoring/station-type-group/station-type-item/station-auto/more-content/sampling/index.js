/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import {Tabs} from 'antd';
/* user import */
import { translate } from 'hoc/create-lang'
import Sampling from './tabpanes/sampling'
import History from './tabpanes/history'
import Config from './tabpanes/config'


const TabPane = Tabs.TabPane;

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {}

  render(){
    return (
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={translate('monitoring.moreContent.sampling.tabs.sampling')}
          key="1">
          <Sampling />
        </TabPane>
        <TabPane 
          tab={translate('monitoring.moreContent.sampling.tabs.history')}
          key="2">
          <History />
        </TabPane>
        <TabPane 
          tab={translate('monitoring.moreContent.sampling.tabs.config')}
          key="3">
          <Config />
        </TabPane>
      </Tabs>
    )
  }
}

