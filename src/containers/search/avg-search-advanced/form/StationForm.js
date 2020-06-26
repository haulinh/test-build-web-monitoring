import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import update from 'immutability-helper'
import styled from 'styled-components'
import {
  Collapse,
  Table,
  Select,
  Checkbox,
  Button,
  Input,
  Tooltip,
  Icon,
} from 'antd'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'
import Highlighter from 'react-highlight-words'

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
      searchString: undefined,
      searchText: '',
      searchedColumn: '',
    }
  }

  handleChange = () => {
    this.props.onChangeStationsData(this.state.dataSource)
    console.log('this.state.dataSource', this.state.dataSource)
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
    if (this.state && this.state.searchString) {
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
    console.log(this.state.dataSource, '-----dataSource')
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
      , () => console.log('this.state.dataSource', this.state.dataSource))
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 258, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 125, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 125 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
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
        width: 230,
        ...this.getColumnSearchProps('name'),
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
          <Tooltip
            placement="top"
            title={translate('dataSearchFilterForm.tooltip.view')}
          >
            <Flex>
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkedAll}
              />
              <Clearfix width={12} />
              {translate('avgSearchFrom.table.view')}
            </Flex>
          </Tooltip>
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
      <Tooltip
        placement="top"
        title={translate('dataSearchFilterForm.tooltip.listStation')}
      >
        <Heading>
          {translate('avgSearchFrom.stationForm.length', {
            stationLength: this.state.dataSource.filter(station => station.view)
              .length,
          })}
        </Heading>
      </Tooltip>
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
      <Tooltip
        placement="top"
        title={translate('dataSearchFilterForm.tooltip.searchData')}
      >
        <Button
          type="primary"
          icon="search"
          size="large"
          onClick={this.handleSearchAvgData}
        >
          {translate('addon.search')}
        </Button>
      </Tooltip>
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
