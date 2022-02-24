import { Row, Col, Button, Upload, message } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationFixesDriverApi from 'api/station-fixed/StationFixesDriver'

import React from 'react'
import styled from 'styled-components'

import HistoryTab from './HistoryTab'
import { translate as t } from 'hoc/create-lang'

import Breadcrumb from '../breadcrumb'

function i18n() {
  return {
    success: t('stationFixedDriver.success'),
    error: t('stationFixedDriver.error'),
  }
}

const Container = styled.div`
  padding-top: 16px;
  height: 80vh;
`
const UploadWrapper = styled.div`
  .ant-upload-list {
    display: none;
  }
`
// @protectRole(ROLE.PERIODICAL_IMPORT_DATA.VIEW)
export default class stationFixedDrive extends React.Component {
  state = {
    isLoading: false,
  }

  onChangeFile = async ({ file }) => {
    try {
      this.setState({
        isLoading: true,
      })
      const formData = new FormData()
      formData.append('file', file)

      const result = await StationFixesDriverApi.uploadDriver(formData)
      if (result) {
        message.success(i18n().success)
      } else {
        message.error(i18n().error)
      }
    } catch (ex) {
      message.error(i18n().error)
    } finally {
      this.setState({
        isLoading: false,
      })
    }
  }

  buttonAdd() {
    return (
      <UploadWrapper>
        <Row type="flex" gutter={10}>
          <Col>
            <Upload beforeUpload={() => false} onChange={this.onChangeFile}>
              <Button
                loading={this.state.isLoading}
                icon={'upload'}
                type="primary"
              >
                Tải File
              </Button>
            </Upload>
          </Col>
        </Row>
      </UploadWrapper>
    )
  }

  render() {
    return (
      <PageContainer right={this.buttonAdd()}>
        <Breadcrumb items={['drive']} />
        <Container>{!this.state.isLoading && <HistoryTab />}</Container>
      </PageContainer>
    )
  }
}
