import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'
import { COLOR_STATUS } from 'themes/color';
const SummaryItemWrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: 4px;
  padding: 12px 16px;
  background-color: ${props => props.color};
  &:hover {
    cursor: pointer;
  }
  flex-direction: column;
`

const StationTypeImg = styled.img`
  width: null;
  height: 35px;
`

const Text = styled.span`
  color: #ffffff;
  display: block;
`

const TextNumber = Text.extend`
  font-size: 20px;
  flex: 1;
  text-align: right;
  margin-top: 4px;
`

const TextDescription = Text.extend`
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  // margin-top: 6px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

@autobind
export default class SummaryItem extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    totalStationGood: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
    stationTypeKey: PropTypes.string,
    index: PropTypes.number
  }

  renderNumber = () => {
    if (this.props.number) {
      return `${this.props.totalStationGood || 0}/${this.props.number || 0}`
    }

    return this.props.number
  }

  render() {
    const { name, image, color, stationTypeKey, statusStation, index } = this.props
    const colorStatus = (this.props.number == 0)? COLOR_STATUS.DATA_LOSS : COLOR_STATUS[statusStation]
    return (
      // MARK  logic cũ là dùng thẻ Link, giở change thành div
      <div onClick={(e)=>{
        if(window.fullpage_api) window.fullpage_api.moveTo(index +2) // MARK  +2 vì pieChart và stt từ 1
      }} >
        <SummaryItemWrapper color={colorStatus}>
          <Row>
          <StationTypeImg src={image} />
            <TextNumber>{this.renderNumber()}</TextNumber>
          </Row>
          <TextDescription>{name}</TextDescription>
        </SummaryItemWrapper>
      </div>
    )
  }
}
