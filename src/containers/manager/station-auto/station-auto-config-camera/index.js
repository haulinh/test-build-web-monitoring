import { Collapse, Form, message, Table } from 'antd'
import StationAutoApi from 'api/StationAuto'
import Clearfix from 'components/elements/clearfix'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
import ROLE from 'constants/role'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerList from 'hoc/manager-list'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Breadcrumb from '../breadcrumb'
import StationAutoSearchForm from '../station-auto-search.1'
import CollapsePanelHeader from './CollapsePanelHeader'
import FormAddCamera from './formAddCamera'

const { Panel } = Collapse

function i18n() {
  return {
    tableHeaderName: translate('stationAutoManager.list.camera.name'),
    tableHeaderAddress: translate('stationAutoManager.list.camera.addr'),
    tableHeaderAllowCamera: translate(
      'stationAutoManager.list.camera.allowView'
    ),
    btnSave: translate('addon.save'),
    successSubmit: translate('addon.onSave.update.success'),
    errorSubmit: translate('addon.onSave.update.error'),
  }
}

const TableWrapper = styled(Table)`
  .table-row-camera {
    background-color: #d9d9d9;
  }
`

@protectRole(ROLE.CAU_HINH_CAMERA.VIEW)
@createManagerList({
  apiList: StationAutoApi.getStationAutos,
})
@createManagerDelete({
  apiDelete: StationAutoApi.removeStationAuto,
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
    if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length) {
      const allowedStations = nextProps.dataSource.map(
        station => _.get(station, 'options.camera.allowed'),
        false
      )
      const stationsCanViewCamera = nextProps.dataSource.filter(station => {
        const isShow = _.get(station, 'removeStatus.allowed', false)
        return !isShow
      })
      this._checkIndeterminate(allowedStations)
      this.setState(
        {
          dataSourceOriginal: _.cloneDeep(stationsCanViewCamera),
          dataSource: _.cloneDeep(stationsCanViewCamera),
        },
        () => {
          // this.state.dataSource.forEach(stationType => {
          //   stationType.forEach(station => console.log('station', station))
          //   // this[station._id] = React.createRef()
          // })
          // console.log('this.state.dataSource', this.state.dataSource)
          this.state.dataSource.forEach(station => {
            this[station._id] = React.createRef()
          })
        }
      )
    }
  }

  static defaultProps = {
    dataSource: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      /* giông cách hoạt động của git */

      cachedData: {} /* commit */,
      dataSource: [] /* working dir */,
      dataSourceOriginal: [] /* index */,

      isCameraIndeterminate: false,
      submittingCameraAllow: false,
    }
  }

  async handleUpdateCameraList(data) {
    let id = _.get(data, '_id', null)
    if (id === null) return
    let originalData = this.state.dataSource

    // update object chứa camera list thay đổi
    let updatedData = _.map(originalData, item => {
      // chinh cho Cuong == thanh ===
      if (item._id === id) {
        return data
      }
      return item
    })
    updatedData = await Promise.all(updatedData)
    this.setState({
      dataSource: updatedData,
    })
  }

  _checkIndeterminate(allowedStations) {
    const countBy = _.countBy(allowedStations)

    if (countBy.true && countBy.false) {
      this.setState({ isCameraIndeterminate: true })
    } else {
      this.setState({ isCameraIndeterminate: false })

      const { setFieldsValue } = this.props.form
      if (countBy['true']) setFieldsValue({ checkall: true })
      if (countBy['false']) setFieldsValue({ checkall: false })
    }
  }

  _getTableColumns() {
    return [
      {
        title: i18n().tableHeaderName,
        key: 'title',
        render: (text, record, index) => (
          <strong>
            {record.type.name} ({record.count})
          </strong>
        ),
      },
      {
        title: i18n().tableHeaderAddress,
        key: 'address',
        render: (text, record, index) => <strong>{record.type.address}</strong>,
      },
      // {
      //   title: (
      //     <div>
      //       {this.props.form.getFieldDecorator('checkall', {
      //         valuePropName: 'checked',
      //       })(
      //         // <Checkbox
      //         //   onClick={this._handleCheckAll}
      //         //   indeterminate={this.state.isCameraIndeterminate}
      //         // >
      //         //   {i18n().tableHeaderAllowCamera}
      //         // </Checkbox>
      //       )}
      //     </div>
      //   ),
      //   key: 'checkall',
      //   align: 'right',
      // },
      {
        title: '',
        align: 'right',
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
      ...item,
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

  // NOTE: this function is not used anymore
  // _renderCollapsePanelHeader(station) {
  //   const { getFieldDecorator } = this.props.form
  //   console.log('getFieldDecorator :>> ', getFieldDecorator);

  //   const numOfCameras = _.get(station, 'options.camera.list', []).length
  //   return (
  //     <Row type="flex" justify="center" align="middle">
  //       <Col span={8}>{`${station.stt}  ${station.name}`}</Col>
  //       <Col span={12}>{station.address}</Col>
  //       <Col span={3} style={{ textAlign: 'center' }}>
  //         {getFieldDecorator(`stations.${station._id}`, {
  //           initialValue: _.get(station, 'options.camera.allowed'),
  //           valuePropName: 'checked',
  //           onChange: this._handleChangedStationCheckbox,
  //         })(<Checkbox onClick={e => e.stopPropagation()} />)}
  //       </Col>
  //       <Col span={1}>
  //         {numOfCameras} <Icon type="camera" />
  //       </Col>
  //     </Row>
  //   )
  // }

  // async _handleChangedStationCheckbox(e) {
  //   e.stopPropagation()
  //   const { id, checked } = e.target
  //   const stationId = id.split('.')[1]

  //   await enableCamera(stationId, checked)
  // }

  // NOTE: this function is not used anymore
  _handleCheckAll(e) {
    return
  }

  async _handleSubmit() {
    const stationAutos = this.props.dataSource
    const { getFieldValue } = this.props.form

    let submitData = {}
    stationAutos.forEach(station => {
      submitData[station._id] = {
        camera: {
          allowed: getFieldValue(`stations.${station._id}`),
          list: _.get(station, 'options.camera.list', []),
        },
      }
    })

    this.setState({ submittingCameraAllow: true })
    const res = await StationAutoApi.updateStationAutoOptions(submitData)

    this.setState({ submittingCameraAllow: false })

    if (res.success) {
      return console.log('submit success')
      // return message.success(i18n().successSubmit)
    }

    return message.error(i18n().errorSubmit)
  }

  render() {
    // const { submittingCameraAllow } = this.state

    const columns = this._getTableColumns()
    const dataSource = this._getTableDataSource(this.state.dataSource)
    // console.log('render -> dataSource', dataSource)

    const defaultExpandedRowKeys = dataSource.map(item => item.key)

    return (
      <PageContainer
        center={
          <HeaderSearchWrapper>
            <StationAutoSearchForm
              onChangeSearch={this.props.onChangeSearch}
              initialValues={this.props.data}
            />
          </HeaderSearchWrapper>
        }
      >
        <Breadcrumb items={['configCamera']} />
        <Clearfix height={16} />
        <TableWrapper
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          size="small"
          expandRowByClick
          rowKey="key"
          expandedRowKeys={defaultExpandedRowKeys}
          rowClassName={() => 'table-row-camera'}
          expandIcon={() => null}
          expandedRowRender={record => {
            return (
              <Collapse accordion style={{ marginLeft: -35 }} key={record.key}>
                {record.stations.map(station => {
                  return (
                    <Panel
                      // header={this._renderCollapsePanelHeader(station)}
                      header={
                        <CollapsePanelHeader
                          ref={this[station._id]}
                          station={station}
                          {...this.props}
                        />
                      }
                      key={station._id}
                    >
                      <FormAddCamera
                        refHeader={this[station._id]}
                        stationAuto={station}
                        allowed={this.props.form.getFieldValue(
                          `stations.${station._id}`
                        )}
                        onSubmit={this.handleUpdateCameraList}
                      />
                    </Panel>
                  )
                })}
              </Collapse>
            )
          }}
        />

        {/* <Button
          block
          loading={submittingCameraAllow}
          type="primary"
          onClick={this._handleSubmit}
        >
          {i18n().btnSave}
        </Button> */}
      </PageContainer>
    )
  }
}
