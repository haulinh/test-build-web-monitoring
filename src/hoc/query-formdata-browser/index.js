import React from 'react'
import { autobind } from 'core-decorators'
import { isJsonString } from 'utils/string'
import { getParameterByName } from 'utils'

const createQueryFormDataBrowser = (queryParams = []) => Component => {
  // @withRouter
  @autobind
  class QueryFormDataBrowser extends React.Component {
    // NOTE: mục đích decode chuỗi query thành data Json để lấy initialValues
    // Input: truyền query với format: formData với chuỗi json đã đc encode
    getFormData() {
      const formDataStr = getParameterByName('formData')
      if (formDataStr)
        return isJsonString(formDataStr) ? JSON.parse(formDataStr) : {}
      return {}
    }

    // NOTE: mục đích chưa hiểu
    // Input: 
    getQuery() {
      let query = {}
      queryParams.forEach(key => {
        query[key] = getParameterByName(key)
      })
      return query
    }

    render() {
      return <Component formData={this.getFormData()} query={this.getQuery()} />
    }
  }
  return QueryFormDataBrowser
}

export default createQueryFormDataBrowser
