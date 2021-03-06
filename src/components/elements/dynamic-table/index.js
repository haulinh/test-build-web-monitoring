import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import DynamicTable from '@atlaskit/dynamic-table'
import Pagination from 'components/elements/pagination'

const WrapperHeader = styled.div`
  padding: 8px 0px;
  font-size: 14px;
`

const WrapperTdBody = styled.div`
  padding: 8px 0px;
`

export default class DynamicTableCustom extends PureComponent {
  static propTypes = {
    pagination: PropTypes.shape({
      itemPerPage: PropTypes.number,
      page: PropTypes.number,
    }),
  }

  renderHead() {
    return {
      cells: this.props.head.map(cell => ({
        ...cell,
        content: <WrapperHeader>{cell.content}</WrapperHeader>,
      })),
    }
  }

  renderRows() {
    // console.log('==renderRows===' + this.props.rows)
    const rows = this.props.rows.map(row => ({
      cells: row.map(cell => ({
        ...cell,
        content: <WrapperTdBody>{cell.content}</WrapperTdBody>,
      })),
    }))
    return rows
  }

  render() {
    return (
      <div>
        <DynamicTable
          {...this.props}
          head={this.renderHead()}
          rows={this.renderRows()}
          ref={ref => (this.table = ref)}
        />
        <Pagination
          {...this.props.pagination}
          {...this.props.paginationOptions}
          onChange={this.props.onSetPage}
        />
      </div>
    )
  }
}
