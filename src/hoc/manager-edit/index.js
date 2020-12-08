import React from 'react'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
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
      this.setState({ isUpdating: true })
      const res = await apiUpdate(key, data)
      this.setState({ isUpdating: false })
      // console.log(res, "---res--")
      if (res.success) {
        message.success(this.props.lang.t('addon.onSave.update.success'))
        return null
      } else if (res.error) {
        message.error(this.props.lang.t('addon.onSave.update.error'))
        return res
      } else {
        message.success(this.props.lang.t('addon.onSave.update.success'))
        return null
      }
    }

    //Su kien truoc khi component duoc tao ra
    async getItem() {
      const key = this.props.match.params.key
    await  apiGetByKey(key)
        .then(values => {
          if (values.success)
            this.setState({
              isLoaded: true,
              data: values.data,
              success: values.success,
            })
          else if (values.error) {
            this.setState({ isLoaded: true, message: values.message })
          } else {
            this.setState({
              isLoaded: true,
              data: values,
              success: true,
            })
          }
        })
        .catch(error => {
          console.log(error, '----error---')
        })
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
