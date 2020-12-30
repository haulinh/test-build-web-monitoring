import React from 'react'
import update from 'immutability-helper'
import { Table, Input, Button, message, Modal } from 'antd'
import Clearfix from 'components/elements/clearfix'
import Frequency from './Frequency'
import { translate } from 'hoc/create-lang'
import OrganizationApi from 'api/OrganizationApi'
import swal from 'sweetalert2'
import styled from 'styled-components'

const i18n = {
  submit: translate('addon.save'),
  titleTable: {
    status: translate('configNotify.titleTable.status'),
    notification: translate('configNotify.titleTable.notification'),
    frequency: translate('configNotify.titleTable.frequency'),
  },
  headerConfirm: translate('configNotify.headerConfirm'),
  contentConfirm: translate('configNotify.contentConfirm'),
  okBtnText: translate('configNotify.okBtnText'),
  cancelBtnText: translate('configNotify.cancelBtnText'),
  updateSuccess: translate('addon.onSave.update.success'),
}

const showSuccess = msg => {
  message.success(`${msg}`)
}

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  .ant-btn-block {
    width: inherit !important;
  }
`

export default class TableConfig extends React.Component {
  state = {
    configDetail: this.props.data.configDetail,
    isLoadingSubmit: false,
    isModelVisible: false,
    confirmLoading: false
  }

  updateFrequency = frequencyUpdate => {
    const { configDetail } = this.props.data
    const indexConfigDetailItemUpdate = configDetail.findIndex(
      configDetailItem => configDetailItem._id === frequencyUpdate._id
    )

    this.setState(preState =>
      update(preState, {
        configDetail: {
          [indexConfigDetailItemUpdate]: {
            isEnable: { $set: frequencyUpdate.isEnable },
            frequency: { $set: frequencyUpdate.frequency },
          },
        },
      })
    )
  }

  updateNotification = message => {
    const { configDetail } = this.props.data
    const indexConfigDetailItemUpdate = configDetail.findIndex(
      configDetailItem => configDetailItem._id === message._id
    )

    this.setState(preState =>
      update(preState, {
        configDetail: {
          [indexConfigDetailItemUpdate]: {
            message: { $set: message.value },
          },
        },
      })
    )
  }

  update = async () => {
    // return alert("SAVE OK")
    this.setState({ isLoadingSubmit: true })
    const { _id, key } = this.props.data
    const data = {
      key: key,
      configDetail: [...this.state.configDetail],
    }

    const res = await OrganizationApi.updateConfigNotify(_id, data)

    if (res) {
      showSuccess(i18n.updateSuccess)
      this.setState({ isLoadingSubmit: false })
    } else {
      console.log(res.message)
      swal({
        title: i18n.updateError,
        type: 'error',
      })
    }
  }

  getColumnsTabConfig = () => {
    return [
      {
        title: i18n.titleTable.status,
        dataIndex: 'status',
        key: 'status',
        render: value => {
          const { key } = this.props.data
          return <span>{translate(`configNotify.${key}.${value}`)}</span>
        },
      },
      {
        title: i18n.titleTable.notification,
        key: 'notification',
        render: configDetail => {
          const handleOnChange = e => {
            const messageUpdate = {
              _id: configDetail._id,
              value: e.target.value,
            }

            this.updateNotification(messageUpdate)
          }
          return (
            <Input
              size="small"
              onChange={handleOnChange}
              defaultValue={configDetail.message}
            />
          )
        },
      },
      {
        title: i18n.titleTable.frequency,
        key: 'frequency',
        render: configDetail => {
          return (
            <Frequency
              {...configDetail}
              updateFrequency={this.updateFrequency}
            />
          )
        },
      },
    ]
  }

  handleOkModel = () => {
    this.update()
    this.setState({
      confirmLoading: true
    })
    setTimeout(() => {
      this.setState({
        isModelVisible: false,
        confirmLoading: false
      })
    }, 500);
  };

  render() {
    return (
      <div>
        <Table
          bordered={true}
          rowKey="_id"
          size="small"
          pagination={false}
          dataSource={this.state.configDetail}
          columns={this.getColumnsTabConfig()}
        />
        <Clearfix height={16} />
        <Flex>
          <Button
            block
            type="primary"
            icon="save"
            // onClick={this.update}
            onClick={() => this.setState({ isModelVisible: true })}

            loading={this.state.isLoadingSubmit}
          >
            {i18n.submit}
          </Button>
        </Flex>
        <Modal
          title={i18n.headerConfirm}
          visible={this.state.isModelVisible}
          onOk={this.handleOkModel}
          okText={i18n.okBtnText}
          cancelText={i18n.cancelBtnText}

          confirmLoading={this.state.confirmLoading}
          onCancel={() => this.setState({ isModelVisible: false })}
        >
          <p>{i18n.contentConfirm}</p>
        </Modal>
      </div>


    )
  }
}
