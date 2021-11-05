import { Col, Icon, Input, Row } from 'antd'
import { YYYY } from 'constants/format-date'
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
  min-width: 280px;

  .arrow {
    &:hover {
      color: silver;
      cursor: pointer;
    }
  }
`

const YearItem = styled.div`
  background: ${props => props.active && '#1890ff'};
  padding: 8px 8px;
  &:hover {
    cursor: pointer;
    background: #f5f5f5;
  }
  text-align: center;
`

export default class DatePickerRangeYear extends Component {
  state = {
    currentYear: moment().add(1, 'year'),
    quarterChose: 'Q1',
    open: false,
  }

  ref = React.createRef()
  countClickDate = React.createRef(0)

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

  componentDidUpdate(prevProps, prevState) {
    if (this.countClickDate.current > 1) {
      this.countClickDate.current = 0
      this.setState({ open: false })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler)
    this.countClickDate = 0
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
    this.countClickDate.current++
    const { onChange = () => {}, value } = this.props
    const cloneValue = value || []
    cloneValue[this.countClickDate.current - 1] = year
    onChange(cloneValue)
  }

  isHaveValue = () => {
    const { value } = this.props
    if (value[0] && value[1]) return true
    return false
  }

  generateValueInput = () => {
    const { value } = this.props
    return `${moment(value[0], YYYY).format(YYYY)}-${moment(
      value[1],
      YYYY
    ).format(YYYY)}`
  }

  render() {
    const { open, currentYear } = this.state
    const { value } = this.props

    const twelveYearsAgo = currentYear.clone().subtract(12, 'year')

    const listYear1 = Array(12)
      .fill(0)
      .map((_, index) => twelveYearsAgo.year() + index)

    const listYear2 = Array(12)
      .fill(0)
      .map((_, index) => currentYear.year() + index)

    return (
      <div ref={this.ref}>
        <Input
          onClick={() => this.setState({ open: true })}
          value={this.isHaveValue() ? this.generateValueInput() : ''}
        />
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
                  .add(11, 'year')
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

            <Row gutter={16}>
              <Col span={12}>
                <Row>
                  {listYear1.map(year => (
                    <Col span={8}>
                      <YearItem
                        active={value[0] === year}
                        onClick={() => this.handleOnYearItemClick(year)}
                      >
                        {year}
                      </YearItem>
                    </Col>
                  ))}
                </Row>
              </Col>

              <Col span={12}>
                <Row>
                  {listYear2.map(year => (
                    <Col span={8}>
                      <YearItem
                        active={value[1] === year}
                        onClick={() => this.handleOnYearItemClick(year)}
                      >
                        {year}
                      </YearItem>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </PickerContainer>
        )}
      </div>
    )
  }
}
