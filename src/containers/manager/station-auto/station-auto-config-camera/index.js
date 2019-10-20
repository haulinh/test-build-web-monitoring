import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Table, Checkbox, Collapse, Button, Icon, message} from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import StationAutoSearchForm from '../station-auto-search.1'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'

import FormAddCamera from './formAddCamera'

const { Panel } = Collapse;

const i18n = {
  tableHeaderName: translate('stationAutoManager.list.camera.name'),
  tableHeaderAddress: translate('stationAutoManager.list.camera.addr'),
  tableHeaderAllowCamera: translate('stationAutoManager.list.camera.allowView'),
  btnSave: translate('addon.save'),
  successSubmit: translate('addon.onSave.update.success'),
  errorSubmit: translate('addon.onSave.update.error')
}

const TableWrapper = styled(Table)`
.table-row-camera {
  background-color: #d9d9d9;
}
`

@protectRole(ROLE.STATION_AUTO.VIEW)
@createManagerList({
  apiList: StationAutoApi.getStationAutos
})
@createManagerDelete({
  apiDelete: StationAutoApi.removeStationAuto
})
@Form.create()
@autobind
export default class StationAutoConfigCamera extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length ) {
      const allowedStations = nextProps.dataSource.map(station => _.get(station, 'options.camera.allowed'), false)
      this._checkIndeterminate(allowedStations)
      this.setState({
        dataSourceOriginal: _.cloneDeep(nextProps.dataSource),
        dataSource: _.cloneDeep(nextProps.dataSource)
      })
    }
  }

  static defaultProps = {
    dataSource:  []
  }

  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSource: [],             /* working dir */
      dataSourceOriginal: [],     /* index */

      isCameraIndeterminate: false,
      submitingCameraAllow: false
    }
  }
  
  render() {
    const { submitingCameraAllow } = this.state

    const columns = this._getTableColumns()
    const dataSource = this._getTableDataSource(this.state.dataSource)

    const defaultExpandedRowKeys = dataSource.map(item => item.key)
    
    return (
      <PageContainer>
        <Breadcrumb items={['configCamera']} />

        {/* FORM CONTROL */}
        <Row style={{marginBottom: 20}}>
          <StationAutoSearchForm
            onChangeSearch={this.props.onChangeSearch}
            initialValues={this.props.data}
          />
        </Row>

        <TableWrapper
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          size="small"
          expandRowByClick
          rowKey="key"
          expandedRowKeys={defaultExpandedRowKeys}
          rowClassName={() => "table-row-camera"}
          expandIcon={() => null}
          expandedRowRender={(record) => {
            return (
              <Collapse accordion style={{marginLeft: -35}} key={record._id}>
                {record.stations.map((station) => (
                  <Panel header={this._renderCollapsePanelHeader(station)} key={station._id}>
                    <FormAddCamera stationAuto={station} allowed={this.props.form.getFieldValue(`stations.${station._id}`)}/>
                  </Panel>
                ))}
              </Collapse>
            )
          }}
        />

        <Button 
          block 
          loading={submitingCameraAllow}
          type="primary" 
          onClick={this._handleSubmit}
        >
          {i18n.btnSave}
        </Button>
      </PageContainer>
    )
  }

  _checkIndeterminate(allowedStations) {
    const countBy = _.countBy(allowedStations)

    if(countBy.true && countBy.false) {
      this.setState({isCameraIndeterminate: true})
    }
    else {
      this.setState({isCameraIndeterminate: false})

      const {setFieldsValue} = this.props.form
      if (countBy['true']) setFieldsValue({'checkall': true})
      if (countBy['false']) setFieldsValue({'checkall': false})
    }
  }

  _getTableColumns() {
    return [
      {
        title: i18n.tableHeaderName,
        render: (text, record, index) => <strong>{record.type.name} ({record.count})</strong>,
      },
      {
        title: i18n.tableHeaderAddress,
        render: (text, record, index) => <strong>{record.type.address}</strong>,
      },
      {
        title: <div>
          {this.props.form.getFieldDecorator('checkall', {
            valuePropName: 'checked',
          })(
            <Checkbox onClick={this._handleCheckAll} indeterminate={this.state.isCameraIndeterminate}>{i18n.tableHeaderAllowCamera}</Checkbox>
          )}
        </div>,
        align: 'right'
      },
      {
        title: '',
        align: 'right'
      },
    ]
  }

  /**
   * @return
   * [
   *  {
   *    key: '',
   *    count: number,
   *    type: <stationType>,
   *    stations: <[stationAuto]>
   *  }
   * ]
   */
  _getTableDataSource(dataSource = []) { 
    /* đánh số thứ  */
    let sortedDataSource = _.sortBy(dataSource, 'stationType.key')
    const _dataSource = sortedDataSource.map((item, index) => ({
      stt: index + 1,
      ...item
    }))
    const result = _dataSource.reduce((prev, current) => {
      const stationType = current.stationType
      const stationTypeID = stationType._id
      
      const prevItems = _.get(prev, [stationTypeID, 'stations'], [])
      
      _.set(prev, [stationTypeID, 'stations'], [...prevItems, current])
      _.set(prev, [stationTypeID, 'count'], prevItems.length + 1)
      _.set(prev, [stationTypeID, 'type'], stationType)
      _.set(prev, [stationTypeID, 'key'], stationTypeID)
      
      return prev
    }, {})
    
    let data = Object.values(result)
    
    return data
  }

  _renderCollapsePanelHeader(station) {
    const {getFieldDecorator} = this.props.form
    const numOfCameras = _.get(station, 'options.camera.list', []).length
    return  (
      <Row type="flex" justify="center" align="middle">
        <Col span={8}>{`${station.stt}  ${station.name}`}</Col>
        <Col span={12}>{station.address}</Col>
        <Col span={3} style={{textAlign: 'center'}}>{
          getFieldDecorator(`stations.${station._id}`, {
            initialValue: _.get(station, 'options.camera.allowed'),
            valuePropName: 'checked',
            onChange: this._handleChangedStationCheckbox,
          })(
            <Checkbox></Checkbox>
          )
        }</Col>
        <Col span={1}>{numOfCameras} <Icon type="camera" /></Col>
      </Row>
    )
  }

  _handleChangedStationCheckbox(e) {
    const {id, checked} = e.target

    const { getFieldsValue } = this.props.form
    const formValues = getFieldsValue()
    _.set(formValues, id, checked)

    const allowedStations = Object.values(formValues.stations)
    this._checkIndeterminate(allowedStations)
  }

  _handleCheckAll(e) {
    const { getFieldsValue, setFieldsValue } = this.props.form
    const values = getFieldsValue()

    const allowedStations = _.get(values, 'stations', {})
    const checkedAll = e.target.checked

    /* chỉ set value các checkbox có giá trị khác so với checkbox checkAll */
    for(let [stationID, value] of Object.entries(allowedStations)) {
      value = value || false // vi value co the co gia tri undefined
      if (value !== checkedAll) {
        setFieldsValue({[`stations.${stationID}`]: checkedAll})
      }
    }

    this.setState({isCameraIndeterminate: false})
  }

  async _handleSubmit() {
    const stationAutos = this.props.dataSource
    const { getFieldValue} = this.props.form

    let submitData = {}
    stationAutos.forEach(station => {
      submitData[station._id] = {
        camera: {
          allowed: getFieldValue(`stations.${station._id}`),
          list: _.get(station, 'options.camera.list', [])
        }
      }
    })

    this.setState({submitingCameraAllow: true})
    const res = await StationAutoApi.updateStationAutoOptions(submitData)

    this.setState({submitingCameraAllow: false})

    if (res.success) {
        return message.success(i18n.successSubmit)
    }
    
    return message.error(i18n.errorSubmit)
  }
}