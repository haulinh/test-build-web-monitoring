import React from 'react'
import { Row, Col, Button, Icon, Divider } from 'antd'
import slug from 'constants/slug'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { getStationAuto } from 'api/StationAuto'

function i18n() {
  return {
    title: translate('stationAutoManager.infoStation.title'),
    edit: translate('stationAutoManager.infoStation.edit'),
    career: translate('stationAutoManager.infoStation.career'),
    empty: translate('stationAutoManager.infoStation.emptyText'),
    yearOperate: translate('stationAutoManager.infoStation.yearOperate'),
    capacity: translate('stationAutoManager.infoStation.capacity'),
    processProduction: translate(
      'stationAutoManager.infoStation.processProduction'
    ),
    userResponsible: translate(
      'stationAutoManager.infoStation.userResponsible'
    ),
    userSupervisor: translate('stationAutoManager.infoStation.userSupervisor'),
    material: translate('stationAutoManager.infoStation.material'),
    website: translate('stationAutoManager.infoStation.website'),
  }
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const InfoItem = ({ iconType, label, desc, title }) => (
  <Wrapper type="flex" justify="space-between">
    <WrapperItem span={!title ? 1 : 10}>
      <Flex>
        {iconType && (
          <Icon
            style={{
              fontSize: '26px',
              color: '#1890ff',
              marginRight: !title ? '0px' : '10px',
            }}
            type={iconType}
            theme="outlined"
          />
        )}
        {title && <Text>{title}</Text>}
      </Flex>
    </WrapperItem>
    <WrapperItem span={!title ? 23 : 8}>
      {!label && !desc && <Text>{i18n().empty}</Text>}
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
    visibleDrawer: false,
  }

  async componentDidMount() {
    this.setState({ isLoading: true })

    const res = await getStationAuto(this.props.stationID)
    if (res.success) {
      this.setState({
        isLoadingInfoStation: false,
        InfoStationData: res.data,
        chartType: defaultChartType,
      })
    }
  }

  getStrPhone = phone => {
    if (phone && typeof phone === 'object') {
      return phone.phoneNumber
    }
    return phone
  }

  render() {
    const { stationID } = this.props
    const {
      address,
      userResponsible,
      phoneResponsible,
      userSupervisor,
      phoneSupervisor,
      website,
      career,
      yearOperate,
      capacity,
      processProduction,
      material,
    } = this.state.InfoStationData
    return (
      <React.Fragment>
        <Wrapper>
          <WrapperItem span={8}>
            <Title>{i18n().title}</Title>
          </WrapperItem>
          <WrapperItem span={8} offset={8}>
            <Col span={4} offset={12}>
              <Button
                target="_blank"
                href={`${slug.stationAuto.editWithKey}/${stationID}?otherForm`}
              >
                <Icon
                  style={{ fontSize: '16px', color: '#1890ff' }}
                  type="edit"
                  theme="outlined"
                />
                {i18n().edit}
              </Button>
            </Col>
          </WrapperItem>
        </Wrapper>
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType="environment" desc={address} />
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType="team"
          label={userResponsible}
          desc={this.getStrPhone(phoneResponsible)}
          title={i18n().userResponsible}
        />
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType="user"
          label={userSupervisor}
          desc={this.getStrPhone(phoneSupervisor)}
          title={i18n().userSupervisor}
        />
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType="global" label={website} title={i18n().website} />
        <Divider style={{ margin: 0 }} />
        <InfoItem title={i18n().career} label={career} />
        <InfoItem title={i18n().yearOperate} label={yearOperate} />
        <InfoItem title={i18n().capacity} label={capacity} />
        <InfoItem title={i18n().processProduction} label={processProduction} />
        <InfoItem title={i18n().material} label={material} />
      </React.Fragment>
    )
  }
}
