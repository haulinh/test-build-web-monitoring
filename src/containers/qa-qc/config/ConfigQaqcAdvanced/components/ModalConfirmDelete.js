import { Button, Modal, Row } from 'antd'
import React from 'react'

class ModalConfirmDelete extends React.Component {
  render() {
    const { onCancelDelete, onConfirmDelete, ...otherProps } = this.props

    return (
      <Modal
        title="Xác nhận xóa bộ lọc"
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelDelete}>
              Hủy bỏ
            </Button>
            <Button
              key="submit"
              type="danger"
              onClick={onConfirmDelete}
              style={{ marginLeft: 10 }}
            >
              Xóa bộ lọc
            </Button>
          </Row>,
        ]}
      >
        <div>
          Hãy chắc chắn xóa bộ lọc dữ liệu, tất cả dữ liệu của báo cáo, thống kê
          sẽ không còn áp dụng bộ lọc để tính toán
        </div>
      </Modal>
    )
  }
}

export default ModalConfirmDelete
