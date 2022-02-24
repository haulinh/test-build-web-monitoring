import React, { Component } from 'react'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import { Collapse, Button, Form } from 'antd'
import styled from 'styled-components'
import UserApi from 'api/UserApi'

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
