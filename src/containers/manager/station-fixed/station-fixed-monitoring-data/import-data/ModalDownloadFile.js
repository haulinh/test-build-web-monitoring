import React, { Component } from 'react'
import { Modal } from 'antd'

export default class ModalDownloadFile extends Component {
  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        title="Thiết lập mẫu Báo cáo tải xuống"
        centered
        closable
        onCancel={onCancel}
        visible={visible}
      >
        ModalDownloadFile
      </Modal>
    )
  }
}
