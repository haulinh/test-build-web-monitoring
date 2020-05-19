import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Button } from 'antd'
import { QAQC_TABLES } from 'constants/qaqc'
import { translate } from 'hoc/create-lang'
import OriginalTable from './original'
import ValidTable from './valid'
import InvalidTable from './invalid'

@connect(
  (state, ownProps) => ({
    /* states */
  }),
  {
    /* actions */
  }
)
@autobind
export default class QAQCTables extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    selectedTable: PropTypes.string.isRequired,
    measuringData: PropTypes.array.isRequired,
    measuringList: PropTypes.array.isRequired,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    submitExcel: PropTypes.func,
    isLoading: PropTypes.func
  }

  render() {
    let { measuringList, measuringData } = this.props
    let Table = this._getSelectedTable(this.props.selectedTable)
    return (
      <div>
        {!this.props.isLoading && (
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Button
              type="primary"
              icon="file-excel"
              onClick={this.props.submitExcel}
            >
              {translate('dataSearchFrom.tab.exportExcel')}
            </Button>
          </div>
        )}

        <Table
          dataSource={this.props.dataSource}
          measuringList={measuringList} // danh sach do user lựa chọn
          measuringData={measuringData} // danh sach full cua station
          pagination={this.props.pagination}
          onChangePage={this.props.onChangePage}
        />
      </div>
    )
  }

  _getSelectedTable(table) {
    let TableComp = <div />

    switch (table) {
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
