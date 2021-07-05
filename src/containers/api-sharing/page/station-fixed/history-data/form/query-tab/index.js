import { Button, Form } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Condition from '../../Condition'

@withRouter
@Form.create()
export default class QueryTab extends Component {
  getData = async () => {
    const {
      match: { params },
    } = this.props
    const data = await shareApiApi.getPeriodicHistory({ id: params.id })
    console.log({ data })
  }

  render() {
    const { form } = this.props
    return (
      <React.Fragment>
        <Condition form={form} />
        <Button onClick={this.getData}>Click</Button>
      </React.Fragment>
    )
  }
}
