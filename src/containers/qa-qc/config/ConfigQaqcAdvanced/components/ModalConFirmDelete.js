import React, { Component } from 'react'
import { Modal, Row, Button } from 'antd'
import { Clearfix } from 'components/layouts/styles'

export default class ModalConFirmDelete extends Component {
  render() {
    const { onCancelDelete, onConfirmDelete } = this.props

    return (
      <Modal centered {...this.props}>
        <h5>Xác nhận xoá bộ lọc</h5>
        <div>
          Hãy chắc chắn xóa bộ lọc dữ liệu, tất cả dữ liệu của báo cáo, thống kê
          sẽ không còn áp dụng bộ lọc để tính toán.
        </div>
        <Clearfix height={10} />
        <Row type="flex" justify="end">
          <Button onClick={onCancelDelete}>Huỷ bỏ</Button>
          <Button
            type="danger"
            onClick={onConfirmDelete}
            style={{ marginLeft: 10 }}
          >
            Xoá bộ lọc
          </Button>
        </Row>
      </Modal>
    )
  }
}
