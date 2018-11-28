import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
// import Breadcrumb from '../breadcrumb'
import { Spin, Table, Checkbox, message, Icon, Tabs } from 'antd'
import SearchForm from './search-form'
import * as _ from 'lodash'
import { replaceVietnameseStr } from 'utils/string'
import InfoFTP from './info-ftp'
import Breadcrumb from './breadcrumb'

const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane;

export default class ConfigPublishContainer extends React.Component {
  handleOptionChange = async (record, measureList) => {
    this.updateData(record, {measureList})
  }

  handleStationPublish = async (record, event) => {
    
    this.updateData(record, {allowed: _.get(event, 'target.checked', false)})
  }

  updateData = async (record, data) => { // {allowed: true, measureList: []}
    const originData = _.get(record, 'options.transferFtp', {})
    const rs = await StationAutoApi.transferFtp(record._id, {transferFtp: _.merge(originData, data)})
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
        title: translate('ftpTranfer.allowFtpTranfer'),
        dataIndex: 'options',
        key: 'options',
        width: 100,
        align: 'center',
        render: (value, record) => (
          <Checkbox
            defaultChecked={_.get(value, ['transferFtp', 'allowed'])}
            onChange={checked => this.handleStationPublish(record, checked)}
          />
        ) // "allowed" : false
      },
      {
        title: translate('ftpTranfer.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('ftpTranfer.measureTranfer'),
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
            ['options', 'transferFtp', 'measureList'],
            []
          )
          return (
            <CheckboxGroup
              defaultValue={defaultValue}
              options={options}
              onChange={option => this.handleOptionChange(record, option)}
            />
          )
        }
      }
    ]
  }

  handleSearch = textSearch => {
    this.setState({ textSearch })
  }

  handleEdit = keyEdit => {
    this.setState({showModalFTP: true})
  }
  getData = () => {
    let ls = _.clone(this.state.list)
    let search = _.lowerCase(this.state.textSearch)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(ls => ({ name }) =>
        replaceVietnameseStr(name).indexOf(search)
      )
    }

    return ls
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
        <Breadcrumb items={['list']} />
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><Icon type="diff" />{translate('ftpTranfer.configTranferFTP')}</span>} key="1" >
                <SearchForm onSearch={this.handleSearch} />
                <Table
                  rowKey="key"
                  dataSource={this.getData()}
                  columns={this.columns}
                />
            </TabPane >
            <TabPane tab={<span><Icon type="info-circle" />{translate('ftpTranfer.ftpConfig')}</span>} key="2">
              <InfoFTP/>
            </TabPane>
          </Tabs>
      </PageContainer>
    )
  }
}
