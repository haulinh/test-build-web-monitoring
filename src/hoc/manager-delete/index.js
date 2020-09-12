import React from 'react'
import { autobind } from 'core-decorators'
import { Modal, message } from 'antd'
import { translate } from 'hoc/create-lang'

const i18n = {
  cancelText: translate('addon.cancel'),
  okText: translate('addon.ok'),
  deleteConfirmMsg: translate('confirm.msg.delete'),
}
/**
 * Manager list data
 * @param apiList
 * @param apiDelete
 */
const createManagerDelete = ({ apiDelete }) => Component => {
  @autobind
  class ManagerDeleteHoc extends React.Component {
    confirmDelete(apiDelete, key, callbackSuccess = () => {}) {
      Modal.confirm({
        title: i18n.deleteConfirmMsg,
        okText: i18n.okText,
        cancelText: i18n.cancelText,
        onOk() {
          return new Promise(async (resolve, reject) => {
            const res = await apiDelete(key)
            if (res.success) {
              message.success(translate('addon.onDelete.success'))
              callbackSuccess()
            } else if (
              res.error &&
              res.message &&
              res.message === 'QCVN_USED'
            ) {
              message.error(translate('addon.onDelete.qcvn.qcvnUsed'))
            } else {
              message.error(translate('addon.onDelete.error'))
            }
            resolve()
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }
    /**
     * Xóa delete item
     * @param key
     * @returns {Promise.<void>}
     */
    async deleteItem(key, callback) {
      this.confirmDelete(apiDelete, key, () => {
        if (callback) callback()
      })
    }
    render() {
      // Truyền các tham số cho Component con (props)
      const props = {
        onDeleteItem: this.deleteItem,
        onRemoveItem: this.deleteItem,
      }
      return <Component {...this.props} {...props} />
    }
  }
  return ManagerDeleteHoc
}

export default createManagerDelete
