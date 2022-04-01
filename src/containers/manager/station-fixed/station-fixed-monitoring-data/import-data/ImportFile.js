import { Icon, Upload } from 'antd'
import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { i18n } from '../constants'

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
        <Dragger
          {...this.props}
          accept=".xlsx"
          name="fileUpload"
          style={{ width: '600px' }}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">{i18n().importExcel.dragger.title}</p>
          <p className="ant-upload-hint">{i18n().importExcel.dragger.desc}</p>
          <p style={{ marginTop: '10px' }}>{_.get(file, 'name', '')}</p>
        </Dragger>
      </ImportContainer>
    )
  }
}
