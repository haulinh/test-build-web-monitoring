import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ReactJson from 'react-json-view'
import { translate } from 'hoc/create-lang'
const i18n = {
  jsonView: translate('dataLogger.list.jsonView'),
}

export default class JsonView extends Component {
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

  render() {
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.showModal}>
          {i18n.jsonView}
        </Button>
        <Modal
          width={720}
          title={this.props.content.actor.email}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ReactJson src={this.props.content} />
        </Modal>
      </React.Fragment>
    )
  }
}
