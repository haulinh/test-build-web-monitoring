import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'
import ReactJson from 'react-json-view'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

const i18n = {
  jsonView: translate('dataLogger.list.jsonView'),
  btnSave: translate('global.save'),
}

export default class JsonViewCustom extends Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.any,
    dataStructure: PropTypes.any,
    isEdit: PropTypes.bool,
    onChange: PropTypes.func,
  }
  state = {
    visible: false,
    dataSource: null,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = e => {
    if (this.props.onChange) {
      this.props.onChange(this.state.dataSource)
    }
    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }

  handleEditJson = select => {
    this.setState({
      dataSource: select.updated_src,
    })
    // return select
  }

  getReduce = (data, callback) => {
    let result = {}
    const content = this.state.dataSource
      ? this.state.dataSource
      : this.props.content
    result = _.reduce(
      data,
      function(result, value, key) {
        if (typeof value === 'object') {
          const temp = callback(value)
          _.set(result, key, temp)
        } else {
          // console.log(content, '-getContent--')
          const valueTemp = _.get(content, key, '')
          _.set(result, key, valueTemp)
        }

        return result
      },
      {}
    )
    return result
  }

  getContent = () => {
    let result = this.getReduce(this.props.dataStructure, this.getReduce)

    if (this.props.dataStructure) {
      return result
    } else {
      return this.props.content
    }
  }
  render() {
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.showModal}>
          {i18n.jsonView}
        </Button>
        <Modal
          width={720}
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          okText={i18n.btnSave}
          onCancel={this.handleCancel}
        >
          {this.state.visible && (
            <ReactJson
              onEdit={this.props.isEdit ? this.handleEditJson : false}
              src={this.getContent()}
            />
          )}
        </Modal>
      </React.Fragment>
    )
  }
}
