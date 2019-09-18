import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
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
    updateNotifyRead: PropTypes.func.isRequired,
    /* comp's props */
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
    console.log(this.props.data)
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
        onClick={() => this.props.updateNotifyRead(data)}
        onMouseEnter={() => this.setState({isHoverOnCell: true})}
        onMouseLeave={() => this.setState({isHoverOnCell: false})}
      >

        {/* image */}
        <Col span={3} style={{textAlign: "center"}} className="notify-image" style={{height: '100%'}}>
          <img src={icon} height="100%" style={{objectFit: 'contain'}}/>
        </Col>

        {/* contents */}
        <Col span={ 20 } className="notify-content" style={{paddingLeft: 8, paddingRight: 16}}>
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

        {/* actions */}
        <Col className="notify-action" span={1}>
          { this.state.isHoverOnCell && (
            <Dropdown overlay={menu} placement="bottomRight">
              <span>...</span>
            </Dropdown>
          )}
        </Col>
        
      </Row>
    )
  }
}

