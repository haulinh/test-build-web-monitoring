import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Button } from 'antd'

import { translate } from 'hoc/create-lang'
import {QAQC_TABLES} from 'constants/qaqc'

import OriginalTable from './original'
import ValidTable from './valid'
import InvalidTable from './invalid'



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
        <div style={{textAlign: 'right', marginBottom: 16}}>
          <Button
            type="primary"
            icon="file-excel"
            // onClick={this.submit}
            // loading={this.props.isExporting}
          >
            {translate("dataSearchFrom.tab.exportExcel")}
          </Button>
        </div>
        <Table
          dataSource={this.props.dataSource}
          measuringList={measuringList}
          measuringData={measuringData}
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