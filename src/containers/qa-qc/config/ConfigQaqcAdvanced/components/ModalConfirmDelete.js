import { Button, Modal, Row } from 'antd'
import React from 'react'
import { i18n } from './index'

class ModalConfirmDelete extends React.Component {
  render() {
    const { onCancelDelete, onConfirmDelete, ...otherProps } = this.props

    return (
      <Modal
        title={i18n().modal.delete.title}
        width={554}
        centered
        {...otherProps}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back" onClick={onCancelDelete}>
              {i18n().button.cancel}
            </Button>
            <Button
              key="submit"
              type="danger"
              onClick={onConfirmDelete}
              style={{ marginLeft: 10 }}
            >
              {i18n().button.delete}
            </Button>
          </Row>,
        ]}
      >
        <div>{i18n().modal.delete.message}</div>
      </Modal>
    )
  }
}

export default ModalConfirmDelete
