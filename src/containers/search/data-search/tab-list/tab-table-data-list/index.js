import React from 'react'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table, Tooltip } from 'antd'
import _, { get as _get } from 'lodash'
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
import { ITEM_PER_PAGE } from '../../index'
import { v4 as uuidV4 } from 'uuid'

const COLOR = {
  EXCEEDED_PREPARING: colorLevels.EXCEEDED_TENDENCY,
  EXCEEDED: colorLevels.EXCEEDED,
}

@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  measuresObj: state.global.measuresObj,
}))
@autobind
export default class TableDataList extends React.Component {
  static displayName = 'TableDataList'

  getMeasuringValue = (list, key) => {
    const measure = list.find(item => item.key === key)
    const { minLimit, maxLimit } = measure || {}
    if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
      return [minLimit, maxLimit].join('-')
    if (minLimit || minLimit === 0) return `≥ ${minLimit}`
    if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
    return '-'
  }

  getTooltip = qcvn => {
    const { standardObjectList } = this.props
    const standardObjectListKey = _.keyBy(standardObjectList, 'key')
    if (Array.isArray(qcvn)) {
      const qcvnTooltip = qcvn
        .map(qcvnItem => _.get(standardObjectListKey, [qcvnItem, 'name'], ''))
        .join(',')
      return qcvnTooltip
    }
    return _.get(standardObjectListKey, [qcvn, 'name'], '')
  }

  getColumns = () => {
    const { measuringList, measuresObj, page } = this.props

    const columnsMeasure = measuringList.map(measure => ({
      title: `${measuresObj[measure].name} (${measuresObj[measure].unit})`,
      dataIndex: `measuringLogs.${measure}`,
      align: 'right',
      render: (value, item) => {
        if (item.isQCVN) {
          return (
            <div>{this.getMeasuringValue(item.measuringList, measure)}</div>
          )
        }

        if (value === null || value === undefined) return <div />

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
              title={
                value.isMerged
                  ? translate('qcvn.invalid')
                  : this.getTooltip(value.qcvn)
              }
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

    const columns = [
      {
        title: translate('dataSearchFrom.table.numericalOrder'),
        key: 'Index',
        render: (value, record, index) => {
          if (record.isQCVN) return <React.Fragment />
          return <div>{(page - 1) * ITEM_PER_PAGE + (index + 1)}</div>
        },
      },
      {
        title: translate('dataSearchFrom.table.receivedAt'),
        dataIndex: 'receivedAt',
        key: 'receivedAt',
        render: (value, item) => {
          const {
            timeZone: { offset = '' },
          } = this.props

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
                .utcOffset(offset)
                .format(DD_MM_YYYY_HH_MM)}
            </div>
          )
        },
      },
      ...columnsMeasure,
    ]

    return columns
  }

  getMeasuringValue = (list, key) => {
    const measure = list.find(item => item.key === key)
    const { minLimit, maxLimit } = measure || {}
    if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
      return [minLimit, maxLimit].join('-')
    if (minLimit || minLimit === 0) return `≥ ${minLimit}`
    if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
    return '-'
  }

  handleOnPageChange = page => {
    const { setPage } = this.props
    setPage(page)
  }

  render() {
    const {
      dataSource,
      loading,
      page,
      totalItem,
      standards,
      standardObjectList,
      ...otherProps
    } = this.props

    const standardObjectListKey = _.keyBy(standardObjectList, 'key')
    const standardsObjectSelected = standards.map(standard => ({
      ...standardObjectListKey[standard],
      isQCVN: true,
    }))
    const dataSourceMerged = [...dataSource, ...standardsObjectSelected]

    return (
      <div>
        <Table
          loading={loading}
          pagination={{
            current: page,
            pageSize: ITEM_PER_PAGE + standards.length,
            onChange: this.handleOnPageChange,
            total: totalItem,
          }}
          bordered
          size="small"
          rowKey={row => `${row._id}_${row.receivedAt}_${uuidV4()}`}
          columns={this.getColumns()}
          {...otherProps}
          dataSource={dataSourceMerged}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
