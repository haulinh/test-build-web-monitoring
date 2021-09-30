import { Table, Tooltip } from 'antd'
import React from 'react'
import { i18n, incidentType, PAGE_SIZE } from './index'
import { translate as t } from 'hoc/create-lang'
import { get, omit } from 'lodash-es'
import moment from 'moment'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { withRouter } from 'react-router'
import slug from 'constants/slug'

export const TableData = withRouter(
  ({
    result = {},
    setPage = () => {},
    onSearch = () => {},
    page,
    loading,
    ...otherProps
  }) => {
    const columns = [
      {
        title: '#',
        render: (_, __, index) => <div>{(page - 1) * PAGE_SIZE + index}</div>,
      },
      {
        dataIndex: 'name',
        align: 'center',
        title: i18n().name,
        render: value => <div>{value}</div>,
      },
      {
        dataIndex: 'type',
        align: 'center',
        title: i18n().incidentType,
        render: value => <div>{incidentType()[value]}</div>,
      },
      {
        dataIndex: 'stations',
        align: 'center',
        title: t('apiSharingNew.fields.stationKeys'),
        render: value => {
          const stationNames = value.map(item => item.name).join(',')
          return (
            <Tooltip title={stationNames}>
              <div
                style={{
                  maxWidth: 300,
                  fontSize: 14,
                  color: '#262626',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre',
                  overflow: 'hidden',
                }}
              >
                {stationNames}
              </div>
            </Tooltip>
          )
        },
      },
      {
        dataIndex: 'status',
        align: 'center',
        title: i18n().status,
        render: value => (
          <div
            style={{
              ...omit(value, ['_id, name']),
              textAlign: 'center',
              border: `1px solid ${value.color}`,
              borderRadius: '4px',
            }}
          >
            {value.name}
          </div>
        ),
      },
      {
        dataIndex: 'timeStart',
        align: 'center',
        title: t('avgSearchFrom.selectTimeRange.startTime'),
        render: value => <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>,
      },
      {
        dataIndex: 'timeEnd',
        align: 'center',
        title: t('avgSearchFrom.selectTimeRange.endTime'),
        render: value => (
          <div>{value && moment(value).format(DD_MM_YYYY_HH_MM)}</div>
        ),
      },
    ]

    const handleOnChangePagination = (page, pageSize) => {
      setPage(page)
      onSearch()
    }

    return (
      <Table
        columns={columns}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              console.log({ record })
              otherProps.history.push(
                `${slug.ticket.incidentEdit}/${record._id}`
              )
            }, // click row
          }
        }}
        dataSource={get(result, 'data', [])}
        pagination={{
          onChange: handleOnChangePagination,
          total: get(result, 'pagination.total'),
        }}
        loading={loading}
      />
    )
  }
)
