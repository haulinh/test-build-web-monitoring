import {
  Button, Modal, Row
} from 'antd'
import React from 'react'

class ModalConfirm extends React.Component {

  render() {
    const { isVisible } = this.props

    return (
      <Modal
        title="Xác nhận xóa bộ lọc"
        visible={isVisible}
        width={554}
        centered
        footer={[
          <Row type="flex" justify="end">
            <Button key="back">Hủy bỏ</Button>
            <Button key="submit" type="danger">
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

export default ModalConfirm
