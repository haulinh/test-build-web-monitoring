import { Button, Modal, Row } from 'antd'
import React from 'react'

class ModalConfirmDelete extends React.Component {
  render() {
    const { onCancelOut, onConfirmCancel, ...otherProps } = this.props

    return (
      <Modal
        title="Hủy tạo mới"
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelOut}>
              Tiếp tục tạo
            </Button>
            <Button
              key="submit"
              type="danger"
              onClick={onConfirmCancel}
              style={{ marginLeft: 10 }}
            >
              Đóng
            </Button>
          </Row>,
        ]}
      >
        <div>
          Bộ lọc dữ liệu chưa được tạo. Nếu đóng cửa sổ, dữ liệu bộ lọc đã nhập
          sẽ không được lưu lại
        </div>
      </Modal>
    )
  }
}

export default ModalConfirmDelete
