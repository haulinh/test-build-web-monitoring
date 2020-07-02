import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Row, Col, Tooltip, Dropdown, Menu, message, Icon, Button } from 'antd'
import styled from 'styled-components'

import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import { updateNotifyRead } from 'redux/actions/notification'
import { setDrawerVisible } from 'redux/actions/notification'
import { connect } from 'react-redux'
import { getConfigApi } from 'config'
import {
  deleteOneNotification,
  updateNotReadOneNotification,
  updateReadOneNotification,
} from 'redux/actions/notification'

const i18n = {
  viewDataAroundExceededTime: translate(
    'stationAutoManager.list.notification.actions.viewDataAroundExceededTime'
  ),
}
//View data around this time
const MultilineText = styled(Row)`
  font-size: 16px;
  max-height: 2.6em;
  text-overflow: ellipsis;
  line-height: 1.3em;
  overflow: hidden;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
`

@withRouter
@connectAutoDispatch(
  state => ({ isMarkedReadAll: state.notification.isMarkedReadAll }),
  {
    updateNotifyRead,
    setDrawerVisible,
    deleteOneNotification,
    updateNotReadOneNotification,
    updateReadOneNotification,
  }
)
export default class DefaultCell extends React.Component {
  static propTypes = {
    /* redux's props */
    updateNotifyRead: PropTypes.func.isRequired,
    deleteOneNotification: PropTypes.func.isRequired,
    updateNotReadOneNotification: PropTypes.func.isRequired,

    /* comp's props */
    setDrawerVisible: PropTypes.func.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    content: PropTypes.element.isRequired,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    icon: '/images/logo/logo-icon.png',
    updateNotifyRead() {
      message.warning('tinh nang hien tai khong hop le')
    },
  }

  state = {
    isHoverOnCell: false,
    isHoverOnIconRead: false,
  }
  getNotificationColor() {
    const { isHoverOnCell } = this.state
    const { data } = this.props
    const { isRead } = data
    if (isHoverOnCell) return '#0000001a'
    else if (this.props.isMarkedReadAll) return '#fff'
    else if (isRead) return '#fff'
    else return '#edf2fa'
  }
  getNotificationColorForIcon() {
    const { data, isMarkedReadAll } = this.props
    const { isHoverOnIconRead } = this.state
    const { isRead } = data
    if (!isRead || isHoverOnIconRead) return '#0052cc'
    else if (isMarkedReadAll) return '#ebecf0'
    return '#ebecf0'
  }
  render() {
    const { isHoverOnCell, isHoverOnIconRead } = this.state
    const { icon, content, data } = this.props
    const { receivedAt, _id } = data
    // const _icon = `${getConfigApi().media}/${icon}` // Qui bỏ dùng anh phát vì khong dùng
    return (
      <Row
        type="flex"
        align="middle"
        style={{
          padding: '20px',
          height: 100,
          backgroundColor: this.getNotificationColor(),
          borderBottom: '1px solid #dddfe2',
          cursor: 'pointer',
        }}
        onMouseEnter={() => this.setState({ isHoverOnCell: true })}
        onMouseLeave={() => this.setState({ isHoverOnCell: false })}
      >
        <Col span={20} onClick={() => this._handleCellOnClick(data)}>
          <Row
            style={{
              height: '100%',
            }}
          >
            {/* icon */}
            <Col span={5} className="notify-image">
              <Icon
                type={icon.type}
                theme="outlined"
                height="100%"
                style={{ fontSize: '40px', color: icon.color }}
              />
            </Col>

            {/* contents */}
            <Col span={19} className="notify-content">
              <Tooltip
                title={content}
                placement="right"
                overlayStyle={{ width: 800, marginLeft: 200 }}
                mouseEnterDelay={1}
              >
                <MultilineText>{content}</MultilineText>
              </Tooltip>
              <Row>
                <Col
                  style={{
                    marginTop: '5px',
                    fontStyle: 'italic',
                    color: '#90949c',
                    fontSize: 12,
                  }}
                >
                  {moment(receivedAt).fromNow()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        {/* actions */}
        <Col className="notify-action" span={4}>
          {/* {data.status === 'DATA_EXCEEDED' && (
            <Dropdown overlay={this.renderMenu(data)} placement="bottomRight">
              <span>...</span>
            </Dropdown>
          )} */}

          <Row justify="end">
            <Col span={8} />
            <Col span={8}>
              {this.state.isHoverOnCell && (
                <Tooltip placement="bottom" title="Xoá thông báo này">
                  <Icon
                    style={{ fontSize: '16px' }}
                    type="close-circle"
                    theme="filled"
                    onClick={() => this._hanldeDeleteOneNotification(_id)}
                  />
                </Tooltip>
              )}
            </Col>
            <Col span={8}>
              {!data.isRead ? (
                <Tooltip placement="right" title="Đánh dấu đã đọc">
                  <div
                    onMouseEnter={() =>
                      this.setState({ isHoverOnIconRead: true })
                    }
                    onMouseLeave={() =>
                      this.setState({ isHoverOnIconRead: false })
                    }
                    onClick={() => this._handleUpdateReadOne(_id)}
                    style={{
                      borderWidth: '4px',
                      borderStyle: 'solid',
                      width: '16px',
                      height: '16px',
                      borderRadius: 16,
                      backgroundColor: this.getNotificationColorForIcon(),
                      borderColor: '#ebecf0',
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="right" title="Đánh dấu chưa đọc">
                  <div
                    onMouseEnter={() =>
                      this.setState({ isHoverOnIconRead: true })
                    }
                    onMouseLeave={() =>
                      this.setState({ isHoverOnIconRead: false })
                    }
                    onClick={() => this._handleUpdateNotReadOne(_id)}
                    style={{
                      borderWidth: '4px',
                      borderStyle: 'solid',
                      width: '16px',
                      height: '16px',
                      borderRadius: 16,
                      backgroundColor: this.getNotificationColorForIcon(),

                      borderColor: '#ebecf0',
                    }}
                  />
                </Tooltip>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  _hanldeDeleteOneNotification = notificationId => {
    this.props.deleteOneNotification(notificationId)
  }
  renderMenu = data => (
    <Menu>
      <Menu.Item onClick={() => this._navigateToDataSearch(data)}>
        {i18n.viewDataAroundExceededTime}
      </Menu.Item>
    </Menu>
  )

  _handleUpdateNotReadOne = notificationId =>
    this.props.updateNotReadOneNotification(notificationId)
  _handleUpdateReadOne = notificationId =>
    this.props.updateReadOneNotification(notificationId)

  _handleCellOnClick = data => {
    this.props.updateNotifyRead(data)
    this._navigateToStationOnMonitoring(data)
  }

  _navigateToStationOnMonitoring = data => {
    this.props.setDrawerVisible(false)
    this.props.history.replace(data.actions.viewDetail)
  }

  _navigateToDataSearch = data => {
    this.props.setDrawerVisible(false)
    this.props.history.replace(data.actions.aroundAtExceededTime)
  }
}
