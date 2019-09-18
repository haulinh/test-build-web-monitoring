import React from 'react'
import PropTypes from 'prop-types'
import { Router, Route, withRouter} from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import { Row, Col, Tooltip, Dropdown, Menu, message} from 'antd'
import styled from 'styled-components'

import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import { updateNotifyRead } from 'redux/actions/notification'
import { setDrawerVisible } from 'redux/actions/notification'

const i18n = {
  viewDataAroundExceededTime: translate('stationAutoManager.list.notification.actions.viewDataAroundExceededTime')
}
//View data around this time
const MultilineText = styled(Row)`
  font-size: 12px;
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
  (state) => ({
  }),
  { updateNotifyRead, setDrawerVisible }
)
export default class DefaultCell extends React.Component {
  static propTypes = {
    /* redux's props */
    updateNotifyRead: PropTypes.func.isRequired,
    /* comp's props */
    setDrawerVisible: PropTypes.func.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    content: PropTypes.element.isRequired,
    data: PropTypes.object.isRequired
  }

  static defaultProps = {
    icon: '/images/logo/logo-icon.png',
    updateNotifyRead() {
      message.warning('tinh nang hien tai khong hop le')
    }
  }

  state = {
    isHoverOnCell: false
  }

  render() {
    const { isHoverOnCell } = this.state
    const { icon, content, data } = this.props
    const { receivedAt, isRead } = data
    return (
      <Row 
        type="flex" align="middle"
        style={{
          height: 60, 
          backgroundColor: isHoverOnCell ? '#0000001a' : isRead ? '#fff' : '#edf2fa',
          borderBottom: '1px solid #dddfe2', 
          cursor: "pointer"
        }} 
        onMouseEnter={() => this.setState({isHoverOnCell: true})}
        onMouseLeave={() => this.setState({isHoverOnCell: false})}
      >

        <Col span={23} onClick={() => this._handleCellOnClick(data)}>
          <Row 
            type="flex" align="middle"
            style={{
              height: 60, 
            }} 
          >
            {/* image */}
            <Col span={3} style={{textAlign: "center"}} className="notify-image" style={{height: '100%'}}>
              <img src={icon} height="100%" style={{objectFit: 'contain'}}/>
            </Col>

            {/* contents */}
            <Col span={ 21 } className="notify-content" style={{paddingLeft: 8, paddingRight: 16}}>
              <Tooltip title={content} placement="right" overlayStyle={{width: 800, marginLeft: 200}} mouseEnterDelay={1}>
                <MultilineText>
                  {content}
                </MultilineText>
              </Tooltip>
              <Row>
                <Col style={{fontStyle: "italic", color: "#90949c", fontSize: 12}}>
                  { moment(receivedAt).format('MM/DD [at] HH:mm') }
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        {/* actions */}
        <Col className="notify-action" span={1}>
          { this.state.isHoverOnCell && (
            <Dropdown overlay={this.renderMenu(data)} placement="bottomRight">
              <span>...</span>
            </Dropdown>
          )}
        </Col>
        
      </Row>
    )
  }

  renderMenu = (data) => (
    <Menu>
      <Menu.Item onClick={() => this._navigateToDataSearch(data)}>
        {i18n.viewDataAroundExceededTime}
      </Menu.Item>
    </Menu>
  );

  _handleCellOnClick = (data) => {
    this.props.updateNotifyRead(data)
    this._navigateToStationOnMonitoring(data)
  }

  _navigateToStationOnMonitoring = (data) => {
    this.props.setDrawerVisible(false)
    this.props.history.replace(data.actions.viewDetail)
  }

  _navigateToDataSearch = (data) => {
    this.props.setDrawerVisible(false)
    this.props.history.replace(data.actions.aroundAtExceededTime)
  }
}