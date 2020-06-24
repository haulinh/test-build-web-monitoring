import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { autobind } from 'core-decorators'
import { Tooltip } from 'antd'
import { getConfigAqiCalculation } from 'api/CategoryApi.js'
import { get as _get } from 'lodash'

const LevelWrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 16px;
  border-radius: 3px;
  z-index: 2;
`

const LevelView = styled.div`
  display: flex;
`

const LevelItem = styled.div`
  // padding: 2px 8px;
  width: 115px;
  height: 25px;
  color: ${props => props.colorFont || '#fff'};
  background: ${props => props.color || 'green'};
  text-align: center;
`

const LevelLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #000000;
  text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px #ffffff, -1px -1px #fff;
`
const PREFIX_CALCULATION = 'aqi-calculation-'

@autobind
export default class AqiLevelInfo extends React.PureComponent {
  static propTypes = {
    locale: PropTypes.string,
  }

  state = {
    isLoading: false,
    dataLevelAQI: [],
  }

  componentDidMount() {
    this.refeshData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locale !== this.props.locale) {
      this.refeshData()
    }
  }

  async refeshData() {
    try {
      this.setState({
        isLoading: true,
      })

      const res = await getConfigAqiCalculation(
        `${PREFIX_CALCULATION}${this.props.locale}`
      )
      // console.log(res, "componentDidMount")
      if (res.success) {
        this.setState({
          dataLevelAQI: _get(res, 'data.value', []),
        })
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    // console.log(this.props.locale, '---this.prosp.locale--')
    return (
      <LevelWrapper>
        {!this.state.isLoading && (
          <LevelView>
            {this.state.dataLevelAQI.map(
              (
                { color, backgroundColor, name, description, min, max },
                index
              ) => {
                return (
                  <Tooltip key={index} placement="top" title={description}>
                    <LevelLabel>
                      <div>
                        {/* <span>{min}</span> */}
                        <span>{index === 0 ? min : ''}</span>
                      </div>

                      <div>
                        <span>{max}</span>
                      </div>
                    </LevelLabel>
                    <LevelItem
                      color={backgroundColor}
                      key={name}
                      colorFont={color}
                    >
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 'bold' }}>
                          {name}
                        </span>
                      </div>
                    </LevelItem>
                  </Tooltip>
                )
              }
            )}
          </LevelView>
        )}
      </LevelWrapper>
    )
  }
}
