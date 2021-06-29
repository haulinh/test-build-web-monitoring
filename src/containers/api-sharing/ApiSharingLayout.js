import { Col, Row } from 'antd'
import React from 'react'
import { API_SHARE_LIST_DATA } from './constants'
import MenuApiSharing from './MenuApiSharing'

export default class ApiSharingLayout extends React.Component {
  state = {
    menuApiSharingList: [],
  }

  componentDidMount() {
    const apiSharingListData = API_SHARE_LIST_DATA
    this.setState({ menuApiSharingList: apiSharingListData.data[0].value })
  }

  render() {
    const { menuApiSharingList } = this.state
    return (
      <Row>
        <Col span={6}>
          <MenuApiSharing data={menuApiSharingList} />
        </Col>
        <Col span={18}>{this.props.children}</Col>
      </Row>
    )
  }
}
