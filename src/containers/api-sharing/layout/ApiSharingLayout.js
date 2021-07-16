import { Affix, Col, Row, Spin } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import slug from 'constants/slug'
import React from 'react'
import { withRouter } from 'react-router'
import MenuApiSharing from './MenuApiSharing'

export const ShareApiContext = React.createContext({
  menuApiSharingList: [],
  setMenuApiSharingList: () => {},
})

@withRouter
export default class ApiSharingLayout extends React.Component {
  state = {
    menuApiSharingList: [],
    loading: false,
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const { location } = this.props
    try {
      const apiSharingListData = await shareApiApi.getConfig()
      this.setState(
        { menuApiSharingList: apiSharingListData.data.value },
        () => {
          if (location.pathname === '/api-sharing')
            this.onClickMenu(this.state.menuApiSharingList[0].api[0].key)
        }
      )
    } catch (error) {}
    this.setState({ loading: false })
  }

  onClickMenu = apiKey => {
    this.props.history.push(`${slug.apiSharing.base}/${apiKey}`)
  }

  getSelectedKeyMenu = () => {
    const { location } = this.props
    const pathnames = location.pathname.split('/')
    return pathnames[2]
  }

  getOpenKeys = () => {
    const openKeys = this.state.menuApiSharingList.map(item => item.group)
    return openKeys
  }

  render() {
    const { menuApiSharingList, loading } = this.state

    if (loading || menuApiSharingList.length === 0) {
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

    const selectedKeyMenu = this.getSelectedKeyMenu()
    const openKeys = this.getOpenKeys()

    return (
      <Row>
        <Col span={5}>
          <Affix>
            <MenuApiSharing
              defaultOpenKeys={openKeys}
              defaultSelectedKeys={[
                selectedKeyMenu || menuApiSharingList[0].api[0].key,
              ]}
              onClickMenu={this.onClickMenu}
              history={this.props.history}
              data={menuApiSharingList}
            />
          </Affix>
        </Col>
        <ShareApiContext.Provider value={{ menuApiSharingList }}>
          <Col span={19}>{this.props.children}</Col>
        </ShareApiContext.Provider>
      </Row>
    )
  }
}
