import { Button, Form } from 'antd'
import { dataShareApiApi, shareApiApi } from 'api/ShareApiApi'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Condition from '../Condition'

@withRouter
@Form.create()
export default class QueryTab extends Component {
  getData = async () => {
    const {
      match: { params },
    } = this.props
    const data = await dataShareApiApi.getPeriodicHistory({
      id: params.id,
      // stationKeys: 'MT5_N_CM,MT4_N_PT,MT6_N_CM,MT2_N_TC,MT3_N_PT,MH2P',
      // from: '2020-09-30T17:00:00Z',
      // to: '2021-07-06T09:11:52.953Z',
      // measuringList:
      //   'Temp,pH,DO,TSS,COD,BOD,Nitrate,Phosphat,Amoni,Coliform,WO2',
    })
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
