import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import { Spin, Table, Checkbox, message } from 'antd'
import SearchForm from './search-form'
import * as _ from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

const CheckboxGroup = Checkbox.Group

export default class ConfigPublishContainer extends React.Component {
  handleOptionChange = async (_id, measureList) => {
    console.log(_id, { measureList })
    const rs = await StationAutoApi.measurePublished(_id, { measureList })
    if (_.get(rs, 'success')) {
      this.loadData()
    } else {
      message.success(_.get(rs, 'message'))
    }
  }

  handleStationPublish = async (_id, event) => {
    const allowed = _.get(event, 'target.checked', false)
    const rs = await StationAutoApi.stationPublished(_id, { allowed })
    if (_.get(rs, 'success')) {
      this.loadData()
    } else {
      message.success(_.get(rs, 'message'))
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
    this.columns = [
      {
        title: translate('qaqc.configPublish.publish'),
        dataIndex: 'options',
        key: 'options',
        width: 100,
        align: 'center',
        render: (value, record) => (
          <Checkbox
            defaultChecked={_.get(value, ['published', 'allowed'])}
            onChange={checked => this.handleStationPublish(record._id, checked)}
          />
        ) // "allowed" : false
      },
      {
        title: translate('qaqc.configPublish.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('qaqc.configPublish.measurePublish'),
        dataIndex: 'measuringList',
        key: 'measuringList',
        align: 'left',
        render: (value, record, index) => {
          const options = _.map(value, ({ key, name }) => ({
            label: name,
            value: key
          }))
          const defaultValue = _.get(
            record,
            ['options', 'published', 'measureList'],
            []
          )
          return (
            <CheckboxGroup
              defaultValue={defaultValue}
              options={options}
              onChange={option => this.handleOptionChange(record._id, option)}
            />
          )
        }
      }
    ]
  }

  handleSearch = textSearch => {
    this.setState({ textSearch })
  }

  getData = () => {
    let search = _.lowerCase(this.state.textSearch)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(
        _.clone(this.state.list),
        ({ name }) =>
          replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }

    return _.clone(this.state.list)
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const rs = await StationAutoApi.getLastLog()
    this.setState({ list: _.get(rs, 'data', []) })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['config']} />
        <Spin spinning={false} title="Đang xử lý...">
          <SearchForm onSearch={this.handleSearch} />
          <Table
            rowKey="key"
            dataSource={this.getData()}
            columns={this.columns}
          />
        </Spin>
      </PageContainer>
    )
  }
}
