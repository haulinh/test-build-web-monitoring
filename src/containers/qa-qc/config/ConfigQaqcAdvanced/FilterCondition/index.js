import { Button, Col, Form, Icon, message, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { toggleQaqcConfig } from 'api/CategoryApi'
import { Clearfix } from 'components/layouts/styles'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import React from 'react'
import ModalConditionFilter from './ModalConditionFilter'
import TableConditionFilter from './TableConditionFilter'
import { isEmpty } from 'lodash'
import { translate as t } from 'hoc/create-lang'

export const FIELDS = {
  FILTER_NAME: 'filterName',
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  STATION_ID: 'stationId',
  CONDITIONS: 'conditions',
}

export const i18n = () => ({
  list: {
    placeholder: {
      station: t('qaqcConfig.advanced.placeholder.station'),
    },
    toggle: t('qaqcConfig.advanced.conditionFilter.toggle'),
    table: {
      conditionName: t(
        'qaqcConfig.advanced.conditionFilter.table.title.conditionName'
      ),
      applicableStation: t(
        'qaqcConfig.advanced.conditionFilter.table.title.conditionName'
      ),
      conditionParameter: t(
        'qaqcConfig.advanced.conditionFilter.table.title.conditionParameter'
      ),
      excludeParameter: t(
        'qaqcConfig.advanced.conditionFilter.table.title.excludeParameter'
      ),
      footer: t('qaqcConfig.advanced.conditionFilter.table.footer'),
    },
  },
  form: {
    label: {
      filterName: t(
        'qaqcConfig.advanced.conditionFilter.form.label.filterName'
      ),
      stationType: t(
        'qaqcConfig.advanced.conditionFilter.form.label.stationType'
      ),
      station: t('qaqcConfig.advanced.conditionFilter.form.label.station'),
    },
    table: {
      conditionParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.table.title.conditionParameter'
      ),
      excludeParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.table.title.excludeParameter'
      ),
      footer: t('qaqcConfig.advanced.conditionFilter.form.table.footer'),
    },
    placeholder: {
      filterName: t(
        'qaqcConfig.advanced.conditionFilter.form.placeholder.filterName'
      ),
      stationType: t(
        'qaqcConfig.advanced.conditionFilter.form.placeholder.stationType'
      ),
      station: t(
        'qaqcConfig.advanced.conditionFilter.form.placeholder.station'
      ),
      conditionParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.placeholder.conditionParameter'
      ),
      value: t('qaqcConfig.advanced.conditionFilter.form.placeholder.value'),
      excludeParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.placeholder.excludeParameter'
      ),
    },
    error: {
      filterName: t(
        'qaqcConfig.advanced.conditionFilter.form.error.filterName'
      ),
      stationType: t(
        'qaqcConfig.advanced.conditionFilter.form.error.stationType'
      ),
      station: t('qaqcConfig.advanced.conditionFilter.form.error.station'),
      conditionParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.error.conditionParameter'
      ),
      value: t('qaqcConfig.advanced.conditionFilter.form.error.value'),
      excludeParameter: t(
        'qaqcConfig.advanced.conditionFilter.form.error.excludeParameter'
      ),
      maxInput: t('qaqcConfig.advanced.conditionFilter.form.error.maxInput'),
      whitespace: t(
        'qaqcConfig.advanced.conditionFilter.form.error.whitespace'
      ),
    },
  },
  modal: {
    create: {
      title: t('qaqcConfig.advanced.conditionFilter.modal.create.title'),
    },
  },
  button: {
    reset: t('qaqcConfig.advanced.button.reset'),
    create: t('qaqcConfig.advanced.button.create'),
    delete: t('qaqcConfig.advanced.button.delete'),
    update: t('qaqcConfig.advanced.button.update'),
  },
  message: {
    create: {
      success: t('qaqcConfig.advanced.message.create.success'),
      error: t('qaqcConfig.advanced.message.create.error'),
    },
    update: {
      success: t('qaqcConfig.advanced.message.update.success'),
      error: t('qaqcConfig.advanced.message.update.success'),
    },
    delete: {
      success: t('qaqcConfig.advanced.message.delete.success'),
      error: t('qaqcConfig.advanced.message.delete.success'),
    },
  },
})

@Form.create()
class FilterConditionContainer extends React.Component {
  state = {
    stationKey: '',
    isShowModalConditionFilter: false,
    isShowModalConfirmDelete: false,
    conditionItemKeySelected: '',
    conditionItemSelected: {},
    data: [],
    loading: false,
    modalType: '',
  }

  async componentDidMount() {
    await this.getData()
  }

  getData = async () => {
    try {
      this.setState({ loading: true })
      const response = await CalculateApi.getQaqcConfigs({
        type: 'value',
        limit: Number.MAX_SAFE_INTEGER,
        offset: 0,
      })
      this.setState({
        data: response.results,
        loading: false,
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  showModalCreate = () => {
    this.setState({
      modalType: 'create',
      isShowModalConditionFilter: true,
    })
  }

  showModalEdit = conditionItemSelected => {
    const { data } = this.state
    const dataEdit = data.find(
      condition => condition._id === conditionItemSelected._id
    )

    this.setState(
      {
        modalType: 'edit',
        isShowModalConditionFilter: true,
      },
      () => {
        this.setState({ conditionItemSelected: dataEdit })
      }
    )
  }

  showModalConfirmDelete = () => {
    this.setState({ isShowModalConfirmDelete: true })
  }

  onCancelModalConfirmDelete = () => {
    this.setState({ isShowModalConfirmDelete: false })
  }

  onCancelModalConditionFilter = () => {
    this.setState({
      isShowModalConditionFilter: false,
      conditionItemSelected: null,
    })
  }

  handleChangeStationAuto = stationKey => {
    this.setState({ stationKey })
  }

  setDeleteItem = conditionItemSelected => {
    this.setState({
      isShowModalConfirmDelete: true,
      conditionItemKeySelected: conditionItemSelected._id,
    })
  }

  deleteConditionFilterItem = async () => {
    const { conditionItemKeySelected } = this.state
    try {
      await CalculateApi.deleteQaqcConfig(conditionItemKeySelected)
      this.setState({
        isShowModalConfirmDelete: false,
      })
      message.success('Xóa thành công')
    } catch (error) {
      this.setState({
        isShowModalConfirmDelete: false,
      })
      message.error('Xóa không thành công')
    }
    this.getData()
  }

  onChangeSwitchFilter = async value => {
    const { toggleExcludeParametersByValue } = this.props
    const param = {
      excludeParametersByValue: value,
    }
    try {
      await toggleQaqcConfig(param)
      toggleExcludeParametersByValue(value)
    } catch (error) {
      console.log(error)
    }
  }

  handleSearch = async () => {
    this.setState({ loading: true })

    const { form } = this.props
    const stationKeyList = form.getFieldValue(FIELDS.STATION)
    let params = {
      ...{ type: 'value', offset: 0, limit: Number.MAX_SAFE_INTEGER },
    }

    if (!isEmpty(stationKeyList)) {
      params = {
        stationKeys: stationKeyList.join(','),
        ...params,
      }
    }

    try {
      const response = await CalculateApi.getQaqcConfigs(params)
      this.setState({
        data: response.results,
        loading: false,
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onSubmitted = isShowModalConditionFilter => {
    this.setState({ isShowModalConditionFilter })
    this.getData()
  }

  onDeleted = isShowModalConditionFilter => {
    this.setState({ isShowModalConditionFilter })
    this.getData()
  }

  render() {
    const {
      isShowModalConditionFilter,
      isShowModalConfirmDelete,
      data,
      loading,
      modalType,
      conditionItemSelected,
    } = this.state
    const { form, excludeParametersByValue } = this.props

    const DynamicModalConditionFilter = {
      create: (
        <ModalConditionFilter
          title={i18n().modal.create.title}
          visible={isShowModalConditionFilter}
          conditionItemSelected={conditionItemSelected}
          onCancel={this.onCancelModalConditionFilter}
          showConfirmDelete={this.showModalConfirmDelete}
          dataWithConditionFilter={data}
          showModalConditionFilter={this.onSubmitted}
          type={modalType}
        />
      ),
      edit: (
        <ModalConditionFilter
          title="Chỉnh sửa bộ lọc"
          visible={isShowModalConditionFilter}
          conditionItemSelected={conditionItemSelected}
          onCancel={this.onCancelModalConditionFilter}
          showConfirmDelete={this.showModalConfirmDelete}
          dataWithConditionFilter={data}
          showModalConditionFilter={this.onSubmitted}
          afterDelete={this.onDeleted}
          type={modalType}
        />
      ),
    }

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between" align="middle">
          <Col
            span={18}
            type="flex"
            style={{ display: 'flex', gap: 15, alignItems: 'center' }}
          >
            {form.getFieldDecorator(FIELDS.STATION)(
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
              loading={loading}
              onClick={this.handleSearch}
            />
          </Col>

          <Col span={6}>
            <Row type="flex" justify="end" align="middle">
              <Col>
                <Switch
                  checked={excludeParametersByValue}
                  onClick={this.onChangeSwitchFilter}
                />
              </Col>
              <Col>
                <span
                  style={{
                    marginLeft: 12,
                    color: '#111827',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  {i18n().list.toggle}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Clearfix height={12} />
        <TableConditionFilter
          setEditItemKey={this.showModalEdit}
          dataSource={data}
          loading={loading}
          setDeleteItemKey={this.setDeleteItem}
          isDisabled={!excludeParametersByValue}
          footer={() => (
            <Row type="flex" style={{ color: '#1890FF' }} align="middle">
              <Button
                type="link"
                style={{ fontWeight: 500, fontSize: '16px' }}
                onClick={this.showModalCreate}
              >
                <Icon type="plus" style={{ marginRight: 5 }} />
                {i18n().list.table.footer}
              </Button>
            </Row>
          )}
        />
        {DynamicModalConditionFilter[modalType]}
        <ModalConfirmDelete
          visible={isShowModalConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.deleteConditionFilterItem}
          onCancelDelete={this.onCancelModalConfirmDelete}
        />
      </React.Fragment>
    )
  }
}

export default FilterConditionContainer
