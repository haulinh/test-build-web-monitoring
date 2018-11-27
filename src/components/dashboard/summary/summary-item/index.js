import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'
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
`

const TextDescription = Text.extend`
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  margin-top: 6px;
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
    stationTypeKey: PropTypes.string
  }

  renderNumber = () => {
    if (this.props.number) {
      return `${this.props.totalStationGood || 0}/${this.props.number || 0}`
    }

    return this.props.number
  }

  render() {
    const { name, image, color, stationTypeKey } = this.props
    return (
      <Link to={slug.monitoring.base + `?Id=${stationTypeKey}`}>
        <SummaryItemWrapper color={color}>
          <Row>
            <TextNumber>{this.renderNumber()}</TextNumber>
            <StationTypeImg src={image} />
          </Row>
          <TextDescription>{name}</TextDescription>
        </SummaryItemWrapper>
      </Link>
    )
  }
}
