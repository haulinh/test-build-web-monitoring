import { Button, Form, notification } from 'antd'
import { createManualReport } from 'api/station-fixed/StationFixedReportApi'
import {
  createStationFixedReportLog,
  updateStationFixedReportLog,
} from 'api/station-fixed/StationFixedReportLog'
import _, { get } from 'lodash'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS, i18n } from '../constants'
import FormCollapse from './FormCollapse'
import FormInfoBasic from './FormInfoBasic'
import FormMeasure from './FormMeasure'

const FormContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;

  .form-body {
    flex: 1;
    padding: 0 24px;
    overflow: auto;
  }

  .ant-drawer-body {
    padding: 0 24px;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #e8e8e8;
    padding: 12px;
  }

  .ant-popover-inner-content {
    width: 300px;
  }

  .ant-input-suffix {
    color: #a2a7b3;
  }

  .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding-right: 45px;
  }

  .row-form {
    display: flex;
    gap: 20px;
  }

  .ant-collapse-header {
    font-size: 16px;
    font-weight: 700;
  }
`

@Form.create()
export default class FormMonitoring extends Component {
  state = {
    measuringList: [],
    measuringListSelect: [],
    loading: false,
  }

  onSubmitForm = async () => {
    const {
      form,
      formType,
      setVisibleDrawer,
      points,
      basicInfoData,
    } = this.props

    await form.validateFields()

    const params = this.getParams()
    const reportId = basicInfoData.reportId
    params.stationId = basicInfoData.stationId

    this.setState({
      loading: true,
    })

    try {
      if (formType === 'editReportLog') {
        await updateStationFixedReportLog(reportId, basicInfoData.logData._id, {
          ...params,
          reportId,
        })
      } else if (formType === 'createReportLog') {
        console.log({ ...params, reportId })
        await createStationFixedReportLog({ ...params, reportId })
      } else {
        await createManualReport(params)
      }
      this.setState({
        loading: false,
      })

      notification.success({
        message: i18n().popupCreateSuccess.title,
        description: i18n().popupCreateSuccess.desc,
        placement: 'bottomRight',
      })

      setVisibleDrawer(false)
    } catch (error) {
      console.error({ error })

      this.setState({
        loading: false,
      })
    }
  }

  getParams = () => {
    const { form, type } = this.props

    const value = form.getFieldsValue()

    const { measuringLogs, otherInfo, ...otherValue } = value

    const paramMeasuringLogs = this.getParamMeasuringLogs()

    const params = {
      ...otherValue,
      ...otherInfo,
      name: value.name.trim(),
      measuringLogs: paramMeasuringLogs,
      type,
    }

    return params
  }

  getParamMeasuringLogs = () => {
    const { form } = this.props

    const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

    const measuringLogsArr = Object.values(measuringLogs)

    const paramMeasuringLogs = measuringLogsArr.reduce((base, current) => {
      return {
        ...base,
        [current.key]: { key: current.key, value: current.value },
      }
    }, {})

    return paramMeasuringLogs
  }

  setInitial = () => {
    const { form } = this.props

    form.setFieldsValue({
      [FIELDS.TIME]: moment(),
    })
  }

  componentDidMount = () => {
    this.setInitial()
    const { formType, basicInfoData } = this.props
    if (formType === 'editReportLog') {
      const measuringList = this.getMeasureListPoint(
        get(basicInfoData, 'stationId', '')
      ).filter(measuring =>
        Object.entries(basicInfoData.logData.measuringLogs)
          .map(([key, value]) => ({ key, value }))
          .some(measuringLog => measuringLog.key === measuring.key)
      )

      this.setState({ measuringList })
    } else if (formType === 'createReportLog') {
      const measuringList = this.getMeasureListPoint(
        get(basicInfoData, 'stationId', '')
      )

      this.setState({ measuringList })
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { visibleDrawer } = this.props
    if (visibleDrawer !== prevProps.visibleDrawer) {
      this.setInitial()
      this.setState({
        measuringList: [],
      })
    }
  }

  getMeasureListPoint = pointId => {
    const { points } = this.props

    const pointSelected = points.find(point => point._id === pointId)

    let measuringList = _.get(pointSelected, 'measuringList', [])

    measuringList = measuringList.map(measure => {
      return {
        _id: uuidv4(),
        ...measure,
        disabled: true,
      }
    })

    return measuringList
  }

  onChangePoint = pointId => {
    const measuringList = this.getMeasureListPoint(pointId)

    this.setState({
      measuringList,
      measuringListSelect: measuringList,
    })
  }

  getValueMeasureForm = measureForm => {
    const valueMeasureArr = Object.values(measureForm)

    const measureKeyFormArr = valueMeasureArr.map(measure =>
      get(measure, 'key')
    )

    return measureKeyFormArr
  }

  getNewListSelectMeasureChange = (
    measuringListSelect,
    measureKeyFormArr,
    measureKey
  ) => {
    const newMeasuringListSelected = measuringListSelect.map(measure => {
      if (!measureKeyFormArr.includes(measure.key)) {
        return {
          ...measure,
          disabled: false,
        }
      }

      if (measure.key === measureKey) {
        return {
          ...measure,
          disabled: true,
        }
      }
      return measure
    })

    return newMeasuringListSelected
  }

  onChangeMeasure = measureKey => {
    const { measuringListSelect } = this.state
    const { form } = this.props

    setTimeout(() => {
      const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

      const measureKeyFormArr = this.getValueMeasureForm(measuringLogs)

      const newMeasuringListSelected = this.getNewListSelectMeasureChange(
        measuringListSelect,
        measureKeyFormArr,
        measureKey
      )

      this.setState(
        {
          measuringListSelect: newMeasuringListSelected,
        },
        () => {
          form.setFieldsValue({
            [FIELDS.MEASURING_LOGS]: measuringLogs,
          })
        }
      )
    })
  }

  onClickAddMeasure = () => {
    const { measuringList } = this.state
    const { form } = this.props
    const _id = uuidv4()

    const newMeasure = {
      _id,
    }

    this.setState(
      {
        measuringList: [...measuringList, newMeasure],
      },
      () => {
        const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

        const newValueForm = {
          ...measuringLogs,
          [_id]: { key: undefined, value: '' },
        }
        setTimeout(() => {
          form.setFieldsValue({
            [FIELDS.MEASURING_LOGS]: newValueForm,
          })
        })
      }
    )
  }

  getNewMeasureListSelected = (
    measuringListSelect,
    measureItemDeleted,
    measureItemFormDeleted
  ) => {
    let newMeasuringListSelected = measuringListSelect

    if (measureItemDeleted.key || measureItemFormDeleted.key) {
      newMeasuringListSelected = measuringListSelect.map(measure => {
        if (
          measure.key === measureItemDeleted.key ||
          measure.key === measureItemFormDeleted.key
        ) {
          return {
            ...measure,
            disabled: false,
          }
        }

        return measure
      })
    }

    return newMeasuringListSelected
  }

  onDeleteMeasure = measureDeletedId => {
    const { form } = this.props
    const { measuringList, measuringListSelect } = this.state

    const measureDeleted = measuringList.find(
      measure => measure._id === measureDeletedId
    )
    const newMeasuringList = measuringList.filter(
      measure => measure._id !== measureDeletedId
    )

    const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

    const measureFormDeleted = measuringLogs[measureDeletedId]

    const newMeasuringListSelected = this.getNewMeasureListSelected(
      measuringListSelect,
      measureDeleted,
      measureFormDeleted
    )

    this.setState(
      {
        measuringList: newMeasuringList,
        measuringListSelect: newMeasuringListSelected,
      },
      () => {
        const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])
        setTimeout(() => {
          form.setFieldsValue({
            [FIELDS.MEASURING_LOGS]: measuringLogs,
          })
        })
      }
    )
  }

  resetForm = () => {
    const { form } = this.props

    form.resetFields()

    this.setInitial()

    this.setState({
      measuringList: [],
    })
  }

  render() {
    const { form, points, loading, formType, basicInfoData } = this.props
    const { measuringList, measuringListSelect } = this.state

    const point = form.getFieldValue(FIELDS.POINT)

    const measureListPoint = this.getMeasureListPoint(point)

    const isShowButton = !(measuringList.length === measureListPoint.length)

    return (
      <FormContainer>
        <div className="form-body">
          <FormInfoBasic
            form={form}
            points={points}
            onChangePoint={this.onChangePoint}
            formType={formType}
            basicInfoData={basicInfoData}
          />
          <FormMeasure
            onChangeMeasure={this.onChangeMeasure}
            measuringList={measuringList}
            measuringListSelect={measuringListSelect}
            form={form}
            formType={formType}
            logData={_.get(basicInfoData, 'logData', {})}
            isShowButton={isShowButton}
            onClickAddMeasure={this.onClickAddMeasure}
            handleDelete={this.onDeleteMeasure}
          />
          <FormCollapse
            form={form}
            logData={_.get(basicInfoData, 'logData', {})}
            formType={formType}
          />
        </div>
        <div className="form-footer">
          <Button
            type="link"
            onClick={this.resetForm}
            style={{ background: '#E1EDFB', color: '#1890FF' }}
          >
            {i18n().button.reset}
          </Button>
          <Button loading={loading} type="primary" onClick={this.onSubmitForm}>
            {formType === 'editReportLog' ? 'Cập nhật' : i18n().button.create}
          </Button>
        </div>
      </FormContainer>
    )
  }
}
