import React from 'react'
import { Row, Col, Drawer, Button, Icon, Divider } from 'antd'
import slug from 'constants/slug'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { getStationAuto } from 'api/StationAuto'

const i18n = {
  title: translate('stationAutoManager.infoStation.title'),
  edit: translate('stationAutoManager.infoStation.edit'),
  career: translate('stationAutoManager.infoStation.career'),
  empty: translate('stationAutoManager.infoStation.emptyText')
}

const TextColor = styled.p`
  font-size: 20px;
  color: #1890ff;
  margin: 0;
  line-height: normal;
`

const Text = styled.p`
  font-size: 20px;
  margin: 0;
  line-height: normal;
`

const Title = styled.h4``

const defaultChartType = 'hours'

const Wrapper = styled(Row)`
  padding: 12px 0 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const WrapperItem = styled(Col)`
  > p + p {
    margin-top: 12px;
  }
`

const InfoItem = ({ iconType, label, desc }) => (
  <Wrapper>
    <WrapperItem span={6}>
      <Icon
        style={{ fontSize: '26px', color: '#1890ff' }}
        type={iconType}
        theme="outlined"
      />
    </WrapperItem>
    <WrapperItem span={18}>
      {!label && !desc && <Text>Không có dữ liệu</Text>}
      {label && <Text>{label}</Text>}
      {desc && <TextColor>{desc}</TextColor>}
    </WrapperItem>
  </Wrapper>
)

export default class DrawerInfoStation extends React.Component {
  state = {
    isLoadingInfoStation: true,
    InfoStationData: {},
    chartType: '',
    visibleDrawer: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true })

    const res = await getStationAuto(this.props._id)
    if (res.success) {
      this.setState({
        isLoadingInfoStation: false,
        InfoStationData: res.data,
        chartType: defaultChartType
      })
    }
  }

  render() {
    const { onClose, visibleDrawer, _id } = this.props
    const {
      address,
      userResponsible,
      phoneResponsible,
      userSupervisor,
      phoneSupervisor,
      website,
      career
    } = this.state.InfoStationData
    return (
      <Drawer
        width={480}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleDrawer}
      >
        <Wrapper>
          <WrapperItem span={16}>
            <Title>{i18n.title}</Title>
          </WrapperItem>
          <WrapperItem span={8}>
            <Button
              target="_blank"
              href={slug.stationAuto.editWithKey + '/' + _id}
            >
              <Icon
                style={{ fontSize: '16px', color: '#1890ff' }}
                type="edit"
                theme="outlined"
              />
              {i18n.edit}
            </Button>
          </WrapperItem>
        </Wrapper>
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType="environment" desc={address} />
        {/* <Row>
          <Col span={6}>
            <Icon
              style={{ fontSize: "26px", color: "#1890ff" }}
              type="environment"
              theme="outlined"
            />
          </Col>
          <Col span={18}>
            <TextColor>{address}</TextColor>
          </Col>
        </Row> */}
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType="team"
          label={userResponsible}
          desc={phoneResponsible}
        />

        {/* <Row>
          <Col span={6}>
            <Icon
              style={{ fontSize: "26px", color: "#1890ff" }}
              type="team"
              theme="outlined"
            />
          </Col>
          <Col span={18}>
            <Row>
              <Text>{userResponsible}</Text>
              <TextColor>{phoneResponsible}</TextColor>
            </Row>
          </Col>
        </Row> */}
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType="user"
          label={userSupervisor}
          desc={phoneSupervisor}
        />
        {/* <Row>
          <Col span={6}>
            <Icon
              style={{ fontSize: "26px", color: "#1890ff" }}
              type="user"
              theme="outlined"
            />
          </Col>
          <Col span={18}>
            <Row>
              <Text>{userSupervisor}</Text>
              <TextColor>{phoneSupervisor}</TextColor>
            </Row>
          </Col>
        </Row> */}
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType="global" label={website} />
        {/* <Row>
          <Col span={6}>
            <Icon
              style={{ fontSize: "26px", color: "#1890ff" }}
              type="global"
              theme="outlined"
            />
          </Col>
          <Col span={18}>
            <Text>{website}</Text>
          </Col>
        </Row> */}
        <Divider style={{ margin: 0 }} />
        <Wrapper>
          <WrapperItem span={24}>
            <Text>{i18n.career}</Text>
          </WrapperItem>
        </Wrapper>
        <Wrapper>
          <WrapperItem span={24}>
            <Text>{career}</Text>
          </WrapperItem>
        </Wrapper>
      </Drawer>
    )
  }
}
