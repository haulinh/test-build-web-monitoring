import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import moment from 'moment/moment'
import { SHAPE } from 'themes/color'
import { warningLevels, colorLevels } from 'constants/warningLevels'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringData: PropTypes.array
  }

  getColumns() {
    []
  }

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey="_id"
          columns={this.getColumns()}
          {...this.props}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
