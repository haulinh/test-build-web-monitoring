import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Table, Checkbox, Collapse} from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
// import { updateStationAutoOptions } from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
// import createLanguageHoc from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
// import { translate } from 'hoc/create-lang'
// import { mapPropsToFields } from 'utils/form'
import StationAutoSearchForm from '../station-auto-search.1'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
// import { SAMPLING_CONFIG_TABLE_COLUMN } from 'constants/labels'
// import swal from 'sweetalert2'

// import DynamicTable from 'components/elements/dynamic-table'
// import { resetAllCounts } from 'redux/actions/notification'

import FormAddCamera from './formAddCamera'

const { Panel } = Collapse;

const i18n = {
  tableHeaderName: 'Name',
  tableHeaderAddress: 'Address',
  tableHeaderAllowCamera: 'Allow Viewing Camera',
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
@Form.create({})
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
      this.setState({
        dataSourceOriginal: _.cloneDeep(nextProps.dataSource),
        dataSource: _.cloneDeep(nextProps.dataSource)
      })
      // this.checkIndeterminate(SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING, nextProps.dataSource)
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

      isSave: false,

      isSamplingIndeterminate: true,
      isSamplingCheckAll: false,
    }

    // this.stt = 0 // stt các record khi expanded
  }

  
  render() {
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
                    <FormAddCamera stationAuto={station}/>
                  </Panel>
                ))}
              </Collapse>
            )
          }}
        />
      </PageContainer>
    )
  }

  _renderCollapsePanelHeader(station) {
    const {getFieldDecorator} = this.props.form

    return  (
      <Row type="flex" justify="center" align="middle">
        <Col span={8}>{`${station.stt}  ${station.name}`}</Col>
        <Col span={12}>{station.address}</Col>
        <Col span={4} style={{textAlign: 'center'}}>{
          getFieldDecorator(station._id, {
            initialValue: _.get(station, 'options.camera.allowed'),
            valuePropName: 'checked'
          })(
            <Checkbox></Checkbox>
          )
        }</Col>
      </Row>
    )
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
        title: <Checkbox>{i18n.tableHeaderAllowCamera}</Checkbox>,
        align: 'right',
        render: (text, record, index) => <strong>{record.type.allowCamera}</strong>,
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
    console.log('dataSource', data)
    
    return data
  }

}