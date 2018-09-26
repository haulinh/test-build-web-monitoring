import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Checkbox, InputNumber, Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from 'containers/auth/breadcrumb'
import createLanguage, { langPropTypes, translate } from 'hoc/create-lang'
import StationAutoApi from 'api/StationAuto'
import AuthApi from 'api/AuthApi'
import DynamicTable from 'components/elements/dynamic-table'
import * as _ from 'lodash'
import swal from 'sweetalert2'

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const FormItem = Form.Item

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
      iconLoading: false,
      dataStatus: [],
      dataChange: {}
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
      stationList: stationList
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
    // console.log(dataChange)
  }

  saveData = async (stationList, dataChange, userInfo) => {
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
  }

  onChangeNumber = (val, { key }, field) => {
    this.setStationOption(val, key, field)
  }

  getHead = () => {
    const {
      lang: { t }
    } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('userManager.roleAssign.name'), width: 15 },
      { content: t('configStation.warningStatus'), width: 10 },
      { content: t('configStation.showStation'), width: 10 },
      { content: t('configStation.numericalOrder'), width: 3 }
    ]
  }
  getRows = () => {
    return _.map(this.state.stationList, (row, index) => [
      { content: index + 1 },
      { content: row.name },
      {
        content: (
          <Checkbox
            defaultChecked={_.get(row, 'options.warning.allowed', false)}
            name="warning.allowed"
            data={row}
            onChange={this.onChangeCheckbox}
          />
        )
      },
      {
        content: (
          <Checkbox
            defaultChecked={_.get(row, 'options.display.allowed', false)}
            name="display.allowed"
            data={row}
            onChange={this.onChangeCheckbox}
          />
        )
      },
      {
        content: (
          <InputNumber
            size="small"
            data={row}
            defaultValue={_.get(row, 'options.numericalOrder')}
            onChange={val => this.onChangeNumber(val, row, 'numericalOrder')}
          />
        )
      }
    ])
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            {
              id: 'configStation',
              name: this.props.lang.t('profileUser.configStation')
            }
          ]}
        />
        <Toolbar>
          <Button
            type="primary"
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
        <DynamicTable
          loading={!this.state.isLoaded}
          rows={this.getRows()}
          head={this.getHead()}
          dataSource={this.state.dataStations}
          paginationOptions={{
            itemPerPage: 10,
            page: 27
          }}
        />
      </PageContainer>
    )
  }
}
