import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Row, Col, Collapse, InputNumber, Button } from 'antd'
import createLang from 'hoc/create-lang'
import createValidateComponent from 'components/elements/redux-form-validate'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'
import update from 'immutability-helper'

const FSelectAnt = createValidateComponent(SelectAnt)
const FInputNumber = createValidateComponent(InputNumber)

const operators = [
  { value: '>', name: '>' },
  { value: '>=', name: '>=' },
  { value: '<', name: '<' },
  { value: '<=', name: '<=' },
  { value: '=', name: '=' },
]

const Wrapper = styled.div`
  position: relative;
`

const ButtonAbsolute = styled.div`
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 3;
`

@createLang
@autobind
export default class AdvancedOperator extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    onReset: PropTypes.func,
    value: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      totalCondition: props.value ? props.value.length : 1,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && !this.props.value)
      this.setState({
        totalCondition: nextProps.value.length,
        conditionList: Array.from(Array(nextProps.value.length), (d, i) => i),
      })
  }

  handleCreate = (index, key) => (_, newValue) => {
    if (!Array.isArray(this.props.value)) return
    const currentItem = this.props.value[index]
    if (
      !currentItem ||
      !(currentItem.measuringKey || (key === 'measuringKey' && newValue)) ||
      !(currentItem.operator || (key === 'operator' && newValue)) ||
      !(currentItem.value || (key === 'value' && newValue))
    ) {
      return
    }

    if (index < this.state.totalCondition - 1) return
    this.setState(prevState => ({
      totalCondition: prevState.totalCondition + 1,
    }))
  }

  handleReset = () => {
    this.setState(
      { totalCondition: 1, conditionList: Array.from(Array(1), (d, i) => i) },
      () => {
        this.props.onReset()
      }
    )
  }

  handleDelete = index => {
    if (this.state.conditionList.length <= 1) {
      this.handleReset()
      return
    }
    this.setState(
      prevState =>
        update(prevState, {
          conditionList: {
            $splice: [[index, 1]],
          },
          totalCondition: { $set: prevState.totalCondition - 1 },
        }),
      () => this.props.onRemoveItem(index)
    )
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    const conditionList = Array.from(
      Array(this.state.totalCondition),
      (d, i) => i
    )
    return (
      <Wrapper>
        <ButtonAbsolute>
          <Button type="button" onClick={this.handleReset}>
            {t('advanced.reset')}
          </Button>
        </ButtonAbsolute>
        <Collapse>
          <Collapse.Panel
            header={<strong>{t('advanced.label')}</strong>}
            key="1"
          >
            {conditionList.map((_, index) => (
              <div key={index}>
                <Row gutter={10}>
                  <Col span={10}>
                    <Field
                      label={t('measuringList.label')}
                      placeholder={t('measuringList.placeholder')}
                      name={`advanced[${index}].measuringKey`}
                      size="large"
                      showSearch
                      options={this.props.measuringList}
                      component={FSelectAnt}
                      onChange={this.handleCreate(index, 'measuringKey')}
                    />
                  </Col>
                  <Col span={10}>
                    <Field
                      label={t('operator.label')}
                      name={`advanced[${index}].operator`}
                      size="large"
                      showSearch
                      options={operators}
                      component={FSelectAnt}
                      onChange={this.handleCreate(index, 'operator')}
                    />
                  </Col>
                  <Col span={4}>
                    <Field
                      label={t('value.label')}
                      name={`advanced[${index}].value`}
                      size="large"
                      style={{
                        width: '100%',
                      }}
                      component={FInputNumber}
                      onChange={this.handleCreate(index, 'value')}
                    />
                  </Col>
                </Row>
                <Clearfix height={16} />
              </div>
            ))}
          </Collapse.Panel>
        </Collapse>
      </Wrapper>
    )
  }
}
