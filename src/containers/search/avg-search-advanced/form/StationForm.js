import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import update from 'immutability-helper'
import styled from 'styled-components'
import { Collapse, Table, Select, Checkbox } from 'antd'

const { Panel } = Collapse

const StationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-select-selection {
    border: none;
  }
`

const Heading = styled.h4`
  font-size: 18px;
  margin-bottom: 0;
`

export default class StationForm extends React.PureComponent {
  static propTypes = {
    stations: PropTypes.array,
    stationKeys: PropTypes.array,
    onChangeStationsData: PropTypes.func,
  }

  static defaultProps = {
    stationKeys: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      listView: [],
      dataSource: this.getDataSource(),
    }
  }

  handleChange = () => {
    this.props.onChangeStationsData(this.state.dataSource)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.stations.length) return
    if (
      !_.isEqual(prevProps.stationKeys, this.props.stationKeys) ||
      !_.isEqual(prevProps.stations.length, this.props.stations.length)
    ) {
      const dataSource = this.getDataSource()
      this.setState({ dataSource }, this.handleChange)
    }
  }

  handleChangeView = recordIndex => e => {
    this.setState(
      prevState =>
        update(prevState, {
          dataSource: {
            [recordIndex]: {
              view: {
                $set: e.target.checked,
              },
            },
          },
        }),
      this.handleChange
    )
  }

  getDataSource = () => {
    if (!this.props.stations.length) return []
    const stations = this.props.stations.filter(station =>
      this.props.stationKeys.includes(station.key)
    )
    return stations.map((station, index) => ({
      index,
      _id: station._id,
      key: station.key,
      name: station.name,
      view: true,
      measuringData: station.measuringList.sort(
        (a, b) => a.numericalOrder - b.numericalOrder
      ),
      measuringList: station.measuringList.map(measuring => measuring.key),
    }))
  }

  handleChangeMeasuringList = recordIndex => measuringList => {
    this.setState(
      prevState =>
        update(prevState, {
          dataSource: {
            [recordIndex]: {
              measuringList: {
                $set: measuringList,
              },
            },
          },
        }),
      this.handleChange
    )
  }

  getColumns = () => {
    return [
      {
        title: 'Tên trạm',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <span>
              {text} <strong>({record.key})</strong>
            </span>
          )
        },
      },
      {
        title: 'Thông số',
        dataIndex: 'measuringList',
        key: 'measuringList',
        render: (measuringList, record) => {
          return (
            <Select
              style={{ width: '100%' }}
              mode="tags"
              allowClear
              showSearch
              size="large"
              onChange={this.handleChangeMeasuringList(record.index)}
              value={measuringList}
            >
              {record.measuringData.map(measuring => (
                <Select.Option key={measuring.key}>
                  {measuring.name}
                </Select.Option>
              ))}
            </Select>
          )
        },
      },
      {
        title: 'Hiển thị',
        dataIndex: 'view',
        key: 'view',
        render: (value, record) => {
          return (
            <Checkbox
              onChange={this.handleChangeView(record.index)}
              defaultChecked
              checked={value}
            />
          )
        },
      },
    ]
  }

  renderHeading() {
    return (
      <Heading>Danh sách trạm ({this.state.dataSource.length} trạm)</Heading>
    )
  }

  render() {
    const dataSource = this.state.dataSource
    const columns = this.getColumns()
    return (
      <StationFormWrapper>
        <Collapse expandIconPosition="left">
          <Panel header={this.renderHeading()} key="list">
            <Table dataSource={dataSource} columns={columns} />
          </Panel>
        </Collapse>
      </StationFormWrapper>
    )
  }
}
