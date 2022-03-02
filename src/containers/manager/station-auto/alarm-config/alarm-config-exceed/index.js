import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { get } from 'lodash'
import PropsTypes from 'prop-types'
import React, { Component } from 'react'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableExceedQCVN from './TableExceedQCVN'

export default class AlarmConfigExceed extends Component {
  static propTypes = {
    initialValues: PropsTypes.object,
  }

  state = {
    qcvnList: [],
    qcvnListSelected: [],
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
    const { qcvnListSelected } = this.state
    const measuringList = getMeasuringListFromStationAutos(qcvnListSelected)
    return measuringList
  }

  onChangeQCVN = qcvnListSelected => {
    this.setState({ qcvnListSelected: qcvnListSelected })
  }

  render() {
    const { qcvnList, qcvnListSelected } = this.state

    const measuringList = this.getMeasuringList()
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
        <TableExceedQCVN
          qcvnList={qcvnListSelected}
          dataSource={measuringList}
        />
      </div>
    )
  }
}
