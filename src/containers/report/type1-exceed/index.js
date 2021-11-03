import { Col, Form, Icon, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import ROLE from 'constants/role'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { translate as t } from 'hoc/create-lang'
import createProtectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import styled from 'styled-components'
import { downFileExcel } from 'utils/downFile'
import { getLanguage } from 'utils/localStorage'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'

const Text = styled.div`
  font-size: 16px;
  font-weight: 600px;
`
 
@Form.create()
export default class ReportExceed extends Component {
  state = {
    resultReport: {},
    loading: false,
  }

  getQueryParams = async () => {
    const { form } = this.props
    const values = await form.getFieldsValue()
    return values
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()
    console.log(params)
  }

  setResultReport = resultReport => {
    this.setState({ resultReport })
  }

  render() {
    const { form } = this.props
    const { loading, resultReport } = this.state

    return (
      <PageContainer>
        <Clearfix height={16} />
        <Breadcrumb items={['type1_exceed']} />
        <Search loading={loading} onSearch={this.handleOnSearch}>
          <BoxShadow>
            <Filter form={form} setResultReport={this.setResultReport} />
          </BoxShadow>
        </Search>
        <Clearfix height={32} />
        <Row type="flex" justify="end">
          <Row type="flex" justify="space-around" align="middle">
            <Col span={6}><Icon style={{paddingTop: '15px', fontSize: '22px', width: '50px', height: '50px' }} type="question-circle" /></Col>
            <Col span={16}><Text>Kiểm duyệt dữ liệu</Text></Col>
            <Col span={2}><Switch/></Col>
          </Row>
        </Row>
      </PageContainer>
    )
  }
}
