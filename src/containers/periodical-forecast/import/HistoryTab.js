import { Button, Col, DatePicker, Form, Input, Row, Icon, Empty } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import DynamicTable from 'components/elements/dynamic-table'
import { DD_MM_YYYY, HH_MM_DD_MM_YYYY } from 'constants/format-date'
import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTimes, getTimesUTC } from 'utils/datetime'
import { translate as t } from 'hoc/create-lang'

const { RangePicker } = DatePicker

const FIELDS = {
  FILE_NAME: 'fileName',
  RANGE_TIME: 'rangeTime',
}

function i18n() {
  return {
    fileName: t('periodicalForecast.title.fileName'),
    broadcastTime: t('periodicalForecast.title.broadcastTime'),
    createdAt: t('periodicalForecast.title.createdAt'),
    user: t('periodicalForecast.title.user'),
    downloadFile: t('periodicalForecast.title.downloadFile'),
    nodata: t('apiSharingNew.button.nodata'),
  }
}

@connect(state => ({
  locale: state.language.locale,
}))
@Form.create()
export default class HistoryTab extends Component {
  state = {
    data: [],
    loading: false,
  }

  locale = require('antd/es/date-picker/locale/en_US')

  async componentDidMount() {
    if (this.props.locale === 'vi') {
      this.locale = require('antd/es/date-picker/locale/vi_VN')
      require('moment/locale/vi')
    } else {
      require('moment/locale/en-sg')
    }

    const params = {
      type: 'periodic-forecast',
    }
    this.setState({ loading: true })
    const result = await PeriodicForecastApi.getImportHistory(params)
    this.setState({ data: result, loading: false })
  }

  onSearch = async e => {
    e.preventDefault()

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
    { content: i18n().fileName },
    { content: i18n().broadcastTime },
    { content: i18n().createdAt },
    { content: i18n().user },
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
        content: <a href={item.filePath}>{i18n().downloadFile}</a>,
      },
    ])
  }

  render() {
    const { form } = this.props
    const { loading, data } = this.state

    return (
      <React.Fragment>
        <Form
          className="fadeIn animated"
          onSubmit={this.onSearch}
          style={{ width: '100%' }}
        >
          <Row type="flex" gutter={16}>
            <Col>
              {form.getFieldDecorator(FIELDS.FILE_NAME)(
                <Input placeholder={i18n().fileName} style={{ width: 320 }} />
              )}
            </Col>
            <Col>
              {form.getFieldDecorator(FIELDS.RANGE_TIME)(
                <RangePicker
                  locale={this.locale.default}
                  style={{ width: 320 }}
                />
              )}
            </Col>
            <Col>
              <Button shape="circle" htmlType="submit">
                <Icon type="search" />
              </Button>
            </Col>
          </Row>
        </Form>
        {data.length > 0 ? (
          <DynamicTable
            isLoading={loading}
            rows={this.getRows()}
            head={this.head}
            paginationOptions={{
              isSticky: true,
            }}
          />
        ) : (
          <Empty
            style={{ margin: '0 auto', padding: '8px 16px' }}
            description={i18n().nodata}
          />
        )}
      </React.Fragment>
    )
  }
}
