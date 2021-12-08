import { Button, Modal, Row } from 'antd'
import React from 'react'
import { i18n } from './index'

class ModalConfirmCancel extends React.Component {
  render() {
    const { onCancelOut, onConfirmCancel, type, ...otherProps } = this.props

    const message = {
      create: i18n().modal.cancel.create.message,
      edit: i18n().modal.cancel.edit.message,
    }

    return (
      <Modal
        title={
          type === 'create'
            ? i18n().modal.cancel.create.title
            : i18n().modal.cancel.edit.title
        }
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelOut}>
              {type === 'create'
                ? i18n().button.continueCreate
                : i18n().button.continueEdit}
            </Button>
            <Button
              key="submit"
              type="danger"
              onClick={onConfirmCancel}
              style={{ marginLeft: 10 }}
            >
              {i18n().button.close}
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
