import { Button, Col, Form, Input, Modal, Row, message } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix, FormItem } from 'components/layouts/styles'
import {
  ModalConfirmCancel,
  ModalConfirmDelete,
} from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import { get, keyBy } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FIELDS } from '../index'
import FormTableMeasureCondition from './FormTableMeasureCondition'
import CalculateApi from 'api/CalculateApi'
import { v4 as uuidv4 } from 'uuid'

const StyledRow = styled(Row)`
  .ant-btn {
    border-color: transparent;
  }
`

const mapStateToProp = state => {
  const stationAutoById = keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
  }
}

@Form.create()
@connect(mapStateToProp)
class ModalConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    this.tableRef = React.createRef()

    this.state = {
      loading: false,
      measures: [],
      stationAutos: [],
      isShowModalConditionFilter: true,
      isShowModalConfirmCancel: false,
      isShowModalConfirmDelete: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { form, conditionItemSelected } = this.props

    if (
      get(conditionItemSelected, '_id') !==
      get(prevProps, 'conditionItemSelected._id')
    ) {
      this.tableRef.current.setInitData(
        get(conditionItemSelected, 'conditions', [])
      )

      form.setFieldsValue({
        [FIELDS.FILTER_NAME]: get(conditionItemSelected, 'name'),
        [FIELDS.STATION_TYPE]: get(
          conditionItemSelected,
          'station.stationType._id'
        ),
        [FIELDS.STATION]: get(conditionItemSelected, 'station._id'),
      })
    }
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({ stationAutos })
  }

  onChangeStationType = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION, FIELDS.CONDITIONS])
  }

  onChangeStation = () => {
    const { form } = this.props
    form.resetFields([FIELDS.CONDITIONS, FIELDS.STATION])
  }

  getMeasureList = stationId => {
    const { stationAutos } = this.state
    const stationAuto = stationAutos.find(
      stationAuto => stationId === stationAuto._id
    )
    return get(stationAuto, 'measuringList', [])
  }

  onSubmit = async e => {
    e.preventDefault()
    const {
      form,
      onCancel,
      showModalConditionFilter,
      type,
      conditionItemSelected,
    } = this.props
    const { stationAutos } = this.state
    const values = await form.validateFields()
    this.setState({ loading: true })

    const stationAutoValue = form.getFieldValue(FIELDS.STATION)

    const stationAuto = stationAutos.find(
      stationAuto => stationAutoValue === stationAuto._id
    )

    const param = {
      stationId: stationAuto._id,
      name: values.filterName,
      type: 'value',
      conditions: Object.values(values.conditions),
    }

    try {
      if (type === 'create') {
        await CalculateApi.createQaqcConfig(param)
        this.setState({ loading: false })
        message.success('Tạo thành công')
      } else {
        await CalculateApi.updateQaqcConfigById(
          get(conditionItemSelected, '_id'),
          param
        )
        this.setState({ loading: false })
        message.success('Cập nhật thành công')
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }
    this.tableRef.current.state.conditions = [{ id: uuidv4() }]
    onCancel()
    form.resetFields()
    showModalConditionFilter(false)
  }

  handleResetFields = () => {
    const { form, type } = this.props
    if (type === 'create') form.resetFields()
    else form.resetFields([FIELDS.CONDITIONS, FIELDS.FILTER_NAME])
  }

  showModalConfirmCancel = () => {
    const { form, onCancel, type } = this.props
    if (form.isFieldsTouched() && type === 'create') {
      this.setState({ isShowModalConfirmCancel: true })
      return
    } else if (type === 'edit') {
      this.setState({ isShowModalConfirmCancel: true })
      return
    }
    this.tableRef.current.state.conditions = [{ id: uuidv4() }]
    onCancel()
  }

  handleContinueCreate = () => {
    this.setState({ isShowModalConfirmCancel: false })
  }

  handleCancelCreate = () => {
    const { form, onCancel } = this.props
    this.setState({
      isShowModalConfirmCancel: false,
    })
    this.tableRef.current.state.conditions = [{ id: uuidv4() }]
    onCancel()
    form.resetFields()
  }

  getStationAutosExcludeList = () => {
    const { dataWithConditionFilter } = this.props
    const stationAutosExcludeList = dataWithConditionFilter.map(item => {
      return item.stationId
    })
    return stationAutosExcludeList
  }

  handleDeleteConditionFilter = () => {
    this.setState({ isShowModalConfirmDelete: true })
  }

  onCancelModalConfirmDelete = () => {
    this.setState({ isShowModalConfirmDelete: false })
  }

  deleteConditionFilterItem = async () => {
    const { conditionItemSelected, afterDelete } = this.props

    try {
      await CalculateApi.deleteQaqcConfig(conditionItemSelected._id)
      this.setState({
        isShowModalConfirmDelete: false,
      })
      afterDelete(false)
      message.success('Xóa thành công')
    } catch (error) {
      this.setState({
        isShowModalConfirmDelete: false,
      })
      afterDelete(false)
      message.error('Xóa không thành công')
    }
  }

  render() {
    const {
      form,
      onCancel,
      type,
      conditionItemSelected,
      stationAutoById,
      dataWithConditionFilter,
      ...otherProps
    } = this.props
    const {
      loading,
      isShowModalConfirmCancel,
      isShowModalConfirmDelete,
    } = this.state

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const stationAutoId = form.getFieldValue(FIELDS.STATION)

    const measureList = stationAutoId ? this.getMeasureList(stationAutoId) : []
    const stationAutosExcludeList = this.getStationAutosExcludeList()

    const Footer = {
      create: (
        <StyledRow type="flex" justify="end">
          <Button
            onClick={this.handleResetFields}
            style={{
              backgroundColor: '#E1EDFB',
              color: '#1890FF',
            }}
          >
            Nhập lại
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.onSubmit}
          >
            Tạo mới
          </Button>
          <Clearfix width={9} />
        </StyledRow>
      ),
      edit: (
        <Row type="flex" justify="space-between">
          <Col span={3}>
            <StyledRow type="flex" justify="start">
              <Clearfix width={9} />
              <Button
                style={{
                  backgroundColor: '#FDF3F2',
                  color: '#E64D3D',
                }}
                key="delete"
                onClick={this.handleDeleteConditionFilter}
              >
                Xóa bộ lọc
              </Button>
            </StyledRow>
          </Col>
          <Col span={5}>
            <StyledRow type="flex" justify="end">
              <Button
                onClick={this.handleResetFields}
                style={{
                  backgroundColor: '#E1EDFB',
                  color: '#1890FF',
                }}
              >
                Nhập lại
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.onSubmit}
              >
                Cập nhật
              </Button>
              <Clearfix width={9} />
            </StyledRow>
          </Col>
        </Row>
      ),
    }

    return (
      <Modal
        {...otherProps}
        onCancel={this.showModalConfirmCancel}
        centered
        width={1060}
        footer={[Footer[type]]}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="Tên bộ lọc">
              {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng nhập tên bộ lọc',
                  },
                  {
                    max: 64,
                    message: 'Không được nhập quá 64 ký tự',
                  },
                  {
                    whitespace: true,
                    message: 'Vui lòng nhập dữ liệu',
                  },
                ],
              })(<Input style={{}} placeholder="Tên bộ lọc" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn loại trạm',
                  },
                ],
              })(
                <SelectStationType
                  disabled={type === 'edit' ? true : false}
                  fieldValue="_id"
                  placeholder="Chọn loại trạm"
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION, {
                onChange: this.onChangeStation,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn trạm quan trắc',
                  },
                ],
              })(
                <SelectStationAuto
                  disabled={type === 'edit' || !stationType}
                  fieldValue="_id"
                  placeholder="Chọn trạm quan trắc"
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                  stationAutosExclude={
                    type === 'create' ? stationAutosExcludeList : []
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormTableMeasureCondition
            ref={this.tableRef}
            form={form}
            measureList={measureList}
            type={type}
            conditionItemSelected={conditionItemSelected}
          />
        </Row>
        <ModalConfirmCancel
          type={type}
          visible={isShowModalConfirmCancel}
          closable={false}
          footer={false}
          onCancelOut={this.handleContinueCreate}
          onConfirmCancel={this.handleCancelCreate}
        />
        <ModalConfirmDelete
          visible={isShowModalConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.deleteConditionFilterItem}
          onCancelDelete={this.onCancelModalConfirmDelete}
        />
      </Modal>
    )
  }
}

export default ModalConditionFilter
