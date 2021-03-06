import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'
import { Dropdown, Button, Menu, Icon, Divider } from 'antd'
import ROLE, { checkRolePriority } from 'constants/role'
import moment from 'moment/moment'
// import DrawerStation from './drawer';
import DrawerStation from './more-content/drawer'

// import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'

import { connect } from 'react-redux'
// import StationControl from 'api/SamplingApi'
import { STATUS_STATION } from 'constants/stationStatus'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { isEmpty, get as _get } from 'lodash'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import LanguageContent from 'components/language/language-content'

// import objectPath from 'object-path'

function i18n() {
  return {
    notInUse: translate('monitoring.notInUse'),
    sampling: translate('monitoring.actions.sampling'),
    camera: translate('monitoring.actions.camera'),
    chart: translate('monitoring.actions.chart'),
    map: translate('monitoring.actions.map'),
    images: translate('monitoring.actions.images'),
    stationInfo: translate('monitoring.actions.stationInfo'),
    reviewStation: translate('monitoring.actions.reviewStation'),
    more: translate('monitoring.actions.more.label'),
    historyData: translate('monitoring.actions.more.historyData'),
    averageData: translate('monitoring.actions.more.averageData'),
    checkData: translate('monitoring.actions.more.checkData'),
    config: translate('monitoring.actions.more.config'),
  }
}

const StationHeadItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`
const OrderNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  text-align: center;
  vertical-align: middle;
  background: linear-gradient(
    135deg,
    rgb(29, 137, 206) 0%,
    rgb(86, 210, 243) 100%
  );
  font-weight: 700;
  color: #ffffff;
`

const StationName = styled.h4`
  font-weight: 600;
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 0px;
`

const ReceivedAt = styled.span`
  color: #000;
  font-style: ${props =>
    props.status === STATUS_STATION.DATA_LOSS ? 'italic' : 'normal'};
`
const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: -8px;
  margin-right: -8px;
  .actionItem {
    margin-right: 4px;
  }
  .actionItem:last-child {
    margin-right: 0px;
  }
`
/* NOTE  KH??NG XO??, D??NG CHO ??? D?????I */
// const ActionWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   margin-left: -8px;
//   margin-right: -8px;
//   .actionItem {
//     padding: 0px 8px;
//     color: #1890ff;
//     border-right: 1px solid ${SHAPE.GRAYBOLD};
//     &:hover {
//       cursor: pointer;
//     }
//   }
//   .actionItem:last-child {
//     border-right: 0px;
//   }
// `

@connect(state => ({
  authRole: state.auth.userInfo.role,
  isAdmin: state.auth.userInfo.isAdmin,
  organization: state.auth.userInfo.organization,
  userInfo: state.auth.userInfo,
  language: _get(state, 'language.locale'),
  languageContents: _get(state, 'language.languageContents'),
}))
@queryFormDataBrowser(['submit'])
@autobind
export default class StationAutoHead extends React.PureComponent {
  static propTypes = {
    _id: PropTypes.string,
    name: PropTypes.string,
    stationTypeName: PropTypes.string,
    receivedAt: PropTypes.string,
    orderNumber: PropTypes.number,
    stationID: PropTypes.string,
    options: PropTypes.object,
    status: PropTypes.string,
    onClickDataSearch: PropTypes.func,
    onClickViewMap: PropTypes.func,
    onClickViewCamera: PropTypes.func,
    currentActionDefault: PropTypes.string,
  }

  state = {
    isLoaded: false,
    isEnable: false,
    currentAction: '',
    visibleDrawer: false,
    drawerType: '',
  }

  toReceivedAt = (status, receivedAt) => {
    // MARK  thay ?????i logic, k0 c???n th??ng b??o mat ket noi
    // const statusStr =
    //   status === STATUS_STATION.DATA_LOSS ? translate('monitoring.lossAt') : ''

    const statusStr = ''
    const receivedAtStr = receivedAt
      ? moment(receivedAt).format(DD_MM_YYYY_HH_MM)
      : ''
    if (!isEmpty(statusStr) && !isEmpty(receivedAtStr)) {
      return `(${statusStr} ${receivedAtStr})`
    }

    return `${receivedAtStr}`
  }

  async componentDidMount() {
    this.setState({
      currentAction: this.props.currentActionDefault
        ? this.props.currentActionDefault
        : '',
    })
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    // console.log(this.props.currentActionDefault, nextProps.currentActionDefault,"UNSAFE_componentWillReceiveProps")
    if (this.props.currentActionDefault !== nextProps.currentActionDefault) {
      this.setState({
        currentAction: nextProps.currentActionDefault,
      })
    }
  }

  handleActionOnClick = (actionName, keyOpenTab) => () => {
    if (!keyOpenTab) {
      if (this.state.currentAction === actionName) {
        this.setState({ currentAction: '' })
      } else {
        this.setState({ currentAction: actionName })
      }
    }
    this.props.onClickActionButton(actionName, keyOpenTab)
  }

  showDrawer = drawerType => () => {
    this.setState({
      visibleDrawer: true,
      drawerType,
    })
  }

  closeDrawer = () => {
    this.setState({
      visibleDrawer: false,
      drawerType: '',
    })
  }

  render() {
    const {
      name,
      receivedAt,
      orderNumber,
      stationID,
      options,
      status,
      _id,
      stationKey,
    } = this.props

    const { currentAction } = this.state
    const isCamera = options && options.camera && options.camera.allowed
    const isSampling = options && options.sampling && options.sampling.allowed
    return (
      <StationHeadItemWrapper>
        <TitleWrapper>
          <a
            style={{ display: 'none' }}
            href={`#${stationID}`}
            className="anchor"
          >
            #
          </a>
          <OrderNumber>{orderNumber}</OrderNumber>
          <Clearfix width={8} />
          <StationName>
            <LanguageContent type="Station" field="name" value={name} itemId={_id}/>
            {status === STATUS_STATION.NOT_USE && ' - ' + i18n().notInUse}
          </StationName>
          <Clearfix width={8} />
          {/* MARK  B??? status={status} v?? k0 can phan biet status nua */}
          <ReceivedAt id={stationID} status={STATUS_STATION.DATA_CONNECTED}>
            {this.toReceivedAt(status, receivedAt)}
          </ReceivedAt>
        </TitleWrapper>

        <ActionWrapper>
          {!isSampling ||
          !checkRolePriority(
            this.props.userInfo,
            ROLE.MONITORING.CONTROL
          ) ? null : (
            <Button
              className="actionItem"
              type={currentAction === 'sampling' ? 'primary' : 'default'}
              onClick={this.handleActionOnClick('sampling')}
            >
              {i18n().sampling}
            </Button>
          )}

          {!isCamera ||
          !checkRolePriority(
            this.props.userInfo,
            ROLE.MONITORING.CAMERA
          ) ? null : (
            <Button
              className="actionItem"
              type={currentAction === 'camera' ? 'primary' : 'default'}
              onClick={this.handleActionOnClick('camera')}
            >
              {i18n().camera}
            </Button>
          )}

          <Button
            className="actionItem"
            type={currentAction === 'chart' ? 'primary' : 'default'}
            onClick={this.handleActionOnClick('chart')}
            disabled={
              !checkRolePriority(this.props.userInfo, ROLE.MONITORING.CHART)
            }
          >
            {i18n().chart}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'map' ? 'primary' : 'default'}
            onClick={this.handleActionOnClick('map')}
            disabled={
              !checkRolePriority(this.props.userInfo, ROLE.MONITORING.MAP)
            }
          >
            {i18n().map}
          </Button>
          {/* <Button
            className="actionItem"
            type={currentAction === 'image' ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('image')}
            disabled={
              !checkRolePriority(this.props.userInfo, ROLE.MONITORING.IMAGES)
            }
          >
            {i18n().images}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'station' ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('station')}
            disabled={
              !checkRolePriority(
                this.props.userInfo,
                ROLE.MONITORING.INFOSTATION
              )
            }
          >
            {i18n().stationInfo}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'rating' ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('rating')}
            disabled={
              !checkRolePriority(
                this.props.userInfo,
                ROLE.MONITORING.REVIEWSTATION
              )
            }
          >
            {i18n().reviewStation}
          </Button> */}

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.DATA_SEARCH.VIEW
                    )
                  }
                  onClick={this.handleActionOnClick('more', 'historyData')}
                >
                  {i18n().historyData}
                </Menu.Item>
                <Divider style={{ margin: 0 }} />
                <Menu.Item
                  key="2"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.AVG_SEARCH.VIEW
                    )
                  }
                  onClick={this.handleActionOnClick('more', 'avgData')}
                >
                  {i18n().averageData}
                </Menu.Item>
                {/* <Divider style={{ margin: 0 }} /> */}
                {/* <Menu.Item
                  // disabled={
                  //   checkRolePriority(
                  //     this.props.userInfo,
                  //     ROLE.QAQCCONFIG.VIEW
                  //   )
                  // }
                  disabled={true}
                  key="3"
                >
                  {i18n().checkData}
                </Menu.Item> */}
                {/* <Divider style={{ margin: 0 }} />
                <Menu.Item
                  // disabled={
                  //     this.props.userInfo,
                  //   !checkRolePriority(
                  //     ROLE.STATION_AUTO.EDIT
                  //   )
                  // }
                  disabled={true}
                  key="4"
                >
                  {i18n().config}
                </Menu.Item> */}
              </Menu>
            }
          >
            <Button className="actionItem">
              {i18n().more} <Icon type="down" />
            </Button>
          </Dropdown>

          <Dropdown
            overlay={
              <Menu>
                {/* <Menu.Item
                  key="1"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.MONITORING.CHART
                    )
                  }
                  onClick={() => this.handleActionOnClick('chart')}
                >
                  {i18n().chart}
                </Menu.Item>
                <Divider style={{ margin: 0 }} />
                <Menu.Item
                  key="2"
                  disabled={
                    !checkRolePriority(this.props.userInfo, ROLE.MONITORING.MAP)
                  }
                  onClick={() => this.handleActionOnClick('map')}
                >
                  {i18n().map}
                </Menu.Item>
                <Divider style={{ margin: 0 }} /> */}
                <Menu.Item
                  key="3"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.MONITORING.IMAGES
                    )
                  }
                  // onClick={this.handleActionOnClick('image')}
                  onClick={this.showDrawer('image')}
                >
                  {i18n().images}
                </Menu.Item>
                <Divider style={{ margin: 0 }} />
                <Menu.Item
                  key="4"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.MONITORING.INFOSTATION
                    )
                  }
                  // onClick={() => this.handleActionOnClick('station')}
                  onClick={this.showDrawer('info')}
                >
                  {i18n().stationInfo}
                </Menu.Item>
                <Divider style={{ margin: 0 }} />
                <Menu.Item
                  key="5"
                  disabled={
                    !checkRolePriority(
                      this.props.userInfo,
                      ROLE.MONITORING.REVIEWSTATION
                    )
                  }
                  onClick={this.showDrawer('comment')}
                >
                  {i18n().reviewStation}
                </Menu.Item>
              </Menu>
            }
          >
            <Button className="actionItem">...</Button>
          </Dropdown>
          <DrawerStation
            type={this.state.drawerType}
            onClose={this.closeDrawer}
            visibleDrawer={this.state.visibleDrawer}
            _id={_id}
            name={name}
            stationKey={stationKey}
          />
        </ActionWrapper>

        {/* NOTE  kh??ng xo??, ????? sau n??y d??ng ?????n, hi???n t???i d??ng ActionWrapper ??? tr??n trong b???n launching */}
        {/* <ActionWrapper>
          {isSampling &&
            protectRole(ROLE.MONITORING.CONTROL)(
              <Spin spinning={!this.state.isLoaded} size="small">
                <Link
                  className="actionItem"
                  to={
                    this.state.isEnable
                      ? slug.controlStation.triggerWithKey +
                        `/${stationID}/${name}`
                      : slug.monitoring.base
                    //slug.controlStation.triggerWithKey + `/${stationID}/${name}`
                  }
                >
                  <Tooltip title={translate('monitoring.sampling')}>
                    <Icon
                      type="experiment"
                      theme="twoTone"
                      style={{
                        opacity: this.state.isEnable ? 1 : 0.4,
                        fontSize: 16
                      }}
                    />
                  </Tooltip>
                </Link>
              </Spin>
            )}
          {isCamera &&
            protectRole(ROLE.MONITORING.CAMERA)(
              <div
                onClick={this.props.onClickViewCamera}
                className="actionItem"
              >
                <Tooltip title={translate('monitoring.camera')}>
                  <Icon type="camera" style={{ fontSize: 16 }} />
                </Tooltip>
              </div>
            )}
          <div onClick={this.props.onClickViewMap} className="actionItem">
            <Tooltip title={translate('monitoring.viewInMap')}>
              <i className="fa fa-map-marker" />
            </Tooltip>
          </div>
          <div onClick={this.props.onClickDataSearch} className="actionItem">
            <Tooltip title={translate('monitoring.dataSearch')}>
              <Icon type="area-chart" />
            </Tooltip>
          </div>
        </ActionWrapper> */}
      </StationHeadItemWrapper>
    )
  }
}
