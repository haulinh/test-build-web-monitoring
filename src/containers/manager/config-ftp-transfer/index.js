import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
// import Breadcrumb from '../breadcrumb'
import { Table, Checkbox, message, Icon, Tabs, DatePicker } from 'antd'
import SearchForm from './search-form'
import * as _ from 'lodash'
import { replaceVietnameseStr } from 'utils/string'
import InfoFTP from './info-ftp'
import Breadcrumb from './breadcrumb'
import AuthApi from 'api/AuthApi'
import organizationAPI from 'api/OrganizationApi'
import moment from 'moment'
import ModalFileName from './modal-fileName'

const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane;

export default class ConfigPublishContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      organization: {},
      showModal: false,
      dataModal: {}
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
        )
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
       // width: 100,
        align: 'left',
        render: (value, record) => {
          const options = _.map(value, ({ key, name }) => ({
            label: name,
            value: key
          }))
          // const defaultCheck = _.map(value, ({ key, name }) => (
          //   key
          // ))
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
      },{
        title: translate('ftpTranfer.timeStart'),
        dataIndex: 'timeStart',
        key: 'timeStart',
       // width: 100,
        align: 'center',
        render: (value, record) => {
          const defaultValueTime = _.get(
            record,
            ['options', 'transferFtp', 'timeStart'],
            new Date()
          )
          return (
            <DatePicker
            format="DD-MM-YYYY"
            placeholder={translate('ftpTranfer.timeStart')}
            defaultValue = {moment(defaultValueTime, "DD-MM-YYYY")}
            onChange={(time, timeString) =>
            this.onchangeTime(timeString, record)}
         />
          )
        }
      },
      {
        title: translate('ftpTranfer.formInFoFTP.fileName.name'),
        dataIndex: 'fileName',
        key: 'fileName',
       // width: 100,
        align: 'center',
        render: (value, record) => {
          return(
            <div>
              <span style={{ color: 'blue', paddingLeft: '15px' }}>
                        {this.infoConfigFileName(record)}
              </span>
              <span onClick={() => this.handleEdit(record)}>
                        <Icon
                          type="edit"
                          theme="outlined"
                          style={{ paddingLeft: '15px', color: 'blue' }}
                        />{' '}
               </span>
            </div>
          )
        }
      }
    ]
  }

  handleOptionChange = async (record, measureList) => {
    this.updateData(record, {measureList})
  }
 
   handleStationPublish = async (record, event) => {
     this.updateData(record, {allowed: _.get(event, 'target.checked', false)})
  }
 
  onchangeTime = async (timeString, record) => {
    this.updateData(record, {timeStart: timeString})
  }


  infoConfigFileName = (record) => {
    const info = _.get(record, 'options.transferFtp.fileName', '...')
    return info
  }

  handleEdit = (record)=> {
    this.setState({showModal: true, dataModal: record})
  }

  modalCancel = () => {
    this.setState({showModal: false})
  }

  modalSave = () => {
    this.loadData()
    this.setState({showModal: false})
  }

  updateData = async (record, data) => { 
    const originData = _.get(record, 'options.transferFtp', {})
    const rs = await StationAutoApi.transferFtp(record._id, {transferFtp: _.merge(originData, data)})
    if (_.get(rs, 'success')) {
      this.loadData()
    } else {
      message.success(_.get(rs, 'message'))
    }
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

  async getDataOganization (){
    const userInfo = await AuthApi.getMe()
    const id = _.get(userInfo, 'data.organization._id','vasoft')
    const organizationInfo = await organizationAPI.getOrganization(id)
    this.setState({ organization: _.get(organizationInfo, 'data', {}) })
  }

  componentDidMount() {
    this.loadData()
    this.getDataOganization()
  }

  handleSaveFtpConfig = () => {
    this.getDataOganization()
  }

  async loadData() {
    const rs = await StationAutoApi.getLastLog()
    this.setState({ list: _.get(rs, 'data', [])})
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
                  {this.state.showModal && (
                    <ModalFileName
                      showModal={this.state.showModal}
                      modalCancel={this.modalCancel}
                      modalSave={this.modalSave}
                      data = {this.state.dataModal}
                      loadData = {this.loadData}
                    />
                  )}
            </TabPane >
            <TabPane tab={<span><Icon type="info-circle" />{translate('ftpTranfer.ftpConfig')}</span>} key="2">
              <InfoFTP onSaveFtpConfig={this.handleSaveFtpConfig} 
              transferFtpInfo={_.get(this.state, 'organization.transferFtpInfo', {})}
              _id={_.get(this.state, 'organization._id', 'vasoft-2018')}
              />
            </TabPane>
          </Tabs>        
      </PageContainer>
    )
  }
}
