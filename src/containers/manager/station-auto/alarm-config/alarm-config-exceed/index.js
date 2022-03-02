import { Clearfix } from 'components/elements'
import measuring from 'containers/manager/measuring'
import PropsTypes from 'prop-types'
import React, { Component } from 'react'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableExceedQCVN from './TableExceedQCVN'
import QCVNApi from 'api/QCVNApi'
import { get } from 'lodash'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'

export default class AlarmConfigExceed extends Component {
  static propTypes = {
    initialValues: PropsTypes.object,
  }
  state = {
    qcvnList: [],
  }

  async componentDidMount() {
    let query = {}
    const result = await QCVNApi.getQCVN({}, query)
    if (get(result, 'success', false)) {
      this.setState({
        qcvnList: get(result, 'data', []),
      })
    }
  }

  getMeasuringList = () => {
    const { qcvnList } = this.state
    const measuringList = getMeasuringListFromStationAutos(qcvnList)
    return measuringList
  }
  render() {
    const { dataSource, qcvnList } = this.state

    console.log({ qcvnList })
    const measuringList = this.getMeasuringList()
    console.log({ measuringList })
    const { form } = this.props

    return (
      <div>
        <div className="title">Cảnh báo vượt ngưỡng</div>

        <TableAlarmExceedForm
          onChangeQCVN={this.onChangeQCVN}
          form={form}
          qcvnList={qcvnList}
        />
        <Clearfix height={12} />
        <TableExceedQCVN qcvnList={qcvnList} dataSource={measuringList} />
      </div>
    )
  }
}
