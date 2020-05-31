/* libs import */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Row, Tabs, Icon, message, Spin } from 'antd'
import styled from 'styled-components'
/* user import */
import StationAPI from 'api/SamplingApi'
import { translate } from 'hoc/create-lang'
import Sampling from './tabpanes/sampling'
import History from './tabpanes/history'
import Config from './tabpanes/config'
import Disconnection from 'components/elements/disconnection'

const TIME_INTERVAL_GET_STATUS = 1000 * 60 // 1 PHUT
const STATUS_SAMPLING = {
  READY: 'READY',
  COMMANDED: 'COMMANDED',
  SAMPLING: 'SAMPLING',
}

const SamplingWrapper = styled.div`
  flex: 1;
`

// const LoadingContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: 250px;

//   .information{
//     display: flex;
//     align-items: center;
//   }
//   .information--text{
//     font-weight: bold;
//   }
// `

const i18n = {
  /* NOTE  chưa dịch */
  getStatusFail: 'Không thể lấy trạng thái, hãy thử lại',
  disconnected: translate('network.sampling.lostConnection'),
}

function showMessageError(msg) {
  message.error(msg)
}

const TabPane = Tabs.TabPane

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string,
  }

  static defaultProps = {
    stationID: '',
  }

  state = {
    activeTabKey: 'config',
    isInitLoaded: false,
    isSampling: false,
    isLoading: false,
    isLoadingTryAgain: false,
    isConfig: false,
    isScheduled: false,
    isDisconnection: false,
    configSampling: undefined,
    configSamplingSchedule: undefined,
    timerId_getStatus: null,
  }

  constructor(props) {
    super(props)
    this.tabHistory = React.createRef()
    /* NOTE  viết theo kiểu này để fix lỗi ReferenceError: _this6...*/
    this.startTimer = this.startTimer.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  updateState = newState => {
    console.log('newState', newState)
    this.setState(prevState => ({ ...prevState, ...newState }))
  }

  async getStatus() {
    const res = await StationAPI.getStatus(this.props.stationID)

    let configSampling = res.data.configSampling
      ? res.data.configSampling
      : undefined
    let configSamplingSchedule = res.data.configSamplingSchedule
      ? res.data.configSamplingSchedule
      : undefined
    if (
      configSampling &&
      this.state.configSampling.status === STATUS_SAMPLING.COMMANDED &&
      configSampling.status === STATUS_SAMPLING.READY
    )
      configSampling.status = STATUS_SAMPLING.COMMANDED
    console.log('timer getStatus: ', configSamplingSchedule)
    this.setState({
      configSampling,
      configSamplingSchedule,
      isScheduled: res.data.configSamplingSchedule ? true : false,
    })
  }

  startTimer() {
    this.timer = setInterval(this.getStatus, TIME_INTERVAL_GET_STATUS)
  }

  async componentDidMount() {
    this.getSamplingInfo()
  }

  async getSamplingInfo() {
    try {
      const res = await StationAPI.getStatus(this.props.stationID)
      // console.log('isInitLoaded',this.state.isInitLoaded)
      this.setState({ isLoading: false, isInitLoaded: true })
      this.startTimer()
      if (res.data) {
        this.setState({
          isConfig: res.data.configSampling ? true : false,
          activeTabKey: res.data.configSampling ? 'sampling' : 'config',
          isScheduled: res.data.configSamplingSchedule ? true : false,
          isLoading: false,
          configSampling: res.data.configSampling
            ? res.data.configSampling
            : undefined,
          configSamplingSchedule: res.data.configSamplingSchedule
            ? res.data.configSamplingSchedule
            : undefined,
        })
      } else {
        showMessageError(i18n.getStatusFail)
        this.setState({ isLoading: false })
      }
      this.setState({ isDisconnection: false })
    } catch (err) {
      console.log('sampling lost connection')
      this.setState({
        isLoading: false,
        isDisconnection: true,
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleChangeTab(tabActive) {
    if (tabActive === 'history') {
      if (this.historyRef) this.historyRef.componentWillMount()
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isDisconnection
          ? this._renderDisconnection(i18n.disconnected)
          : this._renderTabs()}
      </React.Fragment>
    )
  }

  _renderDisconnection(message) {
    return (
      <Row type="flex" justify="center" align="middle">
        <Disconnection
          isLoading={this.state.isLoadingTryAgain}
          messages={message}
          onClickTryAgain={() => {
            this.setState({ isLoadingTryAgain: true })
            this.getSamplingInfo()
            this.setState({ isLoadingTryAgain: false })
          }}
        />
      </Row>
    )
  }

  _renderTabs = () => {
    const { stationID } = this.props
    const {
      isSampling,
      isLoading,
      isConfig,
      isScheduled,
      configSampling,
      configSamplingSchedule,
      isInitLoaded,
      activeTabKey,
    } = this.state
    return (
      <SamplingWrapper>
        <Spin
          indicator={<Icon type="loading" style={{ fontSize: 24 }} />}
          spinning={isLoading || !isInitLoaded}
        >
          <Tabs
            onChange={this.handleChangeTab}
            defaultActiveKey={isConfig ? 'sampling' : 'config'}
            activeKey={activeTabKey}
            onTabClick={key => this.setState({ activeTabKey: key })}
          >
            <TabPane
              style={{ width: '100%' }}
              key="sampling"
              tab={translate('monitoring.moreContent.sampling.tabs.sampling')}
              disabled={!isConfig}
            >
              <Sampling
                stationID={stationID}
                configSampling={configSampling}
                updateParentState={this.updateState}
                configSamplingSchedule={configSamplingSchedule}
                STATUS_SAMPLING={STATUS_SAMPLING}
                isScheduled={isScheduled}
              />
            </TabPane>
            <TabPane
              key="history"
              disabled={!isConfig}
              tab={translate('monitoring.moreContent.sampling.tabs.history')}
            >
              <History
                getRef={ref => (this.historyRef = ref)}
                stationID={stationID}
              />
            </TabPane>
            <TabPane
              key="config"
              tab={translate('monitoring.moreContent.sampling.tabs.config')}
            >
              <Config
                stationID={stationID}
                isSampling={isSampling}
                configSampling={configSampling}
                configSamplingSchedule={configSamplingSchedule}
                updateParentState={this.updateState}
                STATUS_SAMPLING={STATUS_SAMPLING}
                isScheduled={isScheduled}
                isConfig={isConfig}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </SamplingWrapper>
    )
  }
}
