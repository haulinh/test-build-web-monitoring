import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Icon,
  Empty,
  Dropdown,
  Menu,
  message,
} from 'antd'
import StationFixesDriverApi from 'api/station-fixed/StationFixesDriver'
import DynamicTable from 'components/elements/dynamic-table'
import { HH_MM_DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import styled from 'styled-components'

import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { getTimes, getTimesUTC } from 'utils/datetime'
import { translate as t } from 'hoc/create-lang'

const FIELDS = {
  FILE_NAME: 'fileName',
  RANGE_TIME: 'rangeTime',
}

const TYPE_HISTORY = 'station-fixed-files'

const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`
const IconButton = styled(Icon)`
  padding-right: 5px;
  color: ${props => (props.color ? props.color : '#3E90F7')};
`

function i18n() {
  return {
    fileName: t('stationFixedDriver.title.fileName'),
    FileSize: t('stationFixedDriver.title.FileSize'),
    createdAt: t('stationFixedDriver.title.createdAt'),
    user: t('stationFixedDriver.title.user'),
    preview: t('stationFixedDriver.title.preview'),
    nodata: t('apiSharingNew.button.nodata'),
    deleteSuccess: t('stationFixedDriver.deleteSuccess'),
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
      type: TYPE_HISTORY,
    }
    this.setState({ loading: true })
    const result = await StationFixesDriverApi.getImportHistory(params)
    this.setState({ data: result, loading: false })
  }

  onSearch = async e => {
    e.preventDefault()

    const { form } = this.props
    const values = form.getFieldsValue()

    let params = {
      fileName: values.fileName,
      type: TYPE_HISTORY,
    }

    this.setState({ loading: true })
    const result = await StationFixesDriverApi.getImportHistory(params)
    this.setState({ data: result, loading: false })
  }

  head = [
    { content: '#', width: 2 },
    { content: i18n().fileName },
    { content: i18n().createdAt },
    { content: i18n().user },
    { content: i18n().FileSize },
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
        content: <div>{moment(item.createdAt).format(HH_MM_DD_MM_YYYY)}</div>,
      },
      {
        content: <div>{`${item.user.lastName} ${item.user.firstName}`}</div>,
      },
      {
        content: (
          <div>{`${getFormatNumber(item.extraInformation.size, 0)} (${
            item.extraInformation.typeSize
          })`}</div>
        ),
      },
      {
        content: (
          <div>
            <Dropdown overlay={this.renderDropdown(item)} trigger={['click']}>
              <LinkSpan className="ant-dropdown-link">
                <Icon
                  type="setting"
                  style={{ fontSize: 20, color: '#3E90F7' }}
                />
              </LinkSpan>
            </Dropdown>
          </div>
        ),
      },
    ])
  }
  renderDropdown(row) {
    return (
      <Menu>
        <Menu.Item key="0">
          <a target="_blank" href={row.filePath}>
            <Icon
              type="eye"
              style={{
                paddingRight: '5px',
              }}
            />
            {i18n().preview}
          </a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={() => this.onDeleteItem(row._id)}>
            <IconButton type="delete" color={'red'} />
            {t('addon.delete')}
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  async onDeleteItem(id) {
    await StationFixesDriverApi.deleteById(id)
    message.success(i18n().deleteSuccess)
    this.componentDidMount()
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
