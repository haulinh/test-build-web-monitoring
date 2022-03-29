import React, { Component } from 'react'
import { Button, Form } from 'antd'
import styled from 'styled-components'
import FormInfoBasic from './FormInfoBasic'
import { FIELDS } from '../constants'
import moment from 'moment-timezone'
import _, { get } from 'lodash'
import FormMeasure from './FormMeasure'
import { v4 as uuidv4 } from 'uuid'
import FormCollapse from './FormCollapse'
import { createManualReport } from 'api/station-fixed/StationFixedReportApi'

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

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #e8e8e8;
    padding: 24px;
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
    const { form, setVisibleDrawer } = this.props

    await form.validateFields()

    const params = this.getParams()

    this.setState({
      loading: true,
    })

    try {
      await createManualReport(params)
      this.setState({
        loading: false,
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

  onFetchPointSuccess = points => {
    this.setState({ points })
  }

  getValueMeasureForm = measureForm => {
    const valueMeasureArr = Object.values(measureForm)

    const measureKeyFormArr = valueMeasureArr.map(measure =>
      get(measure, 'key')
    )

    return measureKeyFormArr
  }

  onChangeMeasure = measureKey => {
    const { measuringListSelect } = this.state
    const { form } = this.props

    setTimeout(() => {
      const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

      const measureKeyFormArr = this.getValueMeasureForm(measuringLogs)

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

  onDeleteMeasure = _id => {
    const { form } = this.props
    const { measuringList, measuringListSelect } = this.state

    const isDisable = false

    const measureDeleted = measuringList.find(measure => measure._id === _id)
    const newMeasuringList = measuringList.filter(
      measure => measure._id !== _id
    )

    const { measuringLogs } = form.getFieldsValue([FIELDS.MEASURING_LOGS])

    const measureFormDeleted = measuringLogs[_id]

    let newMeasuringListSelected = measuringListSelect

    if (measureDeleted.key || measureFormDeleted.key) {
      newMeasuringListSelected = measuringListSelect.map(measure => {
        if (
          measure.key === measureDeleted.key ||
          measure.key === measureFormDeleted.key
        ) {
          return {
            ...measure,
            disabled: isDisable,
          }
        }

        return measure
      })
    }

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
    const { form, points, loading } = this.props
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
            onFetchPointSuccess={this.onFetchPointSuccess}
          />
          <FormMeasure
            onChangeMeasure={this.onChangeMeasure}
            measuringList={measuringList}
            measuringListSelect={measuringListSelect}
            form={form}
            isShowButton={isShowButton}
            onClickAddMeasure={this.onClickAddMeasure}
            handleDelete={this.onDeleteMeasure}
          />
          <FormCollapse form={form} />
        </div>
        <div className="form-footer">
          <Button type="link" onClick={this.resetForm}>
            Nhập lại
          </Button>
          <Button loading={loading} type="primary" onClick={this.onSubmitForm}>
            Tạo mới
          </Button>
        </div>
      </FormContainer>
    )
  }
}
