import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Row, Col, Tooltip, Dropdown, Menu, message} from 'antd'
import styled from 'styled-components'

import { connectAutoDispatch } from 'redux/connect'
import { updateNotifyRead } from 'redux/actions/notification'

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

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

@connectAutoDispatch(
  (state) => ({
  }),
  { updateNotifyRead }
)
export default class DefaultCell extends React.Component {
  static propTypes = {
    /* redux's props */
    updateNotifyRead: PropTypes.func.isRequired
  }

  static defaultProps = {
    updateNotifyRead() {
      message.warning('tinh nang hien tai khong hop le')
    }
  }

  state = {
    isShowActions: false
  }

  static propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    content: PropTypes.element.isRequired,
    data: PropTypes.object.isRequired
  }

  static defaultProps = {
    icon: '/images/logo/logo-icon.png',
  }

  render() {
    console.log(this.props.data)
    const { icon, content, data } = this.props
    const { receivedAt, isRead } = data
    return (
      <Row 
        type="flex" align="middle"
        style={{
          height: 60, 
          backgroundColor: isRead ? '#fff' : '#edf2fa', 
          borderBottom: '1px solid #dddfe2', 
          cursor: "pointer"
        }} 
        onClick={() => this.props.updateNotifyRead(data)}
        onMouseEnter={() => this.setState({isShowActions: true})}
        onMouseLeave={() => this.setState({isShowActions: false})}
      >
        {/* image */}
        <Col span={3} style={{textAlign: "center"}} className="notify-image">
          <img src={icon} width={50} />
        </Col>
        {/* contents */}
        <Col span={this.state.isShowActions ? 20 : 21 } className="notify-content">
          <Tooltip title={content} placement="right" overlayStyle={{width: 400}}>
            <MultilineText>
              {content}
            </MultilineText>
          </Tooltip>
          <Row>
            <Col style={{fontStyle: "italic", color: "#90949c", fontSize: 12}}>
              { receivedAt }
            </Col>
          </Row>
        </Col>
        {/* actions */}
        { this.state.isShowActions && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Col className="notify-action" span={1}>
              ...
            </Col>
          </Dropdown>
        )}
      </Row>
    )
  }
}

