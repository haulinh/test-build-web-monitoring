import { Col, Icon, Input, Row } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import styled from 'styled-components'

const PickerContainer = styled.div`
  position: absolute;
  z-index: 9999;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
    0 9px 28px 8px #0000000d;
  width: 280px;

  .arrow {
    &:hover {
      color: silver;
      cursor: pointer;
    }
  }
`

const YearItem = styled.div`
  padding: 16px;
  &:hover {
    color: silver;
    cursor: pointer;
    background: #f5f5f5;
  }
  text-align: center;
`

export default class DatePickerYear extends Component {
  state = {
    currentYear: moment().add(1, 'year'),
    quarterChose: 'Q1',
    open: false,
  }

  ref = React.createRef()

  handleOnClickOutSide = e => {
    if (
      this.state.open &&
      this.ref.current &&
      !this.ref.current.contains(e.target)
    ) {
      this.setState({ open: false })
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOnClickOutSide)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler)
  }

  onClickPreYear = () => {
    this.setState(prevState => ({
      currentYear: prevState.currentYear.subtract(12, 'y'),
    }))
  }

  onClickNextYear = () => {
    this.setState(prevState => ({
      currentYear: prevState.currentYear.add(12, 'y'),
    }))
  }

  handleOnYearItemClick = year => {
    const { onChange = () => {} } = this.props
    this.setState({ open: false })
    onChange(year)
  }

  render() {
    const { open, currentYear } = this.state
    const { value } = this.props

    const twelveYearsAgo = currentYear.clone().subtract(12, 'year')
    const listYear = Array(12)
      .fill(0)
      .map((_, index) => twelveYearsAgo.year() + index)

    return (
      <div ref={this.ref}>
        <Input onClick={() => this.setState({ open: true })} value={value} />
        {open && (
          <PickerContainer>
            <Row type="flex" justify="space-around" style={{ padding: 12 }}>
              <Col>
                <Icon
                  className="arrow"
                  type="double-left"
                  theme="outlined"
                  onClick={this.onClickPreYear}
                />
              </Col>
              <Col>
                {twelveYearsAgo.format('YYYY')}-
                {currentYear
                  .clone()
                  .subtract(1, 'year')
                  .format('YYYY')}
              </Col>
              <Col>
                <Icon
                  className="arrow"
                  type="double-right"
                  theme="outlined"
                  onClick={this.onClickNextYear}
                />
              </Col>
            </Row>
            <Row>
              {listYear.map(year => (
                <Col span={8}>
                  <YearItem onClick={() => this.handleOnYearItemClick(year)}>
                    {year}
                  </YearItem>
                </Col>
              ))}
            </Row>
          </PickerContainer>
        )}
      </div>
    )
  }
}
