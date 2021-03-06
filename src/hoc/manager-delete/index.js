import React from 'react'
import { autobind } from 'core-decorators'
import { Modal, message } from 'antd'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'

function i18n() {
  return {
    cancelText: translate('addon.cancel'),
    okText: translate('addon.ok'),
    deleteConfirmMsg: translate('confirm.msg.delete'),
  }
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
        title: i18n().deleteConfirmMsg,
        okText: i18n().okText,
        cancelText: i18n().cancelText,
        onOk() {
          return new Promise(async (resolve, reject) => {
            try {
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
              } else if (res.error) {
                message.error(
                  translate('addon.onDelete.errorMessage.reportUsed')
                )
              } else {
                message.success(translate('addon.onDelete.success'))
                callbackSuccess()
              }
              resolve()
            } catch (error) {
              const data = _.get(error, 'response.data', {})
              if (data.code === 'ROLE_IN_USE') {
                message.error(translate('addon.onDelete.errorMessage.roleUsed'))
              } else if (data.message === 'MEASURING_USED_STATION_AUTO') {
                message.error(
                  translate(
                    'addon.onDelete.errorMessage.measuringUsedStationAuto'
                  )
                )
              } else if (data.message === 'MEASURING_USED_STATION_FIX') {
                message.error(
                  translate(
                    'addon.onDelete.errorMessage.measuringUsedStationFix'
                  )
                )
              } else if (data.message === 'MEASURING_USED') {
                message.error(
                  translate('addon.onDelete.errorMessage.measuringUsed')
                )
              } else if (data.message === 'MEASURING_USED_AQI') {
                message.error(
                  translate('addon.onDelete.errorMessage.measuringUsedAqi')
                )
              } else if (data.message === 'MEASURING_USED_WQI') {
                message.error(
                  translate('addon.onDelete.errorMessage.measuringUsedWqi')
                )
              } else if (data.message === 'MEASURING_USED_QCVN') {
                message.error(
                  translate('addon.onDelete.errorMessage.measuringUsedQcvn')
                )
              } else if (data && data.error && data.error.message) {
                switch (data.error.message) {
                  case 'PHASE_USED': {
                    message.error(
                      translate('addon.onDelete.errorMessage.phaseUsed')
                    )
                    break
                  }
                  case 'POINT_USED': {
                    message.error(
                      translate('addon.onDelete.errorMessage.pointUsed')
                    )
                    break
                  }
                  case 'FORECAST_USED': {
                    message.error(
                      translate('addon.onDelete.errorMessage.stationUsed')
                    )
                    break
                  }
                  default: {
                    message.error(
                      translate('addon.onDelete.errorMessage.reportUsed')
                    )
                    break
                  }
                }
              } else {
                message.error(
                  translate('addon.onDelete.errorMessage.reportUsed')
                )
              }

              resolve()
            }
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }
    /**
     * X??a delete item
     * @param key
     * @returns {Promise.<void>}
     */
    async deleteItem(key, callback) {
      this.confirmDelete(apiDelete, key, () => {
        if (callback) callback()
      })
    }
    render() {
      // Truy???n c??c tham s??? cho Component con (props)
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
