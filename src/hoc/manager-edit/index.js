import React from 'react'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import * as _ from 'lodash'
const createManagerEdit = ({ apiUpdate, apiGetByKey }) => Component => {
  @createLanguage
  @autobind
  class ManagerEditHoc extends React.Component {
    state = {
      isLoaded: false,
      data: {},
      success: false,
      isUpdating: false,
    }
    static propTypes = {
      lang: langPropTypes,
    }
    async updateItem(data) {
      const key = this.props.match.params.key
      this.setState({ isUpdating: true }, async () => {
        const res = await apiUpdate(key, data)
        this.setState({ isUpdating: false })
        if (res.success) {
          // khi update thi cập nhật dữ liệu mới nhất từ data
          this.setState({
            data: _.get(res, 'data', null),
          })
          message.success(this.props.lang.t('addon.onSave.update.success'))
        } else message.error(this.props.lang.t('addon.onSave.update.error'))
      })
    }

    //Su kien truoc khi component duoc tao ra
    async getItem() {
      const key = this.props.match.params.key
      const item = await apiGetByKey(key)

      if (item.success)
        this.setState({
          isLoaded: true,
          data: item.data,
          success: item.success,
        })
      else this.setState({ isLoaded: true, message: item.message })
    }

    render() {
      const props = {
        isLoaded: this.state.isLoaded,
        data: this.state.data,
        onUpdateItem: this.updateItem,
        getItem: this.getItem,
        success: this.state.success,
        isUpdating: this.state.isUpdating,
      }
      return <Component {...this.props} {...props} />
    }
  }
  return ManagerEditHoc
}
export default createManagerEdit
