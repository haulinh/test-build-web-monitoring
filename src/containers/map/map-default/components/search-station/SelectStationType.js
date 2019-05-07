import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import CategoryApi from 'api/CategoryApi'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'

const SelectWrapper = styled.div`
  width: 100%;
  .ant-select {
    width: 100%;
  }
  .ant-select-selection--single {
    width: 100%;
    background-color: #41aee4;
    border: 0px;
  }
  .ant-select-selection-selected-value {
    color: #ffffff;
    padding-right: 15px;
  }
  .ant-select-arrow {
    color: #ffffff;
  }
`

@autobind
export default class SelectStationType extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func
  }

  state = {
    stationTypes: []
  }

  async componentDidMount() {
    let query = { isAuto: true }
    const stationTypes = await CategoryApi.getStationTypes({}, query)
    this.setState({ stationTypes: stationTypes.data || [] })
  }

  render() {
    return (
      <SelectWrapper>
        <Select showSearch {...this.props}>
          <Select.Option value={''}>{translate('chart.all')}</Select.Option>
          {this.state.stationTypes.map(stationType => (
            <Select.Option key={stationType.key} value={stationType.key}>
              {stationType.name}
            </Select.Option>
          ))}
        </Select>
      </SelectWrapper>
    )
  }
}
