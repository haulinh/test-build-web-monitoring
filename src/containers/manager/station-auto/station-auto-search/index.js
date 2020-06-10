import React from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Form, Input, Button, Icon, Modal } from 'antd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import slug from 'constants/slug'
import SelectStationType from 'components/elements/select-station-type'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import ROLE from 'constants/role'
import { EMAIL, PHONE } from 'constants/info-contact.js'

const i18n = {
  okText: translate('addon.ok'),
  addButton: translate('stationAutoManager.create.label'),
  stationType: translate('stationAutoManager.form.stationType.placeholder'),
  stationName: translate('stationAutoManager.form.name.placeholder'),
  title: translate('stationAutoManager.limit.station.title'),
  callAction: translate('stationAutoManager.limit.station.callAction'),
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  background-color: #f1f1f1;
  border-radius: 4px;
`

const Desc = styled.div`
  color: gray;
  font-size: 15px;
  margin-bottom: 32px;
`

const Heading = styled.h3`
  color: #5c89ff;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 24px;
`

const Title = styled.h2`
  color: #000;
`

const Wrapper = styled.div`
  > div + div {
    margin-top: 8px;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`

const Label = styled.label`
  font-size: 17px;
  color: #000;
  font-weight: 500;
  flex: 2;
  margin: 0;
`

const Content = styled.span`
  font-size: 16px;
  color: #005eff;
  font-weight: 300;
  flex: 3;
  margin: 0;
`

const BtnAdd = props => (
  <Button onClick={props.onClick} type="primary">
    <Icon type="plus" />
    {i18n.addButton}
  </Button>
)

@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@connect(state => ({
  packageInfo: state.auth.userInfo.organization.packageInfo,
}))
@autobind
@withRouter
export default class StationAutoSearchForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes,
    stationLength: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  changeSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const data = {}
      if (values.address) data.address = values.address
      if (values.name) data.name = values.name
      if (values.stationType && values.stationType !== 'ALL')
        data.stationType = values.stationType

      // Callback submit form Container Component
      this.setState({ dataSearch: data }, () => this.props.onChangeSearch(data))
    })
  }

  handleAddStationAuto = () => {
    if (this.props.packageInfo.totalStation <= this.props.stationLength) {
      Modal.warning({
        icon: null,
        width: '50%',
        title: <Title>{i18n.title}</Title>,
        okText: i18n.okText,
        content: (
          <Container>
            <Desc>
              {translate('stationAutoManager.limit.station.content', {
                totalStation: this.props.packageInfo.totalStation,
              })}
            </Desc>
            <ContentWrapper>
              <Heading>{i18n.callAction}</Heading>
              <Wrapper>
                <Flex>
                  <Label>{translate('contact.phone')}</Label>
                  <Content>{PHONE}</Content>
                </Flex>
                <Flex>
                  <Label>{translate('contact.email')}</Label>
                  <Content>{EMAIL}</Content>
                </Flex>
              </Wrapper>
            </ContentWrapper>
          </Container>
        ),
        onCancel() {},
      })
    } else {
      this.props.history.push(slug.stationAuto.create)
    }
  }

  changeStationType(stationType) {}

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Row type="flex" align="middle" justify="center">
        <Col span={24}>
          <Form
            className="fadeIn animated"
            onSubmit={this.changeSearch}
            style={{ width: '100%' }}
          >
            <Row gutter={16}>
              {/* CHỌN LOẠI TRẠM */}
              <Col span={10}>
                {getFieldDecorator(`stationType`)(
                  <SelectStationType
                    classNane="select-form-auto"
                    getFieldDecorator={getFieldDecorator}
                    isShowAll
                    // onChangeStationType={this.changeStationType}
                    placeholder={i18n.stationType}
                  />
                )}
              </Col>

              {/* NHẬP TÊN TRẠM */}
              <Col span={10}>
                {getFieldDecorator(`name`)(
                  <Input placeholder={i18n.stationName} />
                )}
              </Col>

              {/* BUTTON SEARCH */}
              <Col span={1} style={{ textAlign: 'center' }}>
                <Button shape="circle" htmlType="submit">
                  <Icon type="search" />
                </Button>
              </Col>

              {/* BUTTON */}
              {protectRole(ROLE.STATION_AUTO.CREATE)(
                <Col span={3} style={{ textAlign: 'center' }}>
                  <BtnAdd onClick={this.handleAddStationAuto} />
                </Col>
              )}
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}
