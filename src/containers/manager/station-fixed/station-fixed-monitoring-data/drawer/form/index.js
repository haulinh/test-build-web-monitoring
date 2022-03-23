import React, { Component } from 'react'
import { Button, Form } from 'antd'
import styled from 'styled-components'
import FormInfoBasic from './FormInfoBasic'
import { FIELDS } from '../../constants'
import moment from 'moment-timezone'
import _ from 'lodash'
import FormMeasure from './FormMeasure'
import SelectMeasure from '../select/SelectMeasure'
import { v4 as uuidv4 } from 'uuid'

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
`

@Form.create()
export default class FormMonitoring extends Component {
  state = {
    points: [],
    measuringList: [],
    measuringNotSelect: [],
  }

  selectPointRef = React.createRef()

  onSubmitForm = async () => {
    const { form } = this.props

    const value = await form.validateFields()

    console.log('values ---->', { value })
  }

  setInitial = () => {
    const { form } = this.props

    form.setFieldsValue({
      [FIELDS.TIME]: moment(),
    })
  }

  setInitialValueMeasure = () => {
    const { form } = this.props
    const { measuringList } = this.state
    const initMeasure = measuringList.reduce((base, current) => {
      return {
        ...base,
        [current._id]: { key: current.key, value: current.value },
      }
    }, {})

    // console.log({ initMeasure })

    form.setFieldsValue({
      measure: initMeasure,
    })
  }

  componentDidMount = () => {
    this.setInitial()
  }

  getMeasureListPoint = pointKey => {
    const { points } = this.state

    const pointSelected = points.find(point => point.key === pointKey)

    const measuringList = _.get(pointSelected, 'measuringList', [])

    return measuringList
  }

  onChangePoint = value => {
    let measuringList = this.getMeasureListPoint(value)
    measuringList = measuringList.map(measure => {
      return {
        _id: uuidv4(),
        ...measure,
      }
    })

    // console.log(this.selectPointRef)

    // console.log({ measuringList })

    // console.log({ initialValue })

    this.getOptionSelectMeasure()

    this.setState(
      {
        measuringList,
        // measureNotSelected: [],
      },
      () => this.setInitialValueMeasure()
    )
  }

  getOptionSelectMeasure = () => {
    const { form } = this.props
    const point = form.getFieldValue(FIELDS.POINT)

    const measuringList = this.getMeasureListPoint(point)
    const valueMeasure = form.getFieldsValue(['measure'])

    if (!valueMeasure.measure) return

    const valueMeasureArr = Object.values(valueMeasure.measure)

    let measureSelectedArr = valueMeasureArr.filter(measure => measure.key)

    measureSelectedArr = measureSelectedArr.map(measure => measure.key)

    const measureNotSelected = measuringList.filter(
      measure => !measureSelectedArr.includes(measure.key)
    )

    return measureNotSelected
  }

  onFetchPointSuccess = points => {
    this.setState({ points })
  }

  onChangeMeasure = () => {
    const measureNotSelected = this.getOptionSelectMeasure()

    this.setState({
      measureNotSelected,
    })
  }

  onClickAddMeasure = () => {
    const { measuringList } = this.state
    const { form } = this.props

    // const valueMeasure = form.getFieldsValue(['measure'])

    // const valueMeasureArr = Object.values(valueMeasure.measure)

    // const measureSelected = valueMeasureArr.map(measure => measure.name)

    // console.log(measureSelected)
    const measuringNotSelect = this.getOptionSelectMeasure()

    const newMeasure = {
      _id: uuidv4(),
    }

    this.setState({
      measuringList: [...measuringList, newMeasure],
      measuringNotSelect,
    })
  }

  onDeleteMeasure = _id => {
    const { measuringList, measureNotSelected } = this.state
    const measureDeleted = measuringList.find(measure => measure._id === _id)

    const newMeasuringList = measuringList.filter(
      measure => measure._id !== _id
    )

    this.setState({
      measuringList: newMeasuringList,
      measureNotSelected: [measureDeleted],
    })
  }

  render() {
    const { form, phases } = this.props
    const { measuringList, measuringNotSelect } = this.state

    return (
      <FormContainer>
        <div className="form-body">
          <FormInfoBasic
            form={form}
            // ref={this.selectPointRef}
            phases={phases}
            onChangePoint={this.onChangePoint}
            onFetchPointSuccess={this.onFetchPointSuccess}
          />
          <FormMeasure
            onChangeMeasure={this.onChangeMeasure}
            measuringList={measuringList}
            measuringNotSelect={measuringNotSelect}
            form={form}
            onClickAddMeasure={this.onClickAddMeasure}
            handleDelete={this.onDeleteMeasure}
          />
        </div>
        <div className="form-footer">
          <Button type="link">Nhập lại</Button>
          <Button type="primary" onClick={this.onSubmitForm}>
            Tạo mới
          </Button>
        </div>
      </FormContainer>
    )
  }
}
