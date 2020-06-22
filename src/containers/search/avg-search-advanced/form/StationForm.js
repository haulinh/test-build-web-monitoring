import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import update from 'immutability-helper'
import styled from 'styled-components'
import { Collapse, Table, Select, Checkbox, Button, Input } from 'antd'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'

const { Panel } = Collapse

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .ant-table-thead > tr > th {
    white-space: nowrap;
  }
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-select-selection {
    border: none;
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 6px 16px;
    padding-left: 40px;
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
    onSearchAvgData: PropTypes.func,
  }

  static defaultProps = {
    stationKeys: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      listView: [],
      dataSource: this.getDataSource(),
      indeterminate: false,
      checkAll: true,
      activeKey: '',
      searchString: '',
    }
  }

  handleChange = () => {
    this.props.onChangeStationsData(this.state.dataSource)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.stations.length) return
    if (
      !_.isEqual(prevProps.stationKeys, this.props.stationKeys) ||
      !_.isEqual(prevProps.stations.length, this.props.stations.length) ||
      !_.isEqual(prevState.searchString, this.state.searchString)
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
    let stations = this.props.stations
    stations = stations.filter(station =>
      this.props.stationKeys.includes(station.key)
    )
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      stations = this.props.stations.filter(
        station => replaceVietnameseStr(station.name).indexOf(searchString) > -1
      )
    }

    return stations.map((station, index) => {
      // const oldData = this.state.dataSource.find(sta => sta.key === station.key)
      return {
        index,
        _id: station._id,
        key: station.key,
        name: station.name,
        // view: oldData ? oldData.view : true,
        view: true,
        measuringData: station.measuringList.sort(
          (a, b) => a.numericalOrder - b.numericalOrder
        ),
        // measuringList: oldData
        //   ? oldData.measuringList
        //   : station.measuringList.map(measuring => measuring.key),
        measuringList: station.measuringList.map(measuring => measuring.key),
      }
    })
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

  onCheckAllChange = e => {
    this.setState(
      prevState =>
        update(prevState, {
          dataSource: {
            $set: prevState.dataSource.map(data => ({
              ...data,
              view: e.target.checked,
            })),
          },
        }),
      this.handleChange
    )
  }

  getColumns = () => {
    const indeterminate =
      !!this.state.dataSource.filter(data => data.view).length &&
      this.state.dataSource.filter(data => data.view).length <
        this.state.dataSource.length
    const checkedAll =
      this.state.dataSource.filter(data => data.view).length ===
      this.state.dataSource.length
    return [
      {
        title: translate('avgSearchFrom.form.stationAuto.label'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: translate('avgSearchFrom.form.measuringList.label'),
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
        title: () => (
          <Flex>
            <Checkbox
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={checkedAll}
            />
            <Clearfix width={12} />
            {translate('avgSearchFrom.table.view')}
          </Flex>
        ),
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
      <Heading>
        {translate('avgSearchFrom.stationForm.length', {
          stationLength: this.state.dataSource.length,
        })}
      </Heading>
    )
  }

  handleSearchAvgData = event => {
    event.stopPropagation()
    this.setState({ activeKey: '' })
    this.props.onSearchAvgData()
  }

  handleSearchStation = _.debounce(value => {
    this.setState({ searchString: value })
  }, 200)

  rightChildren() {
    return (
      <Button
        type="primary"
        icon="search"
        size="large"
        onClick={this.handleSearchAvgData}
      >
        {translate('addon.search')}
      </Button>
    )
  }

  handleChangeActiveKey = key => {
    this.setState({ activeKey: key })
  }

  render() {
    const { dataSource } = this.state
    const columns = this.getColumns()
    return (
      <StationFormWrapper>
        <Collapse
          expandIconPosition="left"
          onChange={this.handleChangeActiveKey}
          activeKey={this.state.activeKey}
        >
          <Panel
            header={this.renderHeading()}
            extra={this.rightChildren()}
            key="list"
          >
            {/* <Input.Search
              style={{ width: '100%' }}
              size="large"
              placeholder="Search station"
              onChange={e => this.handleSearchStation(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
            <Clearfix height={40} /> */}
            <Table dataSource={dataSource} columns={columns} />
          </Panel>
        </Collapse>
      </StationFormWrapper>
    )
  }
}
