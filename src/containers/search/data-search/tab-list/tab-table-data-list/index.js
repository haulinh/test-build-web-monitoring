import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import { get as _get } from 'lodash'
import moment from 'moment/moment'
import { SHAPE } from 'themes/color'
import {
  // warningLevels,
  // colorLevels,
  getcolorMeasure,
  getColorStatusDevice
} from 'constants/warningLevels'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { connect } from 'react-redux'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'

@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
  }

  getColumns() {
    let me = this
    const columnIndex = {
      title: translate('dataSearchFrom.table.numericalOrder'),
      dataIndex: 'Index',
      key: 'Index',
      render(value, record, index) {
        const current = me.props.pagination.current
        const pageSize = me.props.pagination.pageSize
        return <div>{(current - 1) * pageSize + index + 1}</div>
      },
    }

    const columnReceivedAt = {
      title: translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return (
          <div>
            {moment(value)
              .utcOffset(_get(me.props, 'timeZone.offset', ''))
              .format(DD_MM_YYYY_HH_MM)}
          </div>
        )
      },
    }
    const columnsMeasurings = this.props.measuringData
      .filter(measuring => this.props.measuringList.includes(measuring.key))
      .map(measuring => ({
        title: `${measuring.name} (${measuring.unit})`,
        dataIndex: `measuringLogs.${measuring.key}`,
        key: measuring.key,
        align: 'right',
        render: value => {
          if (value === null || value === undefined) return <div />
          /* #region  MARK tạm thời k sử dụng thời điểm đó */

          // let color = SHAPE.BLACK
          // if (
          //   value.warningLevel &&
          //   value.warningLevels !== warningLevels.GOOD
          // ) {
          //   color = colorLevels[value.warningLevel]
          // }

          /* #endregion */

          let color = getcolorMeasure(value.value, measuring, SHAPE.BLACK)
          // if (value.value < 500) {
          //   console.log(value, '===value===')
          //   console.log(color, '==color==')
          // }

          const colorDevice = getColorStatusDevice(value.statusDevice)
          // console.log('---------')
          // console.log(measuring, color, value)
          // Format number toLocalString(national)
          return (

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }} >

              <div style={{ backgroundColor: colorDevice, width: '15px', height: '15px', borderRadius: '50%', marginRight: '10px' }}></div>
              <div style={{ color: color, minWidth: '50px' }} >
                {getFormatNumber(value.value, FORMAT_VALUE_MEASURING)}
              </div>
            </div >
          )
        },
      }))
    return [columnIndex, columnReceivedAt, ...columnsMeasurings]
  }

  render() {
    // console.log(this.props.timeZone,"ABC")
    return (
      <div>
        <Table
          bordered
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
