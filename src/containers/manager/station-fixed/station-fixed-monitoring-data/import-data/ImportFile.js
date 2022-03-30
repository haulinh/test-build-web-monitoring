import { Button, Icon, Row, Upload } from 'antd'
import { Clearfix } from 'components/elements'
import _ from 'lodash'
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

  .ant-upload-list-item-info {
    display: none;
  }

  .ant-upload-list-item {
    max-height: 0;
  }
`

const { Dragger } = Upload

export default class ImportFile extends Component {
  render() {
    const { file } = this.props

    return (
      <ImportContainer>
        <Clearfix height={30} />

        <Dragger
          {...this.props}
          accept=".xlsx"
          name="fileUpload"
          style={{ width: '600px' }}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Kéo & Thả tệp của bạn vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ cho tệp Xlsx</p>
          <p style={{ marginTop: '10px' }}>
            {_.get(file, 'name') ? file.name : null}
          </p>
        </Dragger>

        {/* <Clearfix height={20} /> */}
      </ImportContainer>
    )
  }
}
