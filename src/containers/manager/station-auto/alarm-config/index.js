import React, { Component } from 'react'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { Collapse, Button, Form } from 'antd'
import styled from 'styled-components'
import UserApi from 'api/UserApi'
import { Clearfix } from 'components/elements'

const { Panel } = Collapse

const PanelAnt = styled(Panel)`
  .ant-collapse-header {
    display: flex;
    height: 46px;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }
`

export const FIELDS = {
  DISCONNECT: 'disconnect',
  TIME_DISCONNECT: 'timeDisconnect',
  ACTIVE: 'active',
  EXCEED: 'exceed',
  QCVN_EXCEED: 'qcvnExceed',
  ACTIVE_EXCEED: 'activeExceed',
}

@Form.create()
export default class AlarmConfig extends Component {
  state = {
    userList: [],
  }
  onSubmitForm = () => {
    const { form } = this.props
    const value = form.getFieldsValue()

    console.log('value---->', { value })
  }

  componentDidMount = () => {
    this.getUsers()
  }

  getUsers = async () => {
    try {
      const response = await UserApi.searchUser()
      this.setState({
        userList: response.data,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  render() {
    const { form } = this.props
    const { userList } = this.state

    return (
      <div>
        <Collapse style={{ marginTop: '10px' }}>
          <PanelAnt header="Cảnh báo" key="1">
            <AlarmConfigDisconnect form={form} userList={userList} />
            <Clearfix height={24} />
            <AlarmConfigExceed form={form} userList={userList} />
          </PanelAnt>
        </Collapse>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '20px 0',
          }}
        >
          <Button
            style={{ width: '130px' }}
            type="primary"
            onClick={this.onSubmitForm}
          >
            Lưu
          </Button>
        </div>
      </div>
    )
  }
}
