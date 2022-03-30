import { Button, Modal, Row } from 'antd'
import React from 'react'
import { i18n } from '../constants'

class ModalConfirmCancel extends React.Component {
  render() {
    const { onCancelOut, onConfirmCancel, type, ...otherProps } = this.props

    return (
      <Modal
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelOut}>
              {i18n().button.cancel}
            </Button>
            <Button
              key="submit"
              type="danger"
              onClick={onConfirmCancel}
              style={{ marginLeft: 10 }}
            >
              {i18n().button.accept}
            </Button>
          </Row>,
        ]}
      >
        <div>{i18n().modalConfirmCancel.content}</div>
      </Modal>
    )
  }
}

export default ModalConfirmCancel
