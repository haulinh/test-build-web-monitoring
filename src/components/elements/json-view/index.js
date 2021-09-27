import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'
import ReactJson from 'react-json-view'
import { translate } from 'hoc/create-lang'

function i18n() {
  return {
    jsonView: translate('dataLogger.list.jsonView'),
  }
}

export default class JsonView extends Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.any,
    isEdit: PropTypes.bool,
  }
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = e => {
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
    console.log(select, '--select--')
  }
  render() {
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.showModal}>
          {i18n().jsonView}
        </Button>
        <Modal
          width={720}
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ReactJson
            onEdit={this.props.isEdit ? this.handleEditJson : false}
            src={this.props.content}
          />
        </Modal>
      </React.Fragment>
    )
  }
}
