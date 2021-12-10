import { Button, Col, Form, message, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { toggleQaqcConfig } from 'api/CategoryApi'
import { Clearfix } from 'components/layouts/styles'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React, { Component } from 'react'
import { ModalConfirmDelete } from '../components/index'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
  STATION_AUTO_ID: 'stationId',
}

export const i18n = () => ({
  list: {
    placeholder: {
      station: t('qaqcConfig.advanced.placeholder.station'),
    },
    toggle: t('qaqcConfig.advanced.timeFilter.toggle'),
    table: {
      station: t('qaqcConfig.advanced.timeFilter.table.title.station'),
      parameter: t('qaqcConfig.advanced.timeFilter.table.title.parameter'),
      status: t('qaqcConfig.advanced.timeFilter.table.title.status'),
      expire: t('qaqcConfig.advanced.timeFilter.table.expire'),
      inUse: t('qaqcConfig.advanced.timeFilter.table.inUse'),
      footer: t('qaqcConfig.advanced.timeFilter.table.footer'),
    },
  },
  form: {
    label: {
      stationType: t('qaqcConfig.advanced.label.stationType'),
      station: t('qaqcConfig.advanced.label.station'),
    },
    table: {
      parameter: t('qaqcConfig.advanced.timeFilter.form.table.title.parameter'),
      timeRange: t('qaqcConfig.advanced.timeFilter.form.table.title.timeRange'),
    },
    placeholder: {
      stationType: t('qaqcConfig.advanced.placeholder.stationType'),
      station: t('qaqcConfig.advanced.placeholder.station'),
      timeRange: {
        startTime: t(
          'qaqcConfig.advanced.timeFilter.form.placeholder.startTime'
        ),
        endTime: t('qaqcConfig.advanced.timeFilter.form.placeholder.endTime'),
      },
    },
    error: {
      time: t('qaqcConfig.advanced.timeFilter.form.error.time'),
    },
  },
  modal: {
    create: {
      title: t('qaqcConfig.advanced.modal.create.title'),
    },
    edit: {
      title: t('qaqcConfig.advanced.modal.edit.title'),
    },
  },
  button: {
    reset: t('qaqcConfig.advanced.button.reset'),
    create: t('qaqcConfig.advanced.button.create'),
    delete: t('qaqcConfig.advanced.button.delete'),
    update: t('qaqcConfig.advanced.button.update'),
  },
})

@Form.create()
export default class FilterTimeContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalFilterTime: false,
      isModalConfirmDelete: false,
      isModalConfirmCancel: false,
      isLoading: false,
      filterItemId: '',
      modalType: '',
      dataFilterTime: [],
      dataItemFilterTimeSelected: {},
    }
  }

  componentDidMount = () => {
    this.getData()
  }

  showModalCreate = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION_TYPE, FIELDS.STATION_AUTO_ID])
    this.setState({
      modalType: 'create',
      isModalFilterTime: true,
    })
  }

  showModalConfirmDelete = () => {
    this.setState({
      isModalConfirmDelete: true,
    })
  }

  closeModalConfirmDelete = () => {
    this.setState({
      isModalConfirmDelete: false,
    })
  }

  setItemDelete = filterItemId => {
    this.setState({
      isModalConfirmDelete: true,
      filterItemId,
    })
  }

  setItemEdit = filterItemId => {
    const { dataFilterTime } = this.state

    const dataItemFilterTimeSelected = dataFilterTime.find(
      data => data._id === filterItemId
    )
    // form.resetFields(['conditions'])

    this.setState({
      filterItemId,
      modalType: 'edit',
      isModalFilterTime: true,
      dataItemFilterTimeSelected,
    })
  }

  getData = async () => {
    this.setState({
      isLoading: true,
    })

    const params = {
      ...this.pagination,
      type: 'time',
    }

    try {
      const response = await CalculateApi.getQaqcConfigs(params)

      this.setState({
        dataFilterTime: response.results,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  handleDeleteFilterItem = async () => {
    const { filterItemId } = this.state

    try {
      await CalculateApi.deleteQaqcConfig(filterItemId)
      this.setState({
        isModalConfirmDelete: false,
        isModalFilterTime: false,
      })
      message.success(t('addon.onDelete.success'))
    } catch (error) {
      this.setState({
        isModalConfirmDelete: false,
        isModalFilterTime: false,
      })
      message.error(t('addon.onDelete.error'))
    }

    this.getData()
  }

  pagination = {
    limit: 999999,
    offset: 0,
  }

  handleSearchFilterTime = async () => {
    this.setState({
      isLoading: true,
    })

    const { form } = this.props
    const stationKeyList = form.getFieldValue(FIELDS.STATION_AUTO)
    let params = {
      ...this.pagination,
    }

    if (!_.isEmpty(stationKeyList)) {
      const stationKeysStr = _.join(stationKeyList, ',')
      params = {
        stationKeys: stationKeysStr,
        ...params,
      }
    }

    try {
      const response = await CalculateApi.getQaqcConfigs(params)
      this.setState({
        dataFilterTime: response.results,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  handleFinishSubmit = isModalFilterTime => {
    this.setState({
      isModalFilterTime,
    })
    this.getData()
  }

  handleToggleFilter = async value => {
    const { toggleExcludeParametersByTime } = this.props
    const param = {
      excludeParametersByTime: value,
    }

    await toggleQaqcConfig(param)
    toggleExcludeParametersByTime(value)
  }

  handleConfirmCancel = value => {
    this.setState({
      isModalFilterTime: value,
    })
  }

  clearDataItemFilterTime = () => {
    this.setState({ dataItemFilterTimeSelected: {} })
  }

  render() {
    const { form, excludeParametersByTime } = this.props

    const {
      isModalFilterTime,
      isModalConfirmDelete,
      modalType,
      dataFilterTime,
      isLoading,
      dataItemFilterTimeSelected,
    } = this.state

    const DynamicModalFilterTime = {
      create: (
        <ModalFilterTime
          modalTitle={i18n().modal.create.title}
          visible={isModalFilterTime}
          showModal={this.handleFinishSubmit}
          form={form}
          confirmCancel={this.handleConfirmCancel}
          clearDataItemFilterTime={this.clearDataItemFilterTime}
          modalType={modalType}
        />
      ),
      edit: (
        <ModalFilterTime
          modalTitle={i18n().modal.edit.title}
          visible={isModalFilterTime}
          showModal={this.handleFinishSubmit}
          // onCancel={this.closeModalFilterTime}
          modalType={modalType}
          form={form}
          clearDataItemFilterTime={this.clearDataItemFilterTime}
          setMeasureList={this.setMeasureList}
          confirmCancel={this.handleConfirmCancel}
          dataItemFilterTime={dataItemFilterTimeSelected}
          onShowModalConfirmDelete={this.showModalConfirmDelete}
        />
      ),
    }
    return (
      <div>
        <Row type="flex" span={24} justify="space-between" align="middle">
          <Col
            span={18}
            type="flex"
            style={{ display: 'flex', gap: 15, alignItems: 'center' }}
          >
            {form.getFieldDecorator(FIELDS.STATION_AUTO)(
              <SelectStationAuto
                placeholder={i18n().list.placeholder.station}
                mode="multiple"
                style={{ width: '100%' }}
                maxTagCount={3}
              />
            )}
            <Button
              shape="circle"
              icon="search"
              size="small"
              loading={isLoading}
              onClick={this.handleSearchFilterTime}
            />
          </Col>

          <Col style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Switch
              checked={excludeParametersByTime}
              onClick={this.handleToggleFilter}
            />
            <div
              style={{ fontWeight: 500, fontSize: '16px', color: '#111827' }}
            >
              {i18n().list.toggle}
            </div>
          </Col>
        </Row>

        <Clearfix height={20} />

        <TableFilterTime
          status={this.handleStatus}
          loading={isLoading}
          isDisable={!excludeParametersByTime}
          onEditFilterTime={this.setItemEdit}
          dataSource={dataFilterTime}
          onDeleteFilterTime={this.setItemDelete}
          onCreateFilterTime={this.showModalCreate}
        />

        <ModalConfirmDelete
          visible={isModalConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.handleDeleteFilterItem}
          onCancelDelete={this.closeModalConfirmDelete}
        />

        {DynamicModalFilterTime[modalType]}
      </div>
    )
  }
}
