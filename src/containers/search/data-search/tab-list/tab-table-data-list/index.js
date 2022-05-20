import { Table, Tooltip } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
// import { SHAPE } from 'themes/color'
import {
  colorLevels,
  // warningLevels,
  // colorLevels,
  // getcolorMeasure,
  getColorStatusDevice,
} from 'constants/warningLevels'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import _, { get, get as _get, isEmpty, keyBy } from 'lodash'
import moment from 'moment/moment'
import React from 'react'
import { connect } from 'react-redux'
import { getParamArray } from 'utils/params'
import { v4 as uuidV4 } from 'uuid'
import { ITEM_PER_PAGE } from '../../index'

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
        if (!value) return <div>-</div>

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
                {getFormatNumber(value.value, 2)}
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

  getBodyWrapper = props => {
    const { measuringList } = this.props
    const standardsSelected = this.getStandardsSelected()

    const renderFooter = () => {
      if (!isEmpty(standardsSelected)) {
        return (
          <React.Fragment>
            {standardsSelected.map(standard => {
              const measureStandard = keyBy(standard.measuringList, 'key')

              const beginTime = standard.begin
                ? moment(standard.begin).format('DD/MM/YYYY')
                : '-'
              const expiredTime = standard.expired
                ? moment(standard.expired).format('DD/MM/YYYY')
                : '-'
              return (
                <tr className="ant-table-row">
                  <td />
                  <td>
                    <Tooltip title={`${beginTime} - ${expiredTime}`}>
                      {standard.name}
                    </Tooltip>
                  </td>

                  {measuringList.map(measureKey => {
                    const measure = measureStandard[measureKey]
                    return (
                      <td style={{ textAlign: 'right' }}>
                        {this.getMeasuringValue(measure)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </React.Fragment>
        )
      }

      return <React.Fragment />
    }
    return (
      <tbody {...props}>
        <React.Fragment>{props.children}</React.Fragment>
        {renderFooter()}
      </tbody>
    )
  }

  handleOnPageChange = page => {
    const { setPage } = this.props
    setPage(page)
  }

  getMeasuringValue = measure => {
    const { minLimit, maxLimit } = measure || {}
    if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
      return [minLimit, maxLimit].join('-')
    if (minLimit || minLimit === 0) return `≥ ${minLimit}`
    if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
    return '-'
  }

  getStandardsSelected = () => {
    const { standardObjectList, standards } = this.props
    const standardObjectListKey = _.keyBy(standardObjectList, 'key')
    if (isEmpty(getParamArray(standards))) return []

    const standardsSelected = standards.map(standard => ({
      ...standardObjectListKey[standard],
      isQCVN: true,
    }))

    return standardsSelected
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
          components={{
            body: { wrapper: props => this.getBodyWrapper(props) },
          }}
          bordered
          size="small"
          rowKey={row => `${row._id}_${row.receivedAt}_${uuidV4()}`}
          columns={this.getColumns()}
          {...otherProps}
          dataSource={dataSource}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
