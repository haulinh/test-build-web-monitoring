import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { removeAccents } from 'hoc/create-lang'

// import { Link } from 'react-router-dom'
// import slug from 'constants/slug'
import { DATA_COLOR } from 'themes/color'
import { get as _get } from 'lodash'
import { connect } from 'react-redux'
const SummaryItemWrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: 4px;
  padding: 12px 16px;
  background-color: ${props => props.color};
  &:hover {
    cursor: ${props => (props.disable ? 'not-allowed' : 'pointer')};
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

const TextNumber = styled(Text)`
  font-size: 20px;
  flex: 1;
  text-align: right;
  margin-top: 4px;
`

const TextDescription = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 1;
  height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin-top: 8px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

@connect(state => ({
  language: _get(state, 'language.locale'),
}))
@autobind
export default class SummaryItem extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    totalStationGood: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
    stationTypeKey: PropTypes.string,
    index: PropTypes.number,
  }

  renderNumber = () => {
    if (this.props.number) {
      return `${this.props.totalStationGood || 0}/${this.props.number || 0}`
    }

    return this.props.number
  }

  render() {
    const {
      name,
      image,
      // color,
      // stationTypeKey,
      statusStation,
      indexScroll,
      number,
      language,
    } = this.props
    const colorStatus =
      this.props.number === 0 ? DATA_COLOR.DATA_LOSS : DATA_COLOR[statusStation]
    return (
      // MARK  logic cũ là dùng thẻ Link, giở change thành div
      <div
        onClick={e => {
          if (number > 0 && window.fullpage_api)
            window.fullpage_api.moveTo(indexScroll) // MARK  +2 vì pieChart và stt từ 1
        }}
      >
        <SummaryItemWrapper disable={number === 0} color={colorStatus}>
          <Row>
            <StationTypeImg src={image} />
            <TextNumber>{this.renderNumber()}</TextNumber>
          </Row>
          <TextDescription>{removeAccents(language, name)}</TextDescription>
        </SummaryItemWrapper>
      </div>
    )
  }
}
