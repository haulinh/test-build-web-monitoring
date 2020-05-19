import React from 'react'
import { autobind } from 'core-decorators'
// import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment-timezone'
// import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

@connect(
  (state, ownProps) => ({
    /* states */
  }),
  {
    /* actions */
  }
)
@autobind
export default class QAQCValidTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array,
    measuringData: PropTypes.array.isRequired,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func
  }

  render() {
    let { dataSource, measuringList, measuringData, pagination } = this.props
    let columns = this._transformedColumns(measuringList, measuringData)
    let data = this._transformedData(dataSource)

    return (
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        pagination={pagination}
        onChange={this.props.onChangePage}
        size="small"
      />
    )
  }

  _transformedColumns(measuringList, measuringData) {
    let defaultColumns = [
      {
        title: 'STT',
        dataIndex: 'stt',
        align: 'center',
        width: 50
      },
      {
        title: 'Received At',
        dataIndex: 'receivedAt',
        align: 'center'
      }
    ]

    let measuringColumns = _.map(measuringList, measuringName => {
      let measuringInfo = _.find(
        measuringData,
        itemInfo => itemInfo.key === measuringName
      )

      return {
        title: `${measuringInfo.key} (${measuringInfo.unit})`,
        dataIndex: measuringInfo.key,
        align: 'center',
        width: measuringInfo.key === 'pH' && 50,
        render(text) {
          return text
        }
      }
    })

    return [...defaultColumns, ...measuringColumns]
  }

  _transformedData(data) {
    return _.map(data, (record, recordIndex) => {
      let result = {
        _id: record._id,
        stt: recordIndex + 1,
        receivedAt: moment(record.receivedAt).format(DD_MM_YYYY_HH_MM)
      }

      _.forEach(this.props.measuringList, name => {
        let isHaveMeasuring = _.get(record, `measuringLogs[${name}]`, undefined)
        if (isHaveMeasuring && record.measuringLogs[name].isValid) {
          result[name] = (
            <div style={{ textAlign: 'center' }}>
              {record.measuringLogs[name].value}
            </div>
          )
        } else {
          result[name] = (
            <div
              style={{
                textDecoration: 'line-through',
                textDecorationColor: 'red',
                textAlign: 'center'
              }}
            >
              {_.get(record, `measuringLogs[${name}].value`, '')}
            </div>
          )
        }
      })

      return result
    })
  }
}
