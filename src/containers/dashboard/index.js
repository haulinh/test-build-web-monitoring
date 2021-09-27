import { Col, Row, Dropdown } from 'antd'
import React, { Component } from 'react'
import styled from 'styled-components'

import { translate as t } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import { getDashboardInfo } from 'api/StationAuto'
import NotificationContent from 'layout/navigation-layout/NotificationDrawer/notificationContent'

import iconDisconnected from 'assets/svg-icons/Disconnected.svg'
import iconExceed from 'assets/svg-icons/Exceeded.svg'
import iconGood from 'assets/svg-icons/Good.svg'
import iconTendToExceed from 'assets/svg-icons/Tend-To-Exceed.svg'
import iconHelper from 'assets/svg-icons/question-circle.svg'

import Helper from './helper'
import Filter from './filter'

const Container = styled.div`
  padding: 24px;
  .item {
    padding: 6px 8px;
  }
  .header {
    margin-bottom: 12px;
  }
  .notification {
    margin-top: 20px;
  }
`

const Item = styled.div`
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border-radius: 8px;
`

const Badge = styled.div`
  background: ${props => props.background};
  color: ${props => props.color || '#ffffff'}
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  border-radius: 4px;
  text-align: center;
  display: block;
  padding: 4px 0;
`

const GeneralBadge = styled(Col)`
  > div {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: ${props => props.background};
    color: ${props => props.color || '#ffffff'};
    img {
      width: 90px;
      height: 90px;
    }
    .count {
      width: 100%;
      text-align: center;
      flex-direction: column;
    }
  }
`

const HeaderRight = styled.div`
  display: flex;
  > div:first-child {
    margin-right: 10px;
  }
  img {
    cursor: pointer;
  }
`

const Text = styled.div`
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || 'normal'};
  margin: ${props => props.margin};
`

const Title = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.85);
`

const bgColors = ['#A4A6B5', '#E54C3C', '#EDC30F', '#2CCA73']

function i18n() {
  return {
    total: total => t('dashboard.total', { total }),
    disconnected: t('dashboard.status.disconnected'),
    exceeded: t('dashboard.status.exceeded'),
    exceededPreparing: t('dashboard.status.exceededPreparing'),
    good: t('dashboard.status.good'),
    newNotification: t('dashboard.newNotification'),
    maintenance: t('monitoring.deviceStatus.maintenance'),
    sensorError: t('monitoring.deviceStatus.sensorError'),
    goodDevice: t('monitoring.deviceStatus.good'),
  }
}

@connectAutoDispatch(state => ({
  stationAuto: state.stationAuto.list,
}))
class Dashboard extends Component {
  state = {
    dashboardInfo: {},
  }

  async componentDidMount() {
    this.getDashboardInfo()
  }

  onFilter = async params => {
    this.getDashboardInfo(params)
  }

  getDashboardInfo = async (params = {}) => {
    const result = await getDashboardInfo(params)
    this.setState({ dashboardInfo: result })
  }

  render() {
    const { stationAuto } = this.props
    const { dashboardInfo } = this.state
    const stationType = (dashboardInfo.stationType || []).map(item => ({
      name: item.name,
      total: item.total,
      values: [item.lossData, item.exceed, item.exceedPreparing, item.good],
    }))

    return (
      <Container>
        <Row
          type="flex"
          justify="space-between"
          align="middle"
          className="header"
        >
          <Col>
            <Text fontSize={20} fontWeight={700} margin="0 0 10px">
              {i18n().total(dashboardInfo.total || 0)}
            </Text>
          </Col>
          <Col>
            <HeaderRight>
              <Filter onChange={this.onFilter} />
              <Dropdown overlay={<Helper />} placement="bottomRight">
                <img src={iconHelper} alt="" />
              </Dropdown>
            </HeaderRight>
          </Col>
        </Row>
        <Row gutter={16}>
          {[
            {
              count: dashboardInfo.lossData || 0,
              icon: <img src={iconDisconnected} alt="" />,
              status: i18n().disconnected,
            },
            {
              count: dashboardInfo.exceed || 0,
              icon: <img src={iconExceed} alt="" />,
              status: i18n().exceeded,
            },
            {
              count: dashboardInfo.exceedPreparing || 0,
              icon: <img src={iconTendToExceed} alt="" />,
              status: i18n().exceededPreparing,
            },
            {
              count: dashboardInfo.good || 0,
              icon: <img src={iconGood} alt="" />,
              status: i18n().good,
            },
          ].map((item, idx) => (
            <GeneralBadge key={idx} background={bgColors[idx]} span={6}>
              <div>
                {item.icon}
                <div className="count">
                  <Text fontSize={38} fontWeight={600}>
                    {item.count}
                  </Text>
                  <Text fontSize={18} fontWeight={600}>
                    {item.status}
                  </Text>
                </div>
              </div>
            </GeneralBadge>
          ))}
        </Row>
        <Row gutter={[12, 16]}>
          {stationType.map(item => (
            <Col key={item.name} span={12} className="item">
              <Item>
                <Title>
                  <Text fontSize={16} fontWeight="600">
                    {item.name}
                  </Text>
                  <Text fontSize={16}>{item.total}</Text>
                </Title>
                <Row gutter={8}>
                  {(item.values || []).map((value, idx) => (
                    <Col span={6} key={idx}>
                      <Badge background={bgColors[idx]}>{value}</Badge>
                    </Col>
                  ))}
                </Row>
              </Item>
            </Col>
          ))}
        </Row>
        <Row className="notification">
          <Text fontSize={20} fontWeight={700} margin="0 0 10px">
            {i18n().newNotification}
          </Text>
          {stationAuto.length > 0 ? (
            <NotificationContent useWindow inline />
          ) : null}
        </Row>
      </Container>
    )
  }
}

export default Dashboard
