import { Col, DatePicker, Input, Row, Form } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'

import DynamicTable from 'components/elements/dynamic-table'
import React, { Component } from 'react'
import { getTimes, getTimesUTC } from 'utils/datetime'
import moment from 'moment'
import { DD_MM_YYYY, HH_MM_DD_MM_YYYY } from 'constants/format-date'

const { RangePicker } = DatePicker

const { Search } = Input

const FIELDS = {
  FILE_NAME: 'fileName',
  RANGE_TIME: 'rangeTime',
}

const i18n = {
  fileName: 'Tên file',
  broadcastTime: 'Ngày phát bản tin',
  createdAt: 'Thời gian tải lên',
  user: 'Người tải lên',
}

@Form.create()
export default class HistoryTab extends Component {
  state = {
    data: [],
    loading: false,
  }

  async componentDidMount() {
    const params = {
      type: 'periodic-forecast',
    }
    this.setState({ loading: true })
    const result = await PeriodicForecastApi.getImportHistory(params)
    this.setState({ data: result, loading: false })
  }

  onSearch = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()

    let params = {
      fileName: values.fileName,
      type: 'periodic-forecast',
    }

    if (Array.isArray(values.rangeTime) && values.rangeTime.length > 0) {
      const times = getTimes(values.rangeTime)
      const { from, to } = getTimesUTC(times)
      params = {
        fileName: values.fileName,
        type: 'periodic-forecast',
        from,
        to,
      }
    }

    this.setState({ loading: true })
    const result = await PeriodicForecastApi.getImportHistory(params)
    this.setState({ data: result, loading: false })
  }

  head = [
    { content: '#', width: 2 },
    { content: i18n.fileName },
    { content: i18n.broadcastTime },
    { content: i18n.createdAt },
    { content: i18n.user },
    { content: '' },
  ]

  getRows = () => {
    return this.state.data.map((item, idx) => [
      {
        content: <strong>{idx + 1}</strong>,
      },
      {
        content: <div>{item.fileName}</div>,
      },
      {
        content: (
          <div>
            {moment(item.extraInformation.broadcastTime).format(DD_MM_YYYY)}
          </div>
        ),
      },
      {
        content: <div>{moment(item.createdAt).format(HH_MM_DD_MM_YYYY)}</div>,
      },
      {
        content: <div>{`${item.user.lastName} ${item.user.firstName}`}</div>,
      },
      {
        content: <a href={item.filePath}>Tải về</a>,
      },
    ])
  }

  render() {
    const { form } = this.props
    const { loading } = this.state

    return (
      <React.Fragment>
        <Row type="flex" gutter={16}>
          <Col>
            {form.getFieldDecorator(FIELDS.FILE_NAME)(
              <Search
                placeholder="Tên file"
                onSearch={this.onSearch}
                style={{ width: 320 }}
              />
            )}
          </Col>
          <Col>
            {form.getFieldDecorator(FIELDS.RANGE_TIME)(
              <RangePicker
                onChange={value => console.log({ value })}
                style={{ width: 320 }}
              />
            )}
          </Col>
        </Row>
        <DynamicTable
          isLoading={loading}
          rows={this.getRows()}
          head={this.head}
          //   paginationOptions={{
          //     isSticky: true,
          //   }}
        />
      </React.Fragment>
    )
  }
}
