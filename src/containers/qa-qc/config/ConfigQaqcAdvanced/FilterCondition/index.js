import { Button, Col, Form, Icon, message, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { toggleQaqcConfig } from 'api/CategoryApi'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import _ from 'lodash'
import React from 'react'
import ModalConditionFilter from './ModalConditionFilter'
import TableConditionFilter from './TableConditionFilter'

export const FIELDS = {
  FILTER_NAME: 'filterName',
  STATION_TYPE: 'stationType',
  STATION: 'stationKeys',
  STATION_ID: 'stationId',
  CONDITIONS: 'conditions',
}

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
    isApplyConditionFilter: true,
    modalType: '',
  }

  async componentDidMount() {
    await this.getData()
  }

  getData = async () => {
    try {
      this.setState({ loading: true })
      const response = await CalculateApi.getQaqcConfigs({
        limit: Number.MAX_SAFE_INTEGER,
        offset: 0,
      })
      const conditionFilterData = response.results.filter(
        item => item.type === 'value'
      )
      this.setState({
        data: conditionFilterData,
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

    this.setState({
      modalType: 'edit',
      isShowModalConditionFilter: true,
      conditionItemSelected: dataEdit,
    })
  }

  showModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: true,
    })
  }

  onCancelModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: false,
    })
  }

  onCancelModalConditionFilter = () => {
    this.setState({
      isShowModalConditionFilter: false,
    })
  }

  handleChangeStationAuto = stationKey => {
    this.setState({
      stationKey,
    })
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
    const param = {
      excludeParametersByValue: value,
    }
    try {
      await toggleQaqcConfig(param)
      this.setState({
        isApplyConditionFilter: value,
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleSearchConditionFilter = async () => {
    this.setState({
      loading: true,
    })
    const { form } = this.props
    const stationKeyList = form.getFieldValue(FIELDS.STATION)
    let params = {
      ...{
        limit: Number.MAX_SAFE_INTEGER,
        offset: 0,
      },
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
      const conditionFilterData = response.results.filter(
        item => item.type === 'value'
      )
      this.setState({
        data: conditionFilterData,
        loading: false,
      })
    } catch (error) {
      this.setState({
        loading: false,
      })
    }
  }

  onCreated = isShowModalConditionFilter => {
    this.setState({
      isShowModalConditionFilter,
    })
    this.getData()
  }

  render() {
    const {
      isShowModalConditionFilter,
      isShowModalConfirmDelete,
      data,
      isApplyConditionFilter,
      loading,
      modalType,
      conditionItemKeySelected,
      conditionItemSelected,
    } = this.state
    const { form } = this.props

    const DynamicModalConditionFilter = {
      create: (
        <ModalConditionFilter
          title="Thêm điều kiện bộ lọc mới"
          visible={isShowModalConditionFilter}
          onCancel={this.onCancelModalConditionFilter}
          showConfirmDelete={this.showModalConfirmDelete}
          dataWithConditionFilter={data}
          showModalConditionFilter={this.onCreated}
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
          showModalConditionFilter={this.onCreated}
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
                fieldValue="_id"
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
              onClick={this.handleSearchConditionFilter}
            />
          </Col>

          <Col span={6}>
            <Row type="flex" justify="end" align="middle">
              <Col>
                <Switch defaultChecked onClick={this.onChangeSwitchFilter} />
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
          isDisabled={isApplyConditionFilter}
          footer={() => (
            <Button type="link" onClick={this.showModalCreate}>
              <Row type="flex" align="middle">
                <Col style={{ marginRight: '8px', marginTop: '2px' }}>
                  <Icon type="plus" style={{ color: '#1890FF' }} />
                </Col>
                <Col>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1890FF',
                    }}
                  >
                    Thêm điều kiện lọc
                  </span>
                </Col>
              </Row>
            </Button>
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
