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
import { i18n } from '../index'

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
      name: values.filterName.trim(),
      type: 'value',
      conditions: Object.values(values.conditions),
    }

    try {
      if (type === 'create') {
        await CalculateApi.createQaqcConfig(param)
        this.setState({ loading: false })
        message.success(i18n().message.create.success)
      } else {
        await CalculateApi.updateQaqcConfigById(
          get(conditionItemSelected, '_id'),
          param
        )
        this.setState({ loading: false })
        message.success(i18n().message.update.success)
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
      if (type === 'create') message.error(i18n().message.create.error)
      message.error(i18n().message.update.error)
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
      message.success(i18n().message.delete.success)
    } catch (error) {
      this.setState({
        isShowModalConfirmDelete: false,
      })
      afterDelete(false)
      message.error(i18n().message.delete.error)
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
            {i18n().button.reset}
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.onSubmit}
          >
            {i18n().button.create}
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
                {i18n().button.delete}
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
                {i18n().button.reset}
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.onSubmit}
              >
                {i18n().button.update}
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
            <FormItem label={i18n().form.label.filterName}>
              {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                rules: [
                  {
                    required: true,
                    message: i18n().form.error.filterName,
                  },
                  {
                    max: 64,
                    message: i18n().form.error.maxInput,
                  },
                  {
                    whitespace: true,
                    message: i18n().form.error.whitespace,
                  },
                ],
              })(
                <Input
                  style={{}}
                  placeholder={i18n().form.placeholder.filterName}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={i18n().form.label.stationType}>
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: i18n().form.error.stationType,
                  },
                ],
              })(
                <SelectStationType
                  disabled={type === 'edit' ? true : false}
                  fieldValue="_id"
                  placeholder={i18n().form.placeholder.stationType}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={i18n().form.label.station}>
              {form.getFieldDecorator(FIELDS.STATION, {
                onChange: this.onChangeStation,
                rules: [
                  {
                    required: true,
                    message: i18n().form.error.station,
                  },
                ],
              })(
                <SelectStationAuto
                  disabled={type === 'edit' || !stationType}
                  fieldValue="_id"
                  placeholder={i18n().form.placeholder.station}
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
