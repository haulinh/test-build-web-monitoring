import React from 'react'
import stationConfigApi from 'api/StationConfigApi'
import {Table, Checkbox, message, Icon} from 'antd'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import SearchForm from './search-form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'

@createLanguageHoc
@autobind
export default class TabsStationFixed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listStationFixed: this.props.listDataFixed,
      listStationConfig: props.listStationConfig,
      stationTypeFixed: props.stationTypeFixed
    }
  }


  getColums () {
    const colums = [
      {
        title: translate('configWQI.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('configWQI.stationType'),
        dataIndex: 'stationType',
        filters: this.state.stationTypeFixed,
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => _.get(record, 'stationType.key').indexOf(value) === 0,
        key: 'stationType',
       // width: 100,
        align: 'left',
        render: (value, record) => (
          _.get(value, 'name', '')
        )
      },
      {
        title: translate('configWQI.allowWQI'),
        dataIndex: 'key',
        key: '_id',
       // width: 100,
        align: 'left',
        render: (value, record) => (
          <Checkbox
            defaultChecked={this.getdefaultChecked(value)}
            onChange={checked => this.handleCheckedFixed(record, checked)}
          />
        )
      }
    ]
    return colums
  }

  handleSearch = textSearch => {
    this.setState({ textSearch })
  }

  getData = () => {
    let search = _.lowerCase(this.state.textSearch)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(_.clone(this.state.listStationFixed), ({ name }) =>
        replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }
    return _.clone(this.state.listStationFixed)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.listStationFixed, this.props.listStationFixed)) {
      this.setState({ listStationFixed: nextProps.listStationFixed })
    }
    if (!_.isEqual(nextProps.listStationConfig, this.props.listStationConfig)) {
      this.setState({ listStationConfig: nextProps.listStationConfig })
    }
    if (!_.isEqual(nextProps.stationTypeFixed, this.props.stationTypeFixed)) {
      this.setState({ stationTypeFixed: nextProps.stationTypeFixed })
    }
  }


  handleCheckedFixed = async (record, event) => {
    this.updateDataFixed(record, {allowed: _.get(event, 'target.checked', false)})
  }

  getdefaultChecked = (key) => {
    const stationConfig = _.filter(this.state.listStationConfig, ['key', `${key}`])
    if(_.size(stationConfig) > 0) {
      return _.get(stationConfig[0], 'config.WQI.allowed', false)
    } else {
      return false
    }
  }

  updateDataFixed = async (record, data) => { 
    const keyFilter = _.get(record, 'key', '')
    const obj = _.filter(this.state.listStationConfig, ['key', `${keyFilter}`])
    const dataStationConfig = {
      key: _.get(record, 'key', ''),
      stationType: _.get(record, 'stationType', {}),
      config: {
        WQI: {
          ...data
        }
      }
    }
    if(_.size(obj) > 0) {
      const _id = _.get(obj[0], '_id', '')
      this.updateStationConfig(_id, dataStationConfig)
    } 
    else {
      this.createStationConfig(dataStationConfig)
    }
  }

  async createStationConfig (data) {
    const rs = await stationConfigApi.createStationConfig(data)
    if (_.get(rs, 'success')) {
      message.info(translate('configWQI.success'))
      this.props.handleSuccess()
    } else {
      message.info(translate('configWQI.error'))
    }
  }

  async updateStationConfig (_id ,data) {
    const rs = await stationConfigApi.updateStationConfig(_id, data)
    if (_.get(rs, 'success')) {
      message.info(translate('configWQI.success'))
      this.props.handleSuccess()
    } else {
      message.info(translate('configWQI.error'))
    }
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    return (
      <div>
        <SearchForm onSearch={this.handleSearch}/>
        <Table
          rowKey="key"
          dataSource={this.getData()}
          columns={this.getColums()}
          pagination={{showTotal: this.showTotal}}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{_.get(record, 'address', '')}</p>
          )}
        />
      </div>
    )
  }
}