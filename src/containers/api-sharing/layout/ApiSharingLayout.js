import { Col, Row, Spin } from 'antd'
import slug from 'constants/slug'
import React from 'react'
import { withRouter } from 'react-router'
import { API_SHARE_LIST_DATA } from '../constants'
import MenuApiSharing from './MenuApiSharing'

@withRouter
export default class ApiSharingLayout extends React.Component {
  state = {
    menuApiSharingList: [],
    loading: false,
  }

  async componentDidMount() {
    this.setState({ loading: true })
    try {
      const apiSharingListData = await this.fetchData()
      this.setState(
        { menuApiSharingList: apiSharingListData.data.value },
        () => {
          this.onClickMenu(this.state.menuApiSharingList[0].api[0].key)
        }
      )
    } catch (error) {}
    this.setState({ loading: false })
  }

  fetchData = () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(API_SHARE_LIST_DATA), 1000)
    })
  }

  onClickMenu = apiKey => {
    this.props.history.push(`${slug.apiSharing.base}/${apiKey}`)
  }

  render() {
    const { menuApiSharingList, loading } = this.state

    if (loading) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      )
    }

    return (
      <Row>
        <Col span={4}>
          <MenuApiSharing
            onClickMenu={this.onClickMenu}
            history={this.props.history}
            data={menuApiSharingList}
          />
        </Col>
        <Col span={20}>{this.props.children}</Col>
      </Row>
    )
  }
}
