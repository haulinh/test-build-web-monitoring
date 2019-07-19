import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'
import { SHAPE } from 'themes/color'
import { Button } from 'antd'
import ROLE, { checkRolePriority } from 'constants/role'
import moment from 'moment/moment'
// import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import { connect } from 'react-redux'
// import StationControl from 'api/SamplingApi'
import  { STATUS_STATION } from 'constants/stationStatus'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { isEmpty } from 'lodash'
// import { action } from 'shared/breadcrumb'
// import objectPath from 'object-path'

const i18n = {
  notInUse: translate('monitoring.notInUse'),
  sampling: translate('monitoring.actions.sampling'),
  camera: translate('monitoring.actions.camera'),
  chart: translate('monitoring.actions.chart'),
  map: translate('monitoring.actions.map'),
  images: translate('monitoring.actions.images'),
  stationInfo: translate('monitoring.actions.stationInfo'),
  reviewStation: translate('monitoring.actions.reviewStation')
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
  background: linear-gradient(135deg, rgb(29, 137, 206) 0%, rgb(86, 210, 243) 100%);
  font-weight: 700;
  color: #ffffff;
`

const StationName = styled.h4`
  font-weight: 600;
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 0px;
`

const WrapperNameStationTypeName = styled.div`
  flex-direction: column;
  .stationName {
    font-size: 12px;
  }
  .stationTypeName {
    font-size: 10px;
    display: block;
    color: ${SHAPE.PRIMARY};
    opacity: 0.7;
  }
`

const ReceivedAt = styled.span`
  color: ${props => (props.status !== 'GOOD' ? SHAPE.RED : '#000')};
  font-style: ${props => (props.status === STATUS_STATION.DATA_LOSS ? 'italic' : 'normal')};
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
/* NOTE  KHÔNG XOÁ, DÙNG CHO Ở DƯỚI */
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
  userInfo: state.auth.userInfo
}))
@autobind
export default class StationAutoHead extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    stationTypeName: PropTypes.string,
    receivedAt: PropTypes.string,
    orderNumber: PropTypes.number,
    stationID: PropTypes.string,
    options: PropTypes.object,
    status: PropTypes.string,
    onClickDataSearch: PropTypes.func,
    onClickViewMap: PropTypes.func,
    onClickViewCamera: PropTypes.func
  }

  state = {
    isLoaded: false,
    isEnable: false,
    currentAction: ''
  }

  // componentWillMount() {
  //   this.startTimer()
  // }

  // startTimer() {
  //   clearInterval(this.timer)
  //   this.timer = setInterval(this.loadData.bind(this), 600000) //10 phút
  //   this.loadData()
  // }

  // loadData() {
  //   const { options } = this.props
  //   if (options && options.sampling && options.sampling.allowed) {
  //     StationControl.checkStationControl(
  //       this.props.stationID,
  //       this.props.organization._id
  //     ).then(record => {
  //       if (record.success) {
  //         this.setState({
  //           isLoaded: true,
  //           //isEnable: record.data
  //           isEnable: true
  //         })
  //       } else {
  //         this.setState({
  //           isLoaded: true,
  //           //isEnable: false
  //           isEnable: true
  //         })
  //       }
  //     })
  //   }
  // }

  toReceivedAt = (status, receivedAt) => {
    // MARK  thay đổi logic, k0 cần thông báo mat ket noi
    // const statusStr =
    //   status === STATUS_STATION.DATA_LOSS ? translate('monitoring.lossAt') : ''

    const statusStr = ''
    const receivedAtStr = receivedAt ? moment(receivedAt).format(DD_MM_YYYY_HH_MM) : ''
    if (!isEmpty(statusStr) && !isEmpty(receivedAtStr)) {
      return `(${statusStr} ${receivedAtStr})`
    }

    return `${receivedAtStr}`
  }

  handleActionOnClick(actionName) {
    if (this.state.currentAction === actionName) {
      this.setState({ currentAction: '' })
    } else {
      this.setState({ currentAction: actionName })
    }
    this.props.onClickActionButton(actionName)
  }

  /* NOTE  ROLSE: kiem tra role của user, copy từ file index.backup.js */
  // checkRole(role) {
  //   // check role in organization first
  //   let isRole = objectPath.get(this.props.organization, role)
  //   console.log('isRole', isRole)
  //   console.log('isAdmin', this.props.isAdmin)
  //   console.log('authRole', this.props.authRole)
  //   if (!isRole) return isRole
  //   else if (this.props.isAdmin) return true
  //   else return objectPath.get(this.props.authRole, role)
  // }

  render() {
    const {
      name,
      stationTypeName,
      receivedAt,
      orderNumber,
      // stationID,
      options,
      status
    } = this.props

    const { currentAction } = this.state
    const isCamera = options && options.camera && options.camera.allowed
    const isSampling = options && options.sampling && options.sampling.allowed
    return (
      <StationHeadItemWrapper>
        <TitleWrapper>
          <OrderNumber>{orderNumber}</OrderNumber>
          <Clearfix width={8} />
          {stationTypeName ? (
            <WrapperNameStationTypeName>
              <StationName className="stationName">{name}</StationName>
              <span className="stationTypeName">{stationTypeName}</span>
            </WrapperNameStationTypeName>
          ) : (
            <StationName>
              {name} {status === STATUS_STATION.NOT_USE && ' - ' + i18n.notInUse}
            </StationName>
          )}
          <Clearfix width={8} />
          {/* MARK  Bỏ status={status} vì k0 can phan biet status nua */}
          <ReceivedAt status={STATUS_STATION.GOOD}>{this.toReceivedAt(status, receivedAt)}</ReceivedAt>
        </TitleWrapper>

        <ActionWrapper>
          <Button
            className="actionItem"
            type={currentAction === 'sampling' ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('sampling')}
            disabled={!isSampling || !checkRolePriority(this.props.userInfo, ROLE.MONITORING.CONTROL)}
          >
            {i18n.sampling}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'camera' ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('camera')}
            disabled={!isCamera || !checkRolePriority(this.props.userInfo, ROLE.MONITORING.CAMERA)}
          >
            {i18n.camera}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'chart'  ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('chart')}
            disabled={!checkRolePriority(this.props.userInfo, ROLE.MONITORING.CHART)}
          >
            {i18n.chart}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'map'  ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('map')}
            disabled={!checkRolePriority(this.props.userInfo, ROLE.MONITORING.MAP)}
          >
            {i18n.map}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'image'  ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('image')}
            disabled={!checkRolePriority(this.props.userInfo, ROLE.MONITORING.IMAGES)}
          >
            {i18n.images}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'station'  ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('station')}
            disabled={!checkRolePriority(this.props.userInfo, ROLE.MONITORING.INFOSTATION)}
          >
            {i18n.stationInfo}
          </Button>
          <Button
            className="actionItem"
            type={currentAction === 'rating'  ? 'primary' : 'default'}
            onClick={() => this.handleActionOnClick('rating')}
            disabled={!checkRolePriority(this.props.userInfo, ROLE.MONITORING.REVIEWSTATION)}
          >
            {i18n.reviewStation}
          </Button>
        </ActionWrapper>

        {/* NOTE  không xoá, để sau này dùng đến, hiện tại dùng ActionWrapper ở trên trong bản launching */}
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
