import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import MeasuringItem from '../measuring-item'

const MeasuringListWrapper = styled.div`
  padding: 8px 0 0px 0px;
  display: flex;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
`

const MeasuringItemWrapper = styled.div`
  padding: 0px 8px 8px;
  width: ${props => (props.navigationIsOpen ? '20%' : '16.5%')};
`

@connect(state => ({
  navigationIsOpen: state.theme.navigation.isOpen
}))
@autobind
export default class MeasuringList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    onClickItem: PropTypes.func,
    statusStation: PropTypes.string,
    receivedAt: PropTypes.string.isRequired
  }
  render() {
    return (
      <MeasuringListWrapper>
        {this.props.data &&
          this.props.data.length !== 0 &&
          this.props.data.map(item => {

            /* thêm receivedAt để search dữ liệu gốc trong 24h khi click vào measuring item */
            item.receivedAt = this.props.receivedAt

            return (
              <MeasuringItemWrapper
                onClick={() => this.props.onClickItem(item)}
                navigationIsOpen={this.props.navigationIsOpen}
                key={item.key}
              >
                <MeasuringItem
                  {...item}
                  minLimit={typeof item.minLimit === 'number' ? item.minLimit: null}
                  maxLimit={typeof item.maxLimit === 'number' ? item.maxLimit: null}
                  statusStation={this.props.statusStation}
                />
              </MeasuringItemWrapper>
            )
          })
        }
      </MeasuringListWrapper>
    )
  }
}
