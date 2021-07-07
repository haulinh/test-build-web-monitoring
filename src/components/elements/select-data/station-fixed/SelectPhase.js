import { Select } from 'antd'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import React from 'react'

export class SelectPhase extends React.Component {
  state = {
    phases: [],
  }

  fetchPhase = async () => {
    const phases = await getPhase()

    this.setState({
      phases,
    })
  }

  componentDidMount() {
    this.fetchPhase()
  }

  getPhases = () => {
    let phases = this.state.phases
    const { stationTypeId } = this.props

    if (stationTypeId) {
      phases = phases.filter(phase => phase.stationTypeId === stationTypeId)
    }

    return phases
  }

  render() {
    const phases = this.getPhases()
    return (
      <Select
        {...this.props}
        size="default"
        allowClear
        autoClearSearchValue
        mode="multiple"
        optionFilterProp="children"
        // this props allow search name and _id
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0 ||
          option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{ width: '100%' }}
      >
        {phases.map(phase => (
          <Select.Option key={phase._id} value={phase._id}>
            {phase.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
