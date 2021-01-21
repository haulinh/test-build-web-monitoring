import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Row, Tabs, Icon, Spin } from 'antd'
import styled from 'styled-components'
import StationAPI from 'api/SamplingApi'
import { translate } from 'hoc/create-lang'
import Sampling from './tabpanes/sampling'
import History from './tabpanes/history'
import Config from './tabpanes/config'
import _, { get } from 'lodash'
import Disconnection from 'components/elements/disconnection'

const TIME_INTERVAL = 15 * 1000 // 15s
const STATUS_SAMPLING = {
  READY: 'READY',
  COMMANDED: 'COMMANDED',
  SAMPLING: 'SAMPLING',
}

const SamplingWrapper = styled.div`
  flex: 1;
`

const i18n = {
  /* NOTE  chưa dịch */
  getStatusFail: 'Không thể lấy trạng thái, hãy thử lại',
  disconnected: translate('network.sampling.lostConnection'),
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
    configExceeded: undefined,
    timerId_getStatus: null,
    samplingTypeActive: '',
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
    this.setState(prevState => ({ ...prevState, ...newState }))
  }

  async getStatus() {
    const res = await StationAPI.getStatus(this.props.stationID)
  const data = res.data || {}
    let configSampling =
      data && data.configSampling ? data.configSampling : undefined
    let configSamplingSchedule =
      data && data.configSamplingSchedule
        ? data.configSamplingSchedule
        : undefined
    const { configExceeded: { config = undefined } = {} } = data
    if (
      configSampling &&
      this.state.configSampling.status === STATUS_SAMPLING.COMMANDED &&
      configSampling.status === STATUS_SAMPLING.READY
    )
      configSampling.status = STATUS_SAMPLING.COMMANDED

    this.setState({
      configSampling,
      configSamplingSchedule,
      isScheduled: data.configSamplingSchedule ? true : false,
      samplingTypeActive: data.samplingType,
      configExceeded: config,
    })
  }

  startTimer() {
    this.timer = setInterval(this.getStatus, TIME_INTERVAL)
  }

  async componentDidMount() {
    this.getSamplingInfo()
  }

  async getSamplingInfo() {
    try {
      const res = await StationAPI.getStatus(this.props.stationID)
      this.setState({
        isLoading: false,
        isInitLoaded: true,
        isDisconnection: false,
      })
      const {
        configSampling,
        configSamplingSchedule,
        samplingType,
        configExceeded: { config } = {},
      } = res.data || {}

      this.setState({
        samplingTypeActive: samplingType,
        isConfig: !!configSampling,
        isScheduled: !!configSamplingSchedule,
        configExceeded: config || undefined,
        configSampling: configSampling || undefined,
        configSamplingSchedule: configSamplingSchedule || undefined,
        activeTabKey: !!configSampling ? 'sampling' : 'config',
      })
      this.startTimer(get(configSampling, 'timeToTakeOneBottle') * 60000)
    } catch (err) {
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

  getDisableConfig() {
    const { configSampling, isScheduled } = this.state
    if (
      _.get(configSampling, 'status', STATUS_SAMPLING.READY) !==
      STATUS_SAMPLING.READY
    ) {
      return true
    } else if (isScheduled) {
      return true
    } else {
      return false
    }
  }
  _renderTabs = () => {
    const { stationID, measuringList, configExceeded } = this.props
    const {
      isSampling,
      isLoading,
      isConfig,
      isScheduled,
      configSampling,
      configSamplingSchedule,
      isInitLoaded,
      activeTabKey,
      samplingTypeActive,
      configExceeded: configExceededState,
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
                getStatus={this.getStatus}
                samplingTypeActive={samplingTypeActive}
                configExceededState={configExceededState}
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
              disabled={
                this.getDisableConfig() || samplingTypeActive === 'EXCEEDED'
              }
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
                configExceeded={configExceeded}
                measuringList={measuringList}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </SamplingWrapper>
    )
  }
}
