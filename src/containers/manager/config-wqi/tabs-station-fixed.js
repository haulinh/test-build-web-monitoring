import React from 'react'
import {Table} from 'antd'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import SearchForm from './search-form'
import createLanguageHoc, { translate } from 'hoc/create-lang'

@createLanguageHoc
@autobind
export default class TabsStationFixed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      organization: {}
    }
    this.columns = [
      {
        title: translate('ftpTranfer.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('ftpTranfer.allowFtpTranfer'),
        dataIndex: 'options',
        key: 'options',
       // width: 100,
        align: 'left',
        render: (value, record) => (
          <Checkbox
            defaultChecked={_.get(value, ['transferFtp', 'allowed'])}
            onChange={checked => this.handleStationPublish(record, checked)}
          />
        )
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
      return _.filter(_.clone(this.state.list), ({ name }) =>
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
    this.setState({ list: _.get(rs, 'data', [])})
  }

  render() {
    return (
      <SearchForm onSearch={this.handleSearch}>
        <Table
          rowKey="key"
          dataSource={this.getData()}
          columns={this.columns}
        />
      </SearchForm>
    )
  }
}