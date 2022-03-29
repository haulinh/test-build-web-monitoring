import { Button, Row, Icon, Upload, Col } from 'antd'
import { Clearfix } from 'components/elements'
import React, { Component } from 'react'
import styled from 'styled-components'

const ImportContainer = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-upload {
    border: 1px dashed #1890ff;
    background: unset;
  }
`

const { Dragger } = Upload

export default class ImportFile extends Component {
  render() {
    const { onChangeUpload } = this.props
    return (
      <ImportContainer>
        <Row
          type="flex"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            Tải xuống tệp tin mẫu để đưa hàng loạt thông tin dữ liệu lên hệ
            thống.
          </div>
          <Button type="link">
            <Row type="flex" align="middle" style={{ gap: '8px' }}>
              Tải xuống tệp mẫu
              <Icon type="download" />
            </Row>
          </Button>
        </Row>

        <Clearfix height={30} />

        <Dragger
          accept=".xlsx"
          name="file"
          style={{ width: '600px' }}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          onChange={onChangeUpload}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Kéo & Thả tệp của bạn vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ cho tệp Xlsx</p>
        </Dragger>

        <Clearfix height={30} />
      </ImportContainer>
    )
  }
}
