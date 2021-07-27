import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ChartRow from '../chart-row'
import * as _ from 'lodash'

// const ChartRowListWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
// `

const ChartRowWrapper = styled.div`
  margin-bottom: 8px;
`

@autobind
export default class ChartRowList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(ChartRow.propTypes)),
  }

  state = {
    dataSource: [],
  }
  getDataSource() {
    const data = []
    _.forEach(this.props.data, item => {
      if (item.totalStation > 0) {
        data.push(item)
      }
    })
    this.setState({
      dataSource: data,
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.getDataSource()
    }
  }

  render() {
    if (this.state.dataSource.length === 0)
      return <div className="section"> </div>
    return this.state.dataSource.map(item => {
      // if (item.totalStation === 0) {
      //   return (
      //     <div key={item.key} className="section">
      //       {' '}
      //     </div>
      //   )
      // }

      return (
        <div key={item.key} className="section">
          <ChartRowWrapper style={{ height: '100%' }}>
            <ChartRow {...item} />
          </ChartRowWrapper>
        </div>
      )
    })
  }
}
