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

export const FIELDS = {
  FILTER_NAME: 'filterName',
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  STATION_ID: 'stationId',
  CONDITIONS: 'conditions',
}

// const i18n = {
//   title: 'Thêm điều kiện bộ lọc mới',
// }
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
          title="Thêm điều kiện bộ lọc mới"
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
                placeholder="Chọn trạm quan trắc"
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
                  Bộ lọc điều kiện giá trị
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
                Thêm điều kiện lọc
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
