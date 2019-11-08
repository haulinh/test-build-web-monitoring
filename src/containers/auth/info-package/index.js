import React, { PureComponent } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
// import swal from "sweetalert2"
// import { translate } from "hoc/create-lang"
import PageContainer from "layout/default-sidebar-layout/PageContainer"
import { autobind } from "core-decorators"
import Breadcrumb from "containers/auth/breadcrumb"
import moment from "moment-timezone"
import { SHAPE } from "themes/color"
import { Row, Col, Typography, Skeleton } from "antd"
import StationAutoApi from "api/StationAuto"

import * as _ from "lodash"
import Clearfix from "components/elements/clearfix"
import { connect } from "react-redux"
import { DD_MM_YYYY } from "constants/format-date"
import { EMAIL, PHONE } from "constants/info-contact.js"

const { Title, Text } = Typography

const InfoLicenseWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  .info--package__col {
    .info--package__col__title {
    }
    .info--package__col__content {
      padding-left: 8px;
      line-height: 2rem;
      .info--package__col__content--padding {
        float: left;
        width: 200px;
      }
    }
  }
`

@connect(state => ({
  organization: _.get(state, "auth.userInfo.organization", {})
}))
@autobind
export class InfoLicenseForm extends PureComponent {
  static propTypes = {
    organization: PropTypes.object
  }

  state = {
    isLoading: true,
    totalStation: 0
  }

  componentWillMount() {
    try {
      this.getStationCount()
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  async getStationCount() {
    const record = await StationAutoApi.getTotalCount()
    if (record.success) {
      this.setState({
        totalStation: record.data
      })
    }
  }

  render() {
    const { organization } = this.props
    const { totalStation } = this.state
    let dateCreate, dateExp, totalDays, limitTotalStation
    if (organization) {
      const createdAt = _.get(organization, "createdAt")
        ? moment(_.get(organization, "createdAt"))
        : ""
      const expirationDate = _.get(organization, "license.expirationDate")
        ? moment(_.get(organization, "license.expirationDate"))
        : ""

      if (expirationDate) {
        totalDays = moment(expirationDate).diff(moment(), "days")
        dateExp = expirationDate.format(DD_MM_YYYY)
      }
      dateCreate = createdAt.format(DD_MM_YYYY)

      limitTotalStation = _.get(organization, "license.totalStation", "")
    }
    return (
      <InfoLicenseWrapper>
        {this.state.isLoading && <Skeleton avatar paragraph={{ rows: 4 }} />}
        {!this.state.isLoading && (
          <div>
            <Row gutter={8}>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}>Thời gian đăng ký</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Ngày tạo tổ chức
                    </Text>
                    <Text disabled>{dateCreate}</Text>
                    <br />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Ngày hết hạn
                    </Text>
                    <Text disabled>{dateExp}</Text>
                    <br />
                    {totalDays && (
                      <Text
                        type="warning"
                        style={{
                          color: SHAPE.PRIMARY
                        }}
                      >
                        {`Bạn còn ${totalDays} ngày để sử dụng sản phẩm`}
                      </Text>
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}>Số lượng tối đa để sử dụng</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Số lượng trạm sử dụng
                    </Text>
                    <Text disabled>{totalStation}</Text>
                    <Clearfix height={8} />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Số lượng tối đa
                    </Text>
                    <Text disabled>{limitTotalStation}</Text>
                  </div>
                </div>
              </Col>
            </Row>
            <Clearfix height={16} />
            <Row gutter={8}>
              <Col span={12}>
                <div className="info--package__col">
                  <div className="info--package__col__title">
                    <Title level={4}>Hỗ trợ, gia hạn sử dụng</Title>
                  </div>
                  <div className="info--package__col__content">
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Số điện thoại
                    </Text>
                    <Text
                      style={{
                        color: SHAPE.PRIMARY
                      }}
                    >
                      {PHONE}
                    </Text>
                    <Clearfix height={8} />
                    <Text
                      strong
                      className="info--package__col__content--padding"
                    >
                      Email
                    </Text>
                    <Text
                      style={{
                        color: SHAPE.PRIMARY
                      }}
                    >
                      {EMAIL}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </InfoLicenseWrapper>
    )
  }
}

@autobind
export default class ProfileUser extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      isLoaded: false
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={["infoLicense"]} />
        <InfoLicenseForm />
      </PageContainer>
    )
  }
}
