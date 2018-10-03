import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spin, Checkbox, InputNumber, Button, Table } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from 'containers/auth/breadcrumb'
import createLanguage, { langPropTypes, translate } from 'hoc/create-lang'
import StationAutoApi from 'api/StationAuto'
import AuthApi from 'api/AuthApi'
import * as _ from 'lodash'
import swal from 'sweetalert2'

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 16px;
`

@createLanguage
export default class ConfigStation extends React.Component {
  static propTypes = {
    pagination: PropTypes.object,
    pathImg: PropTypes.string,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes
  }
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      stationList: [],
      isLoaded: false,
      dataStations: [],
      dataStatus: [],
      dataChange: {},
      idLoadingSave: false,
      pagination: {
        current: 1,
        pageSize: 15
      }
    }
  }

  async componentDidMount() {
    const MAX_VALUE = 99999
    let rs = await AuthApi.getMe()
    const userInfo = _.get(rs, 'data', {})
    const rsStationList = _.get(userInfo, 'stationAutos', [])
    const objStation = _.keyBy(rsStationList, 'key')

    let rsStation = await StationAutoApi.getStationAutos(
      { itemPerPage: MAX_VALUE },
      {}
    )
    const tmp = _.get(rsStation, 'data', [])
    const stationList = _.map(tmp, item => {
      const options = {
        ..._.get(item, 'options', {}),
        ..._.get(objStation, `${item.key}.options`, {})
      }
      return { ...item, options }
    })
    this.setState({
      isLoaded: true,
      userInfo,
      stationList,
      pagination: { ...this.state.pagination, total: _.size(stationList) }
    })
  }

  onChangeCheckbox = event => {
    this.setStationOption(
      event.target.checked,
      event.target.data.key,
      event.target.name
    )
  }

  setStationOption = (val, key, field) => {
    let dataChange = this.state.dataChange
    const opt = _.set({}, field, val)
    const opOrigin = _.get(dataChange[key], 'options', {})
    dataChange[key] = { options: { ...opOrigin, ...opt } }
    this.setState({ dataChange })
  }

  async saveData(stationList, dataChange, userInfo) {
    this.setState({ idLoadingSave: true })
    const stationAutos = _.map(stationList, item => {
      const options = {
        ..._.get(item, 'options', {}),
        ..._.get(dataChange, `${item.key}.options`, {})
      }
      return { ...item, options }
    })
    if (stationAutos && userInfo._id) {
      const rs = await AuthApi.updateConfigStataion(userInfo._id, stationAutos)
      const status = _.get(rs, 'success', false)
      swal({
        type: status ? 'success' : 'error',
        title: translate(
          `configStation.messageUpdate.${status ? 'success' : 'error'}`
        )
      })
    }
    this.setState({ idLoadingSave: false })
  }

  onChangeNumber = (val, { key }, field) => {
    this.setStationOption(val, key, field)
  }

  getIndex = index => {
    return (
      (this.state.pagination.current - 1) * this.state.pagination.pageSize +
      index +
      1
    )
  }

  getColumns = () => {
    return [
      {
        title: '#',
        dataIndex: 'Index',
        width: 60,
        key: 'Index',
        render: (value, record, index) => <div>{this.getIndex(index)}</div>
      },
      {
        title: this.props.lang.t('configStation.name'),
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        },
        render: value => value
      },
      {
        title: this.props.lang.t('configStation.warningStatus'),
        dataIndex: 'options.warning.allowed',
        key: 'options.warning.allowed',
        align: 'center',
        width: '18%',
        render: (value, row) => (
          <Checkbox
            defaultChecked={_.get(
              this.state.dataChange,
              `${row.key}.options.warning.allowed`,
              value
            )}
            name="warning.allowed"
            data={row}
            onChange={this.onChangeCheckbox}
          />
        )
      },
      {
        title: this.props.lang.t('configStation.showStation'),
        dataIndex: 'options.display.allowed',
        width: '18%',
        key: 'options.display.allowed',
        align: 'center',
        render: (value, row) => (
          <Checkbox
            defaultChecked={_.get(
              this.state.dataChange,
              `${row.key}.options.display.allowed`,
              value
            )}
            name="display.allowed"
            data={row}
            onChange={this.onChangeCheckbox}
          />
        )
      },
      {
        title: this.props.lang.t('configStation.numericalOrder'),
        dataIndex: 'options.numericalOrder',
        key: 'options.numericalOrder',
        align: 'right',
        width: '18%',
        render: (value, row) => (
          <InputNumber
            size="small"
            data={row}
            defaultValue={_.get(
              this.state.dataChange,
              `${row.key}.options.numericalOrder`,
              value
            )}
            onChange={val => this.onChangeNumber(val, row, 'numericalOrder')}
          />
        )
      }
    ]
  }

  handleChangePage = pagination => {
    this.setState({ pagination })
  }

  render() {
    return (
      <PageContainer>
        <Spin
          spinning={this.state.idLoadingSave}
          tip={`${this.props.lang.t('addon.save')}...`}
        >
          <Breadcrumb
            items={[
              {
                id: 'configStation',
                name: this.props.lang.t('configStation.breadCrumb')
              }
            ]}
          />
          <Toolbar>
            <Button
              type="primary"
              loading={this.state.idLoadingSave}
              onClick={() =>
                this.saveData(
                  this.state.stationList,
                  this.state.dataChange,
                  this.state.userInfo
                )
              }
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
            >
              {' '}
              {this.props.lang.t('addon.save')}{' '}
            </Button>
          </Toolbar>
          <Table
            rowKey="key"
            size="small"
            loading={!this.state.isLoaded}
            columns={this.getColumns()}
            dataSource={this.state.stationList}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>{_.get(record, 'address', '')}</p>
            )}
            pagination={this.state.pagination}
            onChange={this.handleChangePage}
          />
        </Spin>
      </PageContainer>
    )
  }
}
