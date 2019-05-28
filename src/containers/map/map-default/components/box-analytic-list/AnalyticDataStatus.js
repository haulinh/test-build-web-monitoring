import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { translate as t } from 'hoc/create-lang'

import {
  // warningLevelsNumber,
  warningLevels,
  // colorLevels
} from 'constants/warningLevels'
import { STATUS_STATION } from 'constants/stationStatus'
import { Row, Clearfix, Item, BoxNumberView } from './style'
import PropTypes from 'prop-types'
import { COLOR_STATUS } from 'themes/color'

const BoxAnalyticListWrapper = styled.div``

@autobind
export default class BoxAnalyticList extends React.PureComponent {
  static propTypes = {
    fillStatusChange: PropTypes.func
  }

  state = {
    loss: -1,
    exceeded: -1,
    exceededPreparing: -1,
    good: -1,
    stationsAutoList: [],
    focusStatus: [
      warningLevels.LOSS,
      warningLevels.GOOD,
      warningLevels.EXCEEDED,
      warningLevels.EXCEEDED_PREPARING
    ]
  }
  async componentWillMount() {
    this.renderMap(this.props.stationsAutoList)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.stationsAutoList.length !== this.state.stationsAutoList.length
    ) {
      // Check if it's a new user, you can also use some unique, like the ID
      this.renderMap(nextProps.stationsAutoList)
    }
  }

  renderMap(stationsAutoList) {
    let res = {
      loss: 0,
      exceeded: 0,
      exceededPreparing: 0,
      good: 0
    }
    stationsAutoList.forEach(element => {
      let isFind = false
      let warLevel = element.statusAnalytic
        ? element.statusAnalytic
        : warningLevels.GOOD

      if (warLevel === STATUS_STATION.DATA_LOSS) {
        res.loss++
        isFind = true
      }
      if (warLevel === STATUS_STATION.EXCEEDED) {
        res.exceeded++
        isFind = true
      }
      if (!isFind && warLevel === STATUS_STATION.EXCEEDED_PREPARING) {
        res.exceededPreparing++
        isFind = true
      }
      if (!isFind) res.good++
    })

    this.setState({
      loss: res.loss,
      exceeded: res.exceeded,
      exceededPreparing: res.exceededPreparing,
      good: res.good
    })
  }

  handelFocusStatus(item) {
    let index = this.state.focusStatus.indexOf(item)
    let focusStatus = []
    if (index !== -1)
      focusStatus = this.state.focusStatus.filter(el => el !== item)
    else focusStatus = [...this.state.focusStatus, item]
    this.setState({ focusStatus })
    this.props.fillStatusChange(focusStatus, 'byDataStatus')
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.fillStatusChange(this.state.focusStatus, 'byDataStatus')
    }, 500)
  }

  render() {
    const pfKey = 'warningLevels.'
    return (
      <BoxAnalyticListWrapper>
        <Row>
          <Item
            onClick={() => {
              this.handelFocusStatus(warningLevels.LOSS)
            }}
          >
            <BoxNumberView
              color={COLOR_STATUS.DATA_LOSS}
              type={t(pfKey + 'lossData')}
              number={this.state.loss}
              focusStatus={warningLevels.LOSS}
              focusParam={this.state.focusStatus}
            />
          </Item>
          <Item
            onClick={() => {
              this.handelFocusStatus(warningLevels.GOOD)
            }}
          >
            <BoxNumberView
              color={COLOR_STATUS.GOOD}
              type={t(pfKey + 'good')}
              number={this.state.good}
              focusStatus={warningLevels.GOOD}
              focusParam={this.state.focusStatus}
            />
          </Item>
        </Row>
        <Clearfix height={8} />
        <Row>
          <Item
            onClick={() => {
              this.handelFocusStatus(warningLevels.EXCEEDED)
            }}
          >
            <BoxNumberView
              color={COLOR_STATUS.EXCEEDED}
              type={t(pfKey + 'exceed')}
              number={this.state.exceeded}
              focusStatus={warningLevels.EXCEEDED}
              focusParam={this.state.focusStatus}
            />
          </Item>
          <Item
            onClick={() => {
              this.handelFocusStatus(warningLevels.EXCEEDED_PREPARING)
            }}
          >
            <BoxNumberView
              color={COLOR_STATUS.EXCEEDED_PREPARING}
              type={t(pfKey + 'exceedPreparing')}
              number={this.state.exceededPreparing}
              focusStatus={warningLevels.EXCEEDED_PREPARING}
              focusParam={this.state.focusStatus}
            />
          </Item>
        </Row>
      </BoxAnalyticListWrapper>
    )
  }
}
