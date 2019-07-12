import React from 'react'
import { autobind } from 'core-decorators'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import OriginalTable from './original'
import ValidTable from './valid'
import InvalidTable from './invalid'

import {QAQC_TABLES} from 'constants/qaqc'


@connect((state, ownProps) => ({
  /* states */
}), {
  /* actions */
})
@autobind
export default class QAQCTables extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    selectedTable: PropTypes.string.isRequired,
    measuringData: PropTypes.array.isRequired,
    measuringList: PropTypes.array.isRequired
  }

  render() {
    let {measuringList, measuringData} = this.props
    let Table = this._getSelectedTable(this.props.selectedTable)
    return (
      <div>
        <div>export to excel</div>
        <Table
          dataSource={this.props.dataSource}
          measuringList={measuringList} // danh sach do user lựa chọn 
          measuringData={measuringData} // danh sach full cua station
        />
      </div>
    )
  }

  _getSelectedTable(table) {
    let TableComp = <div />
    
    switch(table) {
      case QAQC_TABLES.valid: {
        TableComp = ValidTable
        break
      }
      case QAQC_TABLES.invalid: {
        TableComp = InvalidTable
        break
      }
      default:
        TableComp = OriginalTable
    }

    return TableComp
  }
}
