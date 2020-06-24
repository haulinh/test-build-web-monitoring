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
  }
)
export default class DefaultCell extends React.Component {
  static propTypes = {
    /* redux's props */
    updateNotifyRead: PropTypes.func.isRequired,
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
    const { isRead } = data
    if (!isRead) return '#0052cc'
    else if (isMarkedReadAll) return '#ebecf0'
    return '#ebecf0'
  }
  render() {
    console.log(this.props.isMarkedReadAll, 'abcc')
    const { isHoverOnCell } = this.state
    const { icon, content, data } = this.props
    const { receivedAt, isRead } = data
    // const _icon = `${getConfigApi().media}/${icon}` // Qui bỏ dùng anh phát vì khong dùng
    console.log(getConfigApi().media, 'getConfigApi')
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
            <Col span={3} className="notify-image">
              <Icon
                type={icon.type}
                theme="outlined"
                height="100%"
                style={{ fontSize: '40px', color: icon.color }}
              />
            </Col>

            {/* contents */}
            <Col span={21} className="notify-content">
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
                <Icon
                  style={{ fontSize: '16px' }}
                  type="close-circle"
                  theme="filled"
                  onClick={this.onDelete}
                />
              )}
            </Col>
            <Col span={8}>
              <div
                onClick={() => this._handleIsReadPointClick(data)}
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
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  onDelete = () => {
    console.log('abc')
  }
  renderMenu = data => (
    <Menu>
      <Menu.Item onClick={() => this._navigateToDataSearch(data)}>
        {i18n.viewDataAroundExceededTime}
      </Menu.Item>
    </Menu>
  )

  _handleIsReadPointClick = data => this.props.updateNotifyRead(data)

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
