import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
// import Breadcrumb from '../breadcrumb'
import {
  Table,
  Checkbox,
  message,
  Icon,
  Tabs,
  DatePicker,
  Button,
  Row,
  Col,
  Tooltip,
} from 'antd'
import SearchForm from './search-form'
import * as _ from 'lodash'
import { replaceVietnameseStr } from 'utils/string'
import InfoFTP from './info-ftp'
import Breadcrumb from '../breadcrumb'
import AuthApi from 'api/AuthApi'
import organizationAPI from 'api/OrganizationApi'
import moment from 'moment'
import ModalFileName from './modal-fileName'
import dataStationAutoApi from 'api/DataStationAutoApi'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'
import Clearfix from 'components/elements/clearfix'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const { RangePicker } = DatePicker

const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane

const i18n = {
  tranferBonus: translate('ftpTranfer.tranferBonus'),
  address: translate('ftpTranfer.address'),
  tranfer: translate('ftpTranfer.tranfer'),
  status: translate('ftpTranfer.status.title'),
  success2: translate('ftpTranfer.status.success2'),
  failed2: translate('ftpTranfer.status.failed2'),
}
@protectRole(ROLE.FTPTRANSFER.VIEW)
export default class ConfigPublishContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      organization: {},
      showModal: false,
      dataModal: {},
      columns: [
        {
          title: '#',
          align: 'left',
          render: (value, record, index) => {
            return index + 1
          },
        },
        {
          title: translate('ftpTranfer.allowFtpTranfer'),
          dataIndex: 'options',
          key: 'options',
          width: 100,
          align: 'center',
          render: (value, record) => (
            <Checkbox
              defaultChecked={_.get(value, ['transferFtp', 'allowed'])}
              checked={_.get(value, ['transferFtp', 'allowed'])}
              onChange={checked => this.handleStationPublish(record, checked)}
            />
          ),
        },
        {
          title: translate('ftpTranfer.stationName'),
          dataIndex: 'name',
          key: 'name',
          align: 'left',
        },
        {
          title: translate('ftpTranfer.measureTranfer'),
          dataIndex: 'measuringList',
          key: 'measuringList',
          align: 'left',
          render: (value, record) => {
            const options = _.map(value, ({ key, name }) => ({
              label: name,
              value: key,
            }))
            const defaultValue = _.get(
              record,
              ['options', 'transferFtp', 'measureList'],
              []
            )

            return (
              <CheckboxGroup
                defaultValue={defaultValue}
                value={defaultValue}
                options={options}
                onChange={option => this.handleOptionChange(record, option)}
              />
            )
          },
        },
        {
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
                defaultValue={moment(defaultValueTime, 'DD-MM-YYYY')}
                onChange={(time, timeString) =>
                  this.onchangeTime(timeString, record)
                }
              />
            )
          },
        },
        {
          title: translate('ftpTranfer.formInFoFTP.fileName.name'),
          dataIndex: 'fileName',
          key: 'fileName',
          // width: 100,
          align: 'center',
          render: (value, record) => {
            return (
              <div>
                <span style={{ color: 'blue', paddingLeft: '15px' }}>
                  {this.infoConfigFileName(record)}
                </span>
                <span onClick={() => this.handleEdit(record)}>
                  <Icon
                    type="edit"
                    theme="outlined"
                    style={{
                      paddingLeft: '15px',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                  />{' '}
                </span>
              </div>
            )
          },
        },
      ],
      columns_2: [
        {
          title: '#',
          align: 'left',
          render: (value, record, index) => {
            return index + 1
          },
        },
        {
          title: translate('ftpTranfer.allowFtpTranfer'),
          dataIndex: 'options',
          key: 'options',
          width: 100,
          align: 'center',
          render: (value, record) => (
            <Checkbox
              onChange={checked =>
                this.hanldeCheckedTranferBonus(record, checked)
              }
            />
          ),
        },
        {
          title: translate('ftpTranfer.stationName'),
          dataIndex: 'name',
          key: 'name',
          align: 'left',
        },
        {
          title: i18n.address,
          dataIndex: 'address',
          key: 'address',
          // width: 100,
          align: 'left',
        },
        {
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
                defaultValue={moment(defaultValueTime, 'DD-MM-YYYY')}
                disabled
              />
            )
          },
        },
        {
          title: i18n.status,
          dataIndex: 'reponse',
          key: 'reponse',
          // width: 100,
          align: 'center',
          render: (value, record) => {
            const itemFind = _.find(
              this.state.infoTranferBonus.listDataTranferBonus,
              item => {
                return item.key === record._id
              }
            )
            // console.log(itemFind, "-0---")
            const reponse = _.get(itemFind, 'reponse')
            if (!reponse) {
              return null
            }

            const isSuccess = _.get(itemFind, 'reponse.success')
            // console.log(isSuccess,  "---isSuccess--")
            if (!isSuccess) {
              return (
                <Tooltip placement="top" title={i18n.failed2}>
                  <Icon
                    style={{
                      fontSize: '1.5rem',
                    }}
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#eb2f96"
                  />
                </Tooltip>
              )
            } else {
              return (
                <Tooltip placement="top" title={i18n.success2}>
                  <Icon
                    style={{
                      fontSize: '1.5rem',
                    }}
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
              )
            }
          },
        },
      ],
      textSearch2: '',
      infoTranferBonus: {
        listDataTranferBonus: [],
        from: null,
        to: null,
      },
    }
  }

  handleOptionChange = async (record, measureList) => {
    let originData = _.get(record, 'options.transferFtp', {})
    originData.measureList = measureList
    originData.allowed = _.size(measureList) > 0

    if (originData.allowed && !_.get(originData, 'timeStart')) {
      originData.timeStart = moment().format('DD-MM-YYYY')
    }

    this.updateData(record, originData)
  }

  handleStationPublish = (record, event) => {
    let originData = _.get(record, 'options.transferFtp', {})
    originData.allowed = _.get(event, 'target.checked', false)
    if (originData.allowed) {
      if (!_.get(originData, 'timeStart')) {
        originData.timeStart = moment().format('DD-MM-YYYY')
      }

      originData.measureList = _.map(
        _.get(record, 'measuringList', []),
        item => item.key
      )
    } else {
      originData.measureList = []
    }

    this.updateData(record, originData)
  }

  onchangeTime = async (timeString, record) => {
    let originData = _.get(record, 'options.transferFtp', {})
    originData.timeStart = timeString
    this.updateData(record, originData)
  }

  infoConfigFileName = record => {
    const info = _.get(record, 'options.transferFtp.fileName', '...')
    return info
  }

  handleEdit = record => {
    // console.log(record,"handleEdit")
    this.setState({ showModal: true, dataModal: record })
  }

  modalCancel = () => {
    this.setState({ showModal: false })
  }

  modalSave = () => {
    this.loadData()
    this.setState({ showModal: false })
  }

  updateData = async (record, originData) => {
    let list = _.clone(this.state.list)
    const rs = await StationAutoApi.transferFtp(record._id, {
      transferFtp: originData,
    })
    if (_.get(rs, 'success')) {
      const data = _.get(rs, 'data', {})
      const index = _.findIndex(list, item => _.isEqual(item._id, record._id))
      if (_.isNumber(index) && _.size(list) > index) {
        if (list[index].options) {
          list[index].options = _.get(data, 'options', {})
        }
      }
      this.setState({ list })
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
      return _.filter(
        _.clone(this.state.list),
        ({ name }) =>
          replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }

    return _.clone(this.state.list)
  }

  async getDataOganization() {
    const userInfo = await AuthApi.getMe()
    const id = _.get(userInfo, 'data.organization._id', 'vasoft')
    const organizationInfo = await organizationAPI.getOrganization(id)
    this.setState({ organization: _.get(organizationInfo, 'data', {}) })
  }

  componentDidMount() {
    this.loadData()
    this.loadCountStatusFtpTranfer()
    this.getDataOganization()
  }

  async loadCountStatusFtpTranfer() {
    const rs = await dataStationAutoApi.getCountStatusFtpTranfer()
    if (rs && rs.data) {
      const ftpTranferInfo = _.keyBy(rs.data, '_id')
      let columns = this.state.columns
      if (columns && columns.length > 0) {
        columns.push({
          title: translate('ftpTranfer.summary'),
          dataIndex: 'summary',
          key: 'summary',
          width: 106,
          align: 'center',
          render: (value, record) => {
            const info = _.get(ftpTranferInfo, `${record.key}`)
            return (
              <div>
                <span style={{ color: 'blue', paddingLeft: '15px' }}>
                  {
                    <Link
                      params={{ testvalue: 'hello' }}
                      to={
                        slug.ftpTransfer.historyWithKey +
                        `/${record.key}/${record.name}`
                      }
                    >
                      {info ? `${info.transferred}/${info.total}` : '0/0'}
                    </Link>
                  }
                </span>
              </div>
            )
          },
        })
      }

      this.setState({
        columns,
      })
    }
  }

  handleSaveFtpConfig = () => {
    this.getDataOganization()
  }

  async loadData() {
    // console.log('----loadData-loadData----')
    const rs = await StationAutoApi.getLastLog()
    this.setState({ list: _.get(rs, 'data', []) })
  }
  /* #region cac chuc nang lien quan toi tab truyn bo sung   */

  getDataTranferbonus = () => {
    const dataInput = _.filter([...this.state.list], ({ options }) => {
      return options && _.get(options, 'transferFtp.allowed', false) === true
    })

    let search = _.lowerCase(this.state.textSearch2)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(
        dataInput,
        ({ name }) =>
          replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }

    return dataInput
    // return _.clone(this.state.list);
  }

  hanldeCheckedTranferBonus = (record, event) => {
    let checked = _.get(event, 'target.checked', false)
    const key = _.get(record, '_id')

    const index = _.find(
      this.state.infoTranferBonus.listDataTranferBonus,
      item => {
        return item.key === key
      }
    )
    let listOutput = []
    if (index) {
      listOutput = _.map(
        this.state.infoTranferBonus.listDataTranferBonus,
        item => {
          if (item.key === key) {
            return null
          }
          return {
            ...item,
          }
        }
      )
    } else {
      listOutput = [
        ...this.state.infoTranferBonus.listDataTranferBonus,
        {
          key,
          checked,
        },
      ]
    }

    this.setState({
      infoTranferBonus: {
        ...this.state.infoTranferBonus,
        listDataTranferBonus: _.compact(listOutput),
      },
    })
  }

  hanldeRangePicker = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    const [from, to] = value
    this.setState({
      infoTranferBonus: {
        ...this.state.infoTranferBonus,
        from: moment(from)
          .startOf('days')
          .utc()
          .format(),
        to: moment(to)
          .endOf('days')
          .utc()
          .format(),
      },
    })
  }
  handleTranferFile = async () => {
    const arrPromise = _.map(
      this.state.infoTranferBonus.listDataTranferBonus,
      async item => {
        return {
          ...item,
          reponse: await StationAutoApi.tranferBonusFTP({
            _id: item.key,
            from: this.state.infoTranferBonus.from,
            to: this.state.infoTranferBonus.to,
          }),
        }
      }
    )

    const dataOutput = await Promise.all(arrPromise)
    // console.log(dataOutput, "---dataOutput--")

    this.setState({
      infoTranferBonus: {
        ...this.state.infoTranferBonus,
        listDataTranferBonus: [...dataOutput],
      },
    })
  }

  handleSearch2 = textSearch2 => {
    this.setState({ textSearch2 })
  }

  /* #endregion */

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="diff" />
                {translate('ftpTranfer.configTranferFTP')}
              </span>
            }
            key="1"
          >
            <SearchForm onSearch={this.handleSearch} />
            <Table
              rowKey="key"
              dataSource={this.getData()}
              columns={this.state.columns}
              size="small"
              pagination={{
                pageSize: 20,
              }}
            />
            {this.state.showModal && (
              <ModalFileName
                showModal={this.state.showModal}
                modalCancel={this.modalCancel}
                modalSave={this.modalSave}
                data={this.state.dataModal}
                dataConfigFtp={_.get(
                  this.state,
                  'organization.transferFtpInfo',
                  []
                )}
                loadData={this.loadData}
              />
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="plus-square" />
                {i18n.tranferBonus}
              </span>
            }
            key="3"
          >
            <SearchForm onSearch={this.handleSearch2} />
            {this.state.infoTranferBonus.listDataTranferBonus.length > 0 && (
              <div>
                <Row gutter={8}>
                  <Col span={22}>
                    <RangePicker
                      disabledDate={current => {
                        // Can not select days before today and today
                        return current && current > moment().endOf('day')
                      }}
                      onChange={this.hanldeRangePicker}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={2}>
                    <Button
                      disabled={this.state.infoTranferBonus.from ? false : true}
                      type="primary"
                      onClick={this.handleTranferFile}
                    >
                      {i18n.tranfer}
                    </Button>
                  </Col>
                </Row>
                <Clearfix height={16} />
              </div>
            )}

            <Table
              rowKey="key"
              size="small"
              dataSource={this.getDataTranferbonus()}
              columns={this.state.columns_2}
              pagination={{
                pageSize: 20,
              }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="info-circle" />
                {translate('ftpTranfer.ftpConfig')}
              </span>
            }
            key="2"
          >
            <InfoFTP
              onSaveFtpConfig={this.handleSaveFtpConfig}
              transferFtpInfo={_.get(
                this.state,
                'organization.transferFtpInfo',
                []
              )}
              _id={_.get(this.state, 'organization._id', 'vasoft-2018')}
            />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
