import React from 'react'
import styled from 'styled-components'
import update from 'immutability-helper'
import { Checkbox } from 'antd'
import _ from 'lodash'
import { listFilter } from '../constants'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 16px 0;
  width: 250px;
  max-height: 330px;
  overflow: auto;
  box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25),
    0 0 1px rgba(9, 30, 66, 0.31);
  .ant-checkbox-wrapper {
    width: 100%;
    padding: 8px 12px;
  }
  .filter-item:hover {
    cursor: pointer;
    background-color: #f4f5f7;
  }
`

export default class ListFilterComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      listFilter: listFilter().map(filter => ({
        ...filter,
        checked:
          !!props.listFilter.find(fil => fil.key === filter.key) || false,
      })),
    }
  }

  componentWillReceiveProps(nextProps) {
    const filterList = listFilter().map(filter => ({
      ...filter,
      checked:
        !!nextProps.listFilter.find(fil => fil.key === filter.key) || false,
    }))
    if (!_.isEqual(this.state.listFilter, filterList)) {
      this.setState({ listFilter: filterList })
    }
  }

  handleOnChange = key => e => {
    const { listFilter } = this.state
    const { onChange } = this.props

    const index = listFilter.findIndex(filter => filter.key === key)
    const isChecked = e && e.target && e.target.checked && e.target.checked
    if (index < 0) return
    this.setState(
      prevState =>
        update(prevState, {
          listFilter: {
            [index]: {
              checked: {
                $set: isChecked || !prevState.listFilter[index].checked,
              },
            },
          },
        }),
      () => {
        if (onChange) {
          onChange(listFilter[index])
        }
      }
    )
  }

  render() {
    const { listFilter } = this.state

    return (
      <Wrapper>
        {listFilter.map(filter => (
          <div key={filter.key} className="filter-item">
            <Checkbox
              checked={filter.checked}
              onChange={this.handleOnChange(filter.key)}
            >
              {filter.title}
            </Checkbox>
          </div>
        ))}
      </Wrapper>
    )
  }
}
