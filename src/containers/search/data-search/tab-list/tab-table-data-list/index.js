import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table, Tooltip } from 'antd'
import { get as _get } from 'lodash'
import moment from 'moment/moment'
// import { SHAPE } from 'themes/color'
import {
  colorLevels,
  // warningLevels,
  // colorLevels,
  // getcolorMeasure,
  getColorStatusDevice,
} from 'constants/warningLevels'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { connect } from 'react-redux'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'

const COLOR = {
  EXCEEDED_PREPARING: colorLevels.EXCEEDED_TENDENCY,
  EXCEEDED: colorLevels.EXCEEDED,
}

@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    qcvns: PropTypes.array,
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
        if (record.isQCVN) return <React.Fragment />
        return <div>{(current - 1) * pageSize + index + 1}</div>
      },
    }

    const columnReceivedAt = {
      title: translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value, item) {
        if (item.isQCVN) {
          let startTime = item.begin
            ? moment(item.begin).format('DD/MM/YYYY') + ' - '
            : ''
          let endTime = item.expired
            ? moment(item.expired).format('DD/MM/YYYY')
            : translate('qcvn.form.expired.isApplying')
          return (
            <Tooltip title={startTime + endTime}>
              <div style={{ color: 'rgba(0,0,0,.8)' }}>{item.name}</div>
            </Tooltip>
          )
        }
        return (
          <div>
            {moment(value)
              .utcOffset(_get(me.props, 'timeZone.offset', ''))
              .format(DD_MM_YYYY_HH_MM)}
          </div>
        )
      },
    }

    const getMeasuringValue = (list, key) => {
      const measure = list.find(item => item.key === key)
      const { minLimit, maxLimit } = measure || {}
      if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
        return [minLimit, maxLimit].join('-')
      if (minLimit || minLimit === 0) return `≥ ${minLimit}`
      if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
      return '-'
    }

    const columnsMeasurings = this.props.measuringData
      .filter(measuring => this.props.measuringList.includes(measuring.key))
      .map(measuring => ({
        title: `${measuring.name} (${measuring.unit})`,
        dataIndex: `measuringLogs.${measuring.key}`,
        key: measuring.key,
        align: 'right',
        render: (value, item) => {
          if (item.isQCVN) {
            return (
              <div>{getMeasuringValue(item.measuringList, measuring.key)}</div>
            )
          }

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

          const colorDevice = getColorStatusDevice(value.statusDevice)

          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: colorDevice,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              ></div>
              <Tooltip
                title={value.isMerged ? translate('qcvn.invalid') : value.qcvn}
              >
                <div
                  style={{
                    fontWeight: value.isMerged ? 700 : 400,
                    color: COLOR[value.warningLevel],
                    minWidth: '50px',
                  }}
                >
                  {getFormatNumber(value.value, FORMAT_VALUE_MEASURING)}
                </div>
              </Tooltip>
            </div>
          )
        },
      }))
    return [columnIndex, columnReceivedAt, ...columnsMeasurings]
  }

  getDataSources() {
    return [
      ...this.props.dataSource,
      ...this.props.qcvns.map(qc => ({ ...qc, isQCVN: true })),
    ]
  }

  render() {
    // console.log(this.props.timeZone,"ABC")
    const { dataSource, ...otherProps } = this.props
    return (
      <div>
        <Table
          bordered
          size="small"
          rowKey="_id"
          columns={this.getColumns()}
          {...otherProps}
          pagination={{
            ...otherProps.pagination,
            pageSize: this.props.qcvns.length + 50,
          }}
          dataSource={this.getDataSources()}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
