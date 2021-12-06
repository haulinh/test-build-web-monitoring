import { Button, Modal, Row } from 'antd'
import React from 'react'

class ModalConfirmCancel extends React.Component {
  render() {
    const { onCancelOut, onConfirmCancel, type, ...otherProps } = this.props

    const message = {
      create:
        'Bộ lọc dữ liệu chưa được tạo. Nếu đóng cửa sổ, dữ liệu bộ lọc đã nhập sẽ không được lưu lại',
      edit:
        'Bộ lọc dữ liệu chưa được lưu. Nếu đóng cửa sổ, những chỉnh sửa bộ lọc đã nhập sẽ không được lưu lại',
    }

    return (
      <Modal
        title={type === 'create' ? 'Hủy tạo mới' : 'Hủy chỉnh sửa'}
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelOut}>
              {type === 'create' ? 'Tiếp tục tạo' : 'Tiếp tục chỉnh sửa'}
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
        <div>{message[type]}</div>
      </Modal>
    )
  }
}

export default ModalConfirmCancel
