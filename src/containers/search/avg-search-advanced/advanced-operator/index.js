import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Collapse, Button } from 'antd'
import createLang from 'hoc/create-lang'
import update from 'immutability-helper'
import ConditionItem from './ConditionItem'

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
    const value = props.value ? props.value.length : 1
    this.state = {
      totalCondition: value,
      conditionList: Array.from(Array(value), (d, i) => i),
    }
  }

  handleCreate = (index, key) => (_, newValue) => {
    console.log('index', index)
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
      conditionList: Array.from(
        Array(prevState.totalCondition + 1),
        (d, i) => i
      ),
    }))
  }

  handleReset = () => {
    this.setState({ totalCondition: 1 }, () => {
      this.props.onReset()
    })
  }

  handleDelete = index => {
    if (this.state.conditionList.length <= 1) return
    this.setState(
      prevState =>
        update(prevState, { conditionList: { $splice: [[index, 1]] } }),
      () => this.props.onRemoveItem(index)
    )
  }

  render() {
    console.log('this.state', this.state)
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    // const conditionList = Array.from(
    //   Array(this.state.totalCondition),
    //   (d, i) => i
    // )
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
            {this.state.conditionList.map((_, index) => (
              <ConditionItem
                index={index}
                measuringList={this.props.measuringList}
                handleCreate={this.handleCreate}
                handleReset={this.handleReset}
                handleDelete={this.handleDelete}
              />
            ))}
          </Collapse.Panel>
        </Collapse>
      </Wrapper>
    )
  }
}
