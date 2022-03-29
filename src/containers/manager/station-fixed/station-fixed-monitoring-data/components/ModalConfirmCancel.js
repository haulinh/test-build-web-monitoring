import { Button, Modal, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'

const ModalCancel = styled.div`
  .ant-modal-footer {
    border: unset;
  }
`

class ModalConfirmCancel extends React.Component {
  render() {
    const { onCancelOut, onConfirmCancel, type, ...otherProps } = this.props

    return (
      <ModalCancel>
        <Modal
          width={554}
          centered
          {...otherProps}
          footer={[
            <Row type="flex" justify="end">
              <Button key="back" onClick={onCancelOut}>
                Hủy
              </Button>
              <Button
                key="submit"
                type="danger"
                onClick={onConfirmCancel}
                style={{ marginLeft: 10 }}
              >
                Đồng ý
              </Button>
            </Row>,
          ]}
        >
          <div>Những thay đổi bạn đã thực hiện, có thể sẽ không được lưu.</div>
        </Modal>
      </ModalCancel>
    )
  }
}

export default ModalConfirmCancel
