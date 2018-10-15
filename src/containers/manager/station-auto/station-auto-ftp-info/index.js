import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { Icon, Card, Table, Button, Spin, message } from 'antd'
import moment from 'moment'
import FtpApi from 'api/FtpApi'
import * as _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import createManagerEdit from 'hoc/manager-edit'
import FtpInfoView from './ftp-info-view'
import FtpOptionView from './option-view'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { translate } from 'hoc/create-lang'
import swal from 'sweetalert2'

@connect(state => ({
  organization: state.auth.userInfo.organization
}))
@createManagerEdit({
  apiGetByKey: StationAutoApi.getStationAuto
})
@autobind
export default class StationAutoFtpInfo extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      // breadcrumb: ['list'],
      folderList: [],
      path: '',
      ftpInfo: {},
      pagination: {
        page: 1,
        pageSize: 20,
        position: 'none'
      },
      isFullPath: true,
      isExplorer: false,
      loadingTable: false,
      pathSelected: [_.get(props, 'organization.ftpPath', '/')]
    }

    this.columns = [
      {
        title: translate('stationAutoManager.ftpFile.folderName'),
        dataIndex: 'fileName',
        key: 'fileName',
        render: (text, record) => (
          <span>
            <Icon
              type={ record.isDirectory ? 'folder' : 'file-text' }
              style={{ color: record.isDirectory ? '#FFE793' : '#ddd', marginRight: 8 }}
              theme='filled'
            />
            <a href="javascript:;">{text}</a>
          </span>
        )
      },
      {
        title: translate('stationAutoManager.ftpFile.updateAt'),
        dataIndex: 'mtime',
        key: 'mtime',
        render: mtime => <div>{moment(mtime).format(DD_MM_YYYY_HH_MM)}</div>
      }
    ]
  }

  fetchFolder = async (params = { path: '', isFullPath: true }) => {
    const res = await FtpApi.getFtpFiles({...this.state.pagination, itemPerPage: 10000}, params)
    
    const total =  _.get(res, 'pagination.totalItem', 0)
    const position = total > this.state.pagination.pageSize ? 'bottom' : 'none'
    this.setState({
      isLoading: false,
      loadingTable: false,
      pagination: {...this.state.pagination, current: 1, page: 1, total, position},
      folderList: _.get(res, 'data', [])
    })
    return res
  }

  fetchFtpInfo = async path => {
    const rs = await FtpApi.getInfoByPath(path)
    return rs
  }

  createFolder = async path => {
    const params = {}
    this.setState({ isLoading: true })
    let res = await FtpApi.createFTPFolder({ path })
    if (_.get(res, 'success', false)) {
      this.updateConfigLogger(path, false)
      const ftpInfo = await this.fetchFtpInfo(path)
      if (ftpInfo.data) {
        params.ftpInfo = ftpInfo.data
      }
    } else {
      message.error(res.message)
    }

    this.setState({ ...params, isLoading: false })
  }

  updateConfigLogger = async (path, isUpdate) => {
    const params = {}
    this.setState({ isLoading: true })
    let config = {
      options: { ...this.props.data.options },
      configLogger: {
        ...this.props.data.configLogger,
        path: path
      }
    }
    let res = await StationAutoApi.updateStationAutoConfig(
      _.get(this.props, 'data._id'),
      config
    )
    if (res.success) {
      let textStatus = ''
      if(isUpdate){
        textStatus = translate('stationAutoManager.ftpFile.updateFTPSuccess')
      }else{ textStatus = translate('stationAutoManager.ftpFile.createFTPSuccess') }
      swal({
        type: 'success',
        text: textStatus
      })
      const ftpInfo = await this.fetchFtpInfo(path)
      if (ftpInfo.data) {
        params.ftpInfo = ftpInfo.data
      }
    } else {
      message.error(res.message)
    }
    this.setState({ ...params, isLoading: false })
  }

  handleUpdatePath = async () => {
    let pathUpdate = _.join(this.state.pathSelected, '/')
    this.updateConfigLogger(pathUpdate, true)
  }
  async componentDidMount() {
    const params = {}
    this.setState({ isLoading: true })
    // lay thong tin tram theo KEY
    await this.props.getItem()
    const path = _.get(this.props, 'data.configLogger.path')
    if (path) {
      params.path = path
      // lay thong tin ftp theo PATH
      const ftpInfo = await this.fetchFtpInfo(path)
      if (ftpInfo.data) {
        params.ftpInfo = ftpInfo.data
      }
    }

    params.isLoading = false
    this.setState(params)
  }

  handlePathEdit = e => {
    const address = _.get(this.state.ftpInfo, 'address')
    let pathSelected = [_.get(this.props, 'organization.ftpPath', '/')]
    let pathFtp = _.get(this.props, 'organization.ftpPath')
    if (!_.endsWith(pathFtp, '/')) {
      pathFtp = `${pathFtp}/`
    }

    if (address) {
      const arr = _.split(address, pathFtp)
      if (arr.length > 1) {
        pathSelected = pathSelected.concat(_.split(arr[1], '/'))
      }
      this.setState({ isExplorer: true, pathSelected, loadingTable: true })
      this.fetchFolder({ isFullPath: false, path: _.join(pathSelected, '/') })
    }
  }

  handleGeneralPath = action => {
    if (action) {
      let ftpPath = _.get(this.props, 'organization.ftpPath', '')
      let provincePath = _.get(this.props, 'data.province.key', '')
      let stationPath = _.get(this.props, 'data.key', '')
      const path = _.filter(
        [ftpPath, provincePath, stationPath],
        item => !_.isEmpty(item)
      )
      this.createFolder(_.join(path, '/'))
    } else {
      this.setState({ isExplorer: true })
      this.fetchFolder({
        isFullPath: false,
        path: _.join(this.state.pathSelected, '/')
      })
    }
  }

  onRowClick = ({ fileName, isDirectory }) => {
    return {
      onClick: () => {
        if (isDirectory) {
          const pathSelected = this.state.pathSelected
          pathSelected.push(fileName)
          this.setState({ pathSelected, loadingTable: true })
          this.fetchFolder({ isFullPath: false, path: _.join(pathSelected, '/') })
        }
      }
    }
  }

  handleBack = () => {
    const pathSelected = this.state.pathSelected
    pathSelected.pop()
    this.setState({ pathSelected, loadingTable: true })
    this.fetchFolder({ isFullPath: false, path: _.join(pathSelected, '/') })
  }

  renderTitleFolder = () => {
    return (
      <span>
        {_.size(this.state.pathSelected) > 1 ? (
          <span onClick={this.handleBack}>
            <Icon
              style={{ padding: 2, color: 'blue' }}
              type="arrow-left"
              theme="outlined"
            />
          </span>
        ) : (
          ` `
        )}
        <strong>{_.join(this.state.pathSelected, '/')}</strong>
      </span>
    )
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`

  handleChangePage =  pagination => {
    this.setState({pagination})
    //console.log('pagination: ', pagination)
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb
          items={[
            'list',
            {
              id: 'ftpInfo',
              name:
                this.props.isLoaded && this.props.success
                  ? this.props.data.name
                  : null
            }
          ]}
        />
        <Spin tip="Loading..." spinning={this.state.isLoading}>
          {_.isEmpty(this.state.ftpInfo) ? (
            <FtpOptionView onClick={this.handleGeneralPath} />
          ) : (
            <FtpInfoView {...this.state.ftpInfo} onEdit={this.handlePathEdit} />
          )}
          {this.state.isExplorer && (
            <Card
              title={this.renderTitleFolder()}
              extra={
                <Button
                  type="primary"
                  onClick={this.handleUpdatePath}
                  icon="save"
                >
                  {translate('addon.save')}
                </Button>
              }
            >
              <Table
                onRow={this.onRowClick}
                rowKey="fileName"
                dataSource={this.state.folderList}
                columns={this.columns}
                pagination={{...this.state.pagination, showTotal: this.showTotal}}
                onChange={this.handleChangePage}
                loading={this.state.loadingTable}
              />
            </Card>
          )}
        </Spin>
      </PageContainer>
    )
  }
}
