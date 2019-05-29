import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ChartRow from '../chart-row'
// import * as _ from 'lodash'

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
    data: PropTypes.arrayOf(PropTypes.shape(ChartRow.propTypes))
  }

  render() {
    if (this.props.data && this.props.data.length === 0) return null
    return (
      // <ChartRowListWrapper>
      //   {this.props.data.map(item => (
      //     <ChartRowWrapper className="section" key={item.key}>
      //       <ChartRow {...item} />
      //     </ChartRowWrapper>
      //   ))}
      // </ChartRowListWrapper>
      this.props.data.map(item => {
        if (item.totalStation === 0) return null
        return (
          <div key={item.key} className="section">
            <ChartRowWrapper style={{ height: '100%' }}>
              <ChartRow {...item} />
            </ChartRowWrapper>
          </div>
        )
      })
    )
  }
}
