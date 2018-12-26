import React from 'react'
import stationConfigApi from 'api/StationConfigApi'
import { Table, message, Icon, Radio } from 'antd'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import SearchForm from './search-form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import { replaceVietnameseStr } from 'utils/string'
const RadioGroup = Radio.Group
@createLanguageHoc
@autobind
export default class TabsStationAuto extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listStationAuto: props.listStationAuto,
      stationConfig: _.keyBy(props.listStationConfig, 'key'),
      stationTypeAuto: props.stationTypeAuto
    }
  }

  getColumns() {
    const columns = [
      {
        title: translate('configWQI.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('configWQI.stationType'),
        dataIndex: 'stationType',
        filters: this.state.stationTypeAuto,
        filterIcon: filtered => (
          <Icon
            type="filter"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        onFilter: (value, record) =>
          _.get(record, 'stationType.key').indexOf(value) === 0,
        key: 'stationType',
        // width: 100,
        align: 'left',
        render: (value, record) => _.get(value, 'name', '')
      },
      {
        title: translate('configWQI.allow'),
        dataIndex: 'key',
        key: 'radio',
        // width: 100,
        align: 'left',
        render: (value, record) => {
          const result = this.getDefaultRadio(value)
          return (
            <RadioGroup
              onChange={event => this.handleRadioAuto(record, event)}
              name="radiogroup"
              defaultValue={result}
            >
              <Radio value={'WQI'}>WQI</Radio>
              <Radio value={'AQI'}>AQI</Radio>
              {result && (
                <Radio value={'UNCHECK'}>
                  {translate('configWQI.unckecked')}
                </Radio>
              )}
            </RadioGroup>
          )
        }
      }
    ]
    return columns
  }

  handleSearch = textSearch => {
    this.setState({ textSearch })
  }

  getData = () => {
    let search = _.lowerCase(this.state.textSearch)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(
        _.clone(this.state.listStationAuto),
        ({ name }) =>
          replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }
    return _.clone(this.state.listStationAuto)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.listStationAuto, this.props.listStationAuto)) {
      this.setState({ listStationAuto: nextProps.listStationAuto })
    }
    if (!_.isEqual(nextProps.listStationConfig, this.props.listStationConfig)) {
      this.setState({
        stationConfig: _.keyBy(nextProps.listStationConfig, 'key')
      })
    }
    if (!_.isEqual(nextProps.stationTypeAuto, this.props.stationTypeAuto)) {
      this.setState({ stationTypeAuto: nextProps.stationTypeAuto })
    }
  }

  handleRadioAuto(record, event) {
    const type = _.get(event, 'target.value', null)
    if (type === 'UNCHECK') {
      this.updateDataAuto(record, { calculateType: null })
    } else {
      this.updateDataAuto(record, { calculateType: type })
    }
  }

  getDefaultRadio = key => {
    return _.get(
      this.state,
      ['stationConfig', key, 'config', 'calculateType'],
      null
    )
  }

  updateDataAuto = async (record, data) => {
    const stationKey = _.get(record, 'key')
    if (stationKey) {
      const obj = _.get(this.state, ['stationConfig', stationKey], null)
      const stationConfigParams = {
        key: _.get(record, 'key', ''),
        name: _.get(record, 'name', ''),
        stationType: _.get(record, 'stationType', {}),
        config: { ...data }
      }

      if (obj) {
        this.updateStationConfig(_.get(obj, '_id', ''), stationConfigParams)
      } else {
        this.createStationConfig(stationConfigParams)
      }
    }
  }

  async createStationConfig(data) {
    const rs = await stationConfigApi.createStationConfig(data)
    if (_.get(rs, 'success')) {
      message.info(translate('configWQI.success'))
      this.props.handleSuccess()
    } else {
      message.info(translate('configWQI.error'))
    }
  }

  async updateStationConfig(_id, data) {
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
        <SearchForm onSearch={this.handleSearch} />
        <Table
          rowKey="key"
          dataSource={this.getData()}
          columns={this.getColumns()}
          pagination={{ showTotal: this.showTotal }}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{_.get(record, 'address', '')}</p>
          )}
        />
      </div>
    )
  }
}
