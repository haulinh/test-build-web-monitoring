import React, { Component } from 'react'
import TableMonthObtained from './TableMonthObtained'

export default class TableMonth extends Component {
  render() {
    const { dataSource, loading, hidden, parentProps } = this.props

    return (
      <TableMonthObtained
        dataSource={dataSource}
        loading={loading}
        hidden={hidden}
        parentProps={parentProps}
      />
    )
  }
}
