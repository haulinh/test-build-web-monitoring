import { Tooltip } from 'antd'
import { getFormatNumber } from 'constants/format-number'
import { STATUS_STATION } from 'constants/stationStatus'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { COLOR_DEVICE_STATUS, DATA_COLOR } from 'themes/color'

const MeasuringListWrapper = styled.div`
  width: 100%;
  padding: 8px 0 0px 0px;
  display: flex;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
`

const MeasuringItemWrapper = styled.div`
  padding: 0px 8px 8px;
  width: ${props => (props.navigationIsOpen ? '20%' : '16.5%')};
  /* min-width: 300px; */
`

const MeasuringItemContainer = styled.div`
  padding: 7px 8px;
  border-radius: 7px;
  border: solid 1px ${props => props.color};
  &:hover {
    cursor: pointer;
  }
  position: relative;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const MeasuringUnit = styled.span`
  position: absolute;
  top: -6px;
  margin-left: 1px;
  color: ${props => props.color};
  font-weight: 499;
  font-size: 9px;
  line-height: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MeasuringValue = styled.div`
  font-size: 19px;
  line-height: 23px;
  text-align: left;
  font-weight: bold;
  color: ${props => props.color};
  position: relative;
`

const LeftContainer = styled.div`
  position: relative;
`
const RightContainer = styled.div`
  position: absolute;
  right: 4px;
`

const Dot = styled.div`
  height: 19px;
  width: 19px;
  background-color: #a3a6b5;
  border-radius: 9px;
  display: inline-block;
  margin-right: 7px;
`

const MeasuringName = styled.span`
  color: ${props => props.color};
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 99%;
  white-space: nowrap;
  margin-right: 11px;
  font-weight: 499;
  font-size: 13px;
  line-height: 16px;
`

const NoDataText = styled.span`
  color: #e-1e0e0;
  font-size: 15px;
  font-style: normal;
  font-weight: normal;
`

@connect(state => ({
  navigationIsOpen: state.theme.navigation.isOpen,
}))
@autobind
export default class MeasuringAdvancedList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    onClickItem: PropTypes.func,
    statusStation: PropTypes.string,
    receivedAt: PropTypes.string.isRequired,
  }
  render() {
    const { lastLogMeasureAdvancedList, statusStation } = this.props
    return (
      <MeasuringListWrapper>
        {lastLogMeasureAdvancedList &&
          lastLogMeasureAdvancedList.map(measure => {
            return (
              <MeasuringItemWrapper
                onClick={() => this.props.onClickItem(measure)}
                navigationIsOpen={this.props.navigationIsOpen}
                key={measure.key}
              >
                <MeasuringItem
                  measure={measure}
                  statusStation={statusStation}
                />
              </MeasuringItemWrapper>
            )
          })}
      </MeasuringListWrapper>
    )
  }
}

@autobind
class MeasuringItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.number,
    unit: PropTypes.string,
    name: PropTypes.string,
    minLimit: PropTypes.number,
    maxLimit: PropTypes.number,
    warningLevel: PropTypes.string,
    statusStation: PropTypes.string,
  }

  getColorLevel() {
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.DATA_LOSS
    )
      return DATA_COLOR[STATUS_STATION.DATA_LOSS]

    const { warningLevel } = this.props
    if (warningLevel && DATA_COLOR[warningLevel])
      return DATA_COLOR[warningLevel]
    return DATA_COLOR.GOOD
  }

  renderDeviceIcon = status => {
    let item = COLOR_DEVICE_STATUS[`${status}`]
    if (item) {
      return (
        <Tooltip placement="top" title={`Sensor ${translate(item.text)}`}>
          <img
            src={item.src}
            style={{
              position: 'absolute',
              left: 2,
              top: 2,
              width: '14px',
              height: '14px',
            }}
            alt={item.text}
          />
        </Tooltip>
      )
    }

    return null
  }

  render() {
    const { measure } = this.props
    const colorStatus = this.getColorLevel()

    let colorDeviceStatus =
      COLOR_DEVICE_STATUS[_.get(this.props, 'statusDevice', '')]
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.HIGHTGEST
    )
      colorDeviceStatus = DATA_COLOR[STATUS_STATION.HIGHTGEST]

    return (
      <MeasuringItemContainer onClick={this.props.onClick} color={colorStatus}>
        <Tooltip title={measure.nameCalculate}>
          <MeasuringName color={colorStatus}>
            {measure.nameCalculate}
          </MeasuringName>
        </Tooltip>
        <Flex onClick={this.props.onClick} color={DATA_COLOR.GOOD}>
          <LeftContainer>
            <MeasuringValue color={colorStatus}>
              {!_.isNil(measure.value) ? (
                <React.Fragment>
                  {getFormatNumber(measure.value)}
                  <MeasuringUnit color={colorStatus} className="unit">
                    {measure.unit ? measure.unit : ''}
                  </MeasuringUnit>
                </React.Fragment>
              ) : (
                <NoDataText>{translate('monitoring.noData')}</NoDataText>
              )}
            </MeasuringValue>
          </LeftContainer>
          <RightContainer>
            <Dot
              style={{
                backgroundColor: colorDeviceStatus,
              }}
            />
          </RightContainer>
        </Flex>
      </MeasuringItemContainer>
    )
  }
}
