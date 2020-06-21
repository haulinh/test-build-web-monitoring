import React from 'react'
import styled from 'styled-components'
import update from 'immutability-helper'
import { Checkbox } from 'antd'
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

export default class ListFilter extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      listFilter: listFilter.map(filter => ({
        ...filter,
        checked: props.initialValues ? props.initialValues[filter.key] : false,
      })),
    }
  }

  handleOnChange = key => e => {
    const index = this.state.listFilter.findIndex(filter => filter.key === key)
    this.setState(
      prevState =>
        update(prevState, {
          listFilter: {
            [index]: {
              checked: {
                $set: e.target.checked,
              },
            },
          },
        }),
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.listFilter[index])
        }
      }
    )
  }
  render() {
    return (
      <Wrapper>
        {this.state.listFilter.map(filter => (
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
