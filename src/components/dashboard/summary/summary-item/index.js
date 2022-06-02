import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { get as _get, find as _find } from 'lodash'
import { connect } from 'react-redux'
import { getContent } from 'components/language/language-content'

import { stationStatusOptions, getConfigColor } from 'constants/stationStatus'

const SummaryItemWrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: 4px;
  padding: 12px 16px;
  min-width: 200px;
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
  color: ${props => props.color};
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
  color: ${props => props.color};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

@connect(state => ({
  language: _get(state, 'language.locale'),
  languageContents: _get(state, 'language.languageContents'),
  colorData: _get(state, 'config.color.warningLevel.data.value', []),
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
      statusStation,
      indexScroll,
      number,
      _id,
      languageContents,
    } = this.props

    const stationAutoStatus =
      this.props.number === 0
        ? stationStatusOptions[0]
        : _find(stationStatusOptions, item => item.key === statusStation)

    const { colorData } = this.props
    const configColor = getConfigColor(colorData, stationAutoStatus.key, {
      defaultPrimary: null,
      defaultSecond: '#ffffff',
    })

    return (
      <div
        onClick={e => {
          if (number > 0 && window.fullpage_api)
            window.fullpage_api.moveTo(indexScroll) // MARK  +2 vì pieChart và stt từ 1
        }}
      >
        <SummaryItemWrapper
          disable={number === 0}
          color={configColor.primaryColor}
        >
          <Row>
            <StationTypeImg src={image} />
            <TextNumber color={configColor.secondColor}>
              {this.renderNumber()}
            </TextNumber>
          </Row>
          <TextDescription color={configColor.secondColor}>
            {getContent(languageContents, {
              type: 'StationType',
              itemId: _id,
              field: 'name',
              value: name,
            })}
          </TextDescription>
        </SummaryItemWrapper>
      </div>
    )
  }
}
