import { Button, Divider } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import DynamicTable from 'components/elements/dynamic-table'
import { DD_MM_YYYY } from 'constants/format-date'
import slug from 'constants/slug'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment-timezone'
import React from 'react'
import { Link } from 'react-router-dom'
import BreadcrumbApiSharing from '../breadcrumb'

const i18n = {
  head: {
    apiName: 'Tên Api',
    dateCreated: 'Ngày tạo',
    dateEdited: 'Ngày chỉnh sửa',
  },
  button: {
    create: 'Tạo Api',
    edit: 'Sửa ',
    delete: 'Xóa',
  },
}
export default class ApiSharingDetailList extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  fetchData = async () => {
    const {
      match: {
        params: { apiKey },
      },
    } = this.props
    this.setState({ loading: true })
    try {
      const res = await shareApiApi.getApiListByKey(apiKey)
      this.setState({ data: res.data })
    } catch (error) {
      console.log(error)
    }
    this.setState({ loading: false })
  }

  async componentDidMount() {
    this.fetchData()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.apiKey !== this.props.match.params.apiKey) {
      this.fetchData()
    }
  }

  handleDeleteItem = async id => {
    this.setState({ loading: true })
    try {
      const res = await shareApiApi.deleteApiDetailById(id)
      if (res.success) {
        const dataUpdated = this.state.data.filter(item => item._id !== id)
        this.setState({ data: dataUpdated })
      }
    } catch (error) {}
    this.setState({ loading: false })
  }

  head = [
    { content: '#', width: 2 },
    { content: i18n.head.apiName },
    { content: i18n.head.dateCreated },
    { content: i18n.head.dateEdited },
  ]

  getRows = () => {
    const { location } = this.props
    return this.state.data.map((item, idx) => [
      {
        content: <strong>{idx + 1}</strong>,
      },
      {
        content: <div>{item.name}</div>,
      },
      {
        content: <div>{moment(item.createdAt).format(DD_MM_YYYY)}</div>,
      },
      {
        content: <div>{moment(item.updatedAt).format(DD_MM_YYYY)}</div>,
      },
      {
        content: (
          <span>
            <Link params={item} to={`${location.pathname}/edit/${item._id}`}>
              {i18n.button.edit}
            </Link>

            <Divider type="vertical" />

            <a onClick={() => this.handleDeleteItem(item._id)}>
              {i18n.button.delete}
            </a>
          </span>
        ),
      },
    ])
  }

  redirectCreateApi = () => {
    const {
      history,
      match: {
        params: { apiKey },
      },
    } = this.props
    history.push(`${slug.apiSharing.base}/${apiKey}/create`)
  }

  render() {
    const { loading } = this.state

    return (
      <PageContainer
        right={
          <Button onClick={this.redirectCreateApi} type="primary">
            {i18n.button.create}
          </Button>
        }
      >
        {/* <BreadcrumbApiSharing items={['list']} /> */}
        <DynamicTable
          isLoading={loading}
          rows={this.getRows()}
          head={this.head}
          paginationOptions={{
            isSticky: true,
          }}
        />
      </PageContainer>
    )
  }
}
