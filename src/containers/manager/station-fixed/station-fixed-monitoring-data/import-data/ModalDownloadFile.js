import { Button, Col, Form, Modal as ModalAnt, Radio, Row } from 'antd'
import {
  exportDataTemplateMonitoring,
  exportSimpleDataTemplateMonitoring,
} from 'api/station-fixed/StationFixedPeriodic'
import SelectStationType from 'components/elements/select-station-type'
import Text from 'components/elements/text'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import styled from 'styled-components'
import { downFileExcel } from 'utils/downFile'
import { FIELDS, i18n, REPORT_TYPE } from '../constants'
import DragDropMeasure from './DragDropMeasure'

const Modal = styled(ModalAnt)`
  .ant-modal-body {
    padding: 12px 24px;
  }
`

@Form.create()
export default class ModalDownloadFile extends Component {
  state = {
    measuringList: [],
  }

  onOk = async () => {
    const { form, setVisibleModal } = this.props
    await form.validateFields()

    const reportType = form.getFieldValue(FIELDS.TYPE_REPORT)

    const params = this.getParams()

    try {
      if (reportType === REPORT_TYPE.DETAIL) {
        const result = await exportDataTemplateMonitoring(params)
        downFileExcel(result.data, 'data-template')
      } else if (reportType === REPORT_TYPE.SIMPLE) {
        const result = await exportSimpleDataTemplateMonitoring(params)
        downFileExcel(result.data, 'simple-data-template')
      }

      setVisibleModal(false)
    } catch (error) {
      console.error({ error })
    }
  }

  getParams = () => {
    const { form } = this.props
    const { measuringList } = this.state

    const value = form.getFieldsValue()

    const { selectedList } = value

    const measureListSelected = measuringList.filter(
      measure => selectedList[measure.key]
    )

    const measureKeyListSelected = measureListSelected.map(
      measure => measure.key
    )

    const params = {
      measurings: measureKeyListSelected,
    }

    return params.measurings
  }

  onChangeStationType = stationKey => {
    const { points, form } = this.props

    form.resetFields(['selectedList'])

    const newPoints = points.filter(
      point => point.stationType.key === stationKey
    )

    const measuringList = getMeasuringListFromStationAutos(newPoints)

    this.setState({ measuringList })
  }
  onDragEnd = result => {
    const { measuringList } = this.state
    if (!result.destination) return

    const newMeasuringList = measuringList

    const [reorderedItem] = newMeasuringList.splice(result.source.index, 1)

    newMeasuringList.splice(result.destination.index, 0, reorderedItem)

    this.setState({ measuringList: newMeasuringList })
  }

  isDisableButton = () => {
    const { form } = this.props
    const checkList = form.getFieldValue('selectedList')

    if (!checkList) return

    const checkListValue = Object.values(checkList)

    return checkListValue.every(checkbox => !checkbox)
  }

  render() {
    const { visible, onCancel, form } = this.props
    const { measuringList } = this.state
    const isShowDragDrop = measuringList.length > 0

    const isDisableDownload =
      this.isDisableButton() || measuringList.length === 0

    return (
      <Modal
        title={i18n().downloadExcel.modal.title}
        centered
        width={700}
        closable
        footer={false}
        onCancel={onCancel}
        visible={visible}
      >
        <FormItem label={i18n().downloadExcel.modal.typeReport.title}>
          {form.getFieldDecorator(FIELDS.TYPE_REPORT, {
            initialValue: REPORT_TYPE.DETAIL,
            valuePropsName: 'checked',
          })(
            <Radio.Group>
              <Row type="flex" justify="space-between" gutter={20}>
                <Col span={12}>
                  <Radio value={REPORT_TYPE.DETAIL}>
                    {i18n().downloadExcel.modal.typeReport.detailTitle}
                  </Radio>
                  <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                    {i18n().downloadExcel.modal.typeReport.detailDesc}
                  </div>
                </Col>

                <Col span={12}>
                  <Radio value={REPORT_TYPE.SIMPLE}>
                    {i18n().downloadExcel.modal.typeReport.simpleTitle}
                  </Radio>
                  <div style={{ marginTop: '8px', color: '#A2A7B3' }}>
                    {i18n().downloadExcel.modal.typeReport.simpleDesc}
                  </div>
                </Col>
              </Row>
            </Radio.Group>
          )}
        </FormItem>

        <Row>
          <Col span={12}>
            <FormItem
              label={i18n().downloadExcel.modal.selectStationType.title}
            >
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: i18n().downloadExcel.modal.selectStationType
                      .require,
                  },
                ],
              })(
                <SelectStationType
                  isAuto={false}
                  fieldValue="key"
                  placeholder={
                    i18n().downloadExcel.modal.selectStationType.placeholder
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Text fontWeight={600} color="#111827">
          {i18n().downloadExcel.modal.dragDrop.hint}
        </Text>

        <Clearfix height={16} />

        {isShowDragDrop && (
          <DragDropMeasure
            onDragEnd={this.onDragEnd}
            measuringList={measuringList}
            form={form}
          />
        )}

        <Clearfix height={16} />

        <Row type="flex" gutter={16} justify="end">
          <Col>
            <Button
              onClick={onCancel}
              style={{ color: '#1890FF', background: '#E1EDFB' }}
            >
              {i18n().button.cancel}
            </Button>
          </Col>
          <Col>
            <Button
              onClick={this.onOk}
              type="primary"
              disabled={isDisableDownload}
            >
              {i18n().button.download}
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }
}
