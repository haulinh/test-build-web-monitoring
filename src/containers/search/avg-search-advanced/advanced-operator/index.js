import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Row, Col, Collapse, InputNumber, Button } from 'antd'
import createLang from 'hoc/create-lang'
import createValidateComponent from 'components/elements/redux-form-validate'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'

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

  // state = {
  //   totalCondition: 1,
  // }

  handleCreate = index => () => {
    const currentItem = this.props.value[index]
    if (
      _.isEmpty(_.get(currentItem, 'measuringKey', null)) ||
      _.isEmpty(_.get(currentItem, 'operator', null)) ||
      _.isEmpty(_.get(currentItem, 'value', null))
    )
      return
    if (index < this.state.totalCondition - 1) return
    this.setState(prevState => ({
      totalCondition: prevState.totalCondition + 1,
    }))
  }

  handleReset = () => {
    this.setState({ totalCondition: 1 }, () => {
      this.props.onReset()
    })
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
                      onBlur={this.handleCreate(index)}
                      onFocus={this.handleCreate(index)}
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
                      onBlur={this.handleCreate(index)}
                      onFocus={this.handleCreate(index)}
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
                      onBlur={this.handleCreate(index)}
                      onFocus={this.handleCreate(index)}
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
