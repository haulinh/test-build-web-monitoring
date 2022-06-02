import { Col, Row, Dropdown } from 'antd'
import React, { Component } from 'react'
import styled from 'styled-components'
import { get as _get } from 'lodash'

import createLanguageHoc, { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import { getDashboardInfo } from 'api/StationAuto'
import { warningLevels } from 'constants/warningLevels'
import { getConfigColor } from 'constants/stationStatus'
import NotificationContent from 'layout/navigation-layout/NotificationDrawer/notificationContent'

import iconDisconnected from 'assets/svg-icons/stationAuto/Disconnected.svg'
import iconExceed from 'assets/svg-icons/stationAuto/Exceeded.svg'
import iconGood from 'assets/svg-icons/stationAuto/Good.svg'
import iconTendToExceed from 'assets/svg-icons/stationAuto/Tend-To-Exceed.svg'
import iconHelper from 'assets/svg-icons/question-circle.svg'

import Helper from './helper'
import Filter from './filter'
import { getContent } from 'components/language/language-content'

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
  color: ${props => props.color};
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
    total: total => translate('dashboard.total', { total }),
    newNotification: translate('dashboard.newNotification'),
    maintenance: translate('monitoring.deviceStatus.maintenance'),
    sensorError: translate('monitoring.deviceStatus.sensorError'),
    goodDevice: translate('monitoring.deviceStatus.good'),
  }
}
@connectAutoDispatch(state => ({
  stationAuto: state.stationAuto.list,
  languageContents: state.language.languageContents,
  colorData: _get(state, 'config.color.warningLevel.data.value', []),
}))
@createLanguageHoc
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
  // disconnected: translate('page.config.color.DATA_LOSS'),
  //   exceeded: translate('page.config.color.EXCEEDED'),
  //   exceededPreparing: translate('page.config.color.EXCEEDED_PREPARING'),
  //   good: translate('page.config.color.GOOD'),

  render() {
    const { stationAuto, languageContents, colorData } = this.props
    const { dashboardInfo } = this.state
    const { t } = this.props.lang
    const stationType = (dashboardInfo.stationType || []).map(item => ({
      _id: item._id,
      name: item.name,
      total: item.total,
      values: [
        {
          key: warningLevels.LOSS,
          count: item.lossData,
        },
        {
          key: warningLevels.EXCEEDED,
          count: item.exceed,
        },
        {
          key: warningLevels.EXCEEDED_PREPARING,
          count: item.exceedPreparing,
        },
        {
          key: warningLevels.GOOD,
          count: item.good,
        },
      ],
    }))

    const blockStation = [
      {
        count: dashboardInfo.lossData || 0,
        icon: <img src={iconDisconnected} alt="" />,
        status: t(`page.config.color.${warningLevels.LOSS}`),
        key: warningLevels.LOSS,
      },
      {
        count: dashboardInfo.exceed || 0,
        icon: <img src={iconExceed} alt="" />,
        status: t(`page.config.color.${warningLevels.EXCEEDED}`),
        key: warningLevels.EXCEEDED,
      },
      {
        count: dashboardInfo.exceedPreparing || 0,
        icon: <img src={iconTendToExceed} alt="" />,
        status: t(`page.config.color.${warningLevels.EXCEEDED_PREPARING}`),
        key: warningLevels.EXCEEDED_PREPARING,
      },
      {
        count: dashboardInfo.good || 0,
        icon: <img src={iconGood} alt="" />,
        status: t(`page.config.color.${warningLevels.GOOD}`),
        key: warningLevels.GOOD,
      },
    ]

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
          {blockStation.map((item, idx) => {
            const configColor = getConfigColor(colorData, item.key, {
              defaultPrimary: bgColors[idx],
              defaultSecond: '#ffffff',
            })

            return (
              <GeneralBadge
                key={idx}
                background={configColor.primaryColor}
                span={6}
              >
                <div>
                  {item.icon}
                  <div className="count">
                    <Text
                      fontSize={38}
                      fontWeight={600}
                      color={configColor.secondColor}
                    >
                      {item.count}
                    </Text>
                    <Text
                      fontSize={18}
                      fontWeight={600}
                      color={configColor.secondColor}
                    >
                      {item.status}
                    </Text>
                  </div>
                </div>
              </GeneralBadge>
            )
          })}
        </Row>
        <Row gutter={[12, 16]}>
          {stationType.map(item => {
            return (
              <Col key={item.name} span={12} className="item">
                <Item>
                  <Title>
                    <Text fontSize={16} fontWeight="600">
                      {getContent(languageContents, {
                        type: 'StationType',
                        itemId: item._id,
                        value: item.name,
                        field: 'name',
                      })}
                    </Text>
                    <Text fontSize={16}>{item.total}</Text>
                  </Title>
                  <Row gutter={8}>
                    {(item.values || []).map((objectLv2, idx) => {
                      const configColor = getConfigColor(
                        colorData,
                        objectLv2.key,
                        {
                          defaultPrimary: bgColors[idx],
                          defaultSecond: '#ffffff',
                        }
                      )
                      return (
                        <Col span={6} key={idx}>
                          <Badge
                            color={configColor.secondColor}
                            background={configColor.primaryColor}
                          >
                            {objectLv2.count}
                          </Badge>
                        </Col>
                      )
                    })}
                  </Row>
                </Item>
              </Col>
            )
          })}
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
