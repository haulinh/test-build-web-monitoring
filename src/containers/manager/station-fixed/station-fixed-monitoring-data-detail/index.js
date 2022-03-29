import { Form } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import React from 'react'

@protectRole(ROLE.STATION_FIXED_INPUT.VIEW)
class StationFixedMonitoringDataDetail extends React.Component {
  render() {
    const { form } = this.props

    return (
      <React.Fragment>
        <p>Oke</p>
      </React.Fragment>
    )
  }
}

export default Form.create()(StationFixedMonitoringDataDetail)
