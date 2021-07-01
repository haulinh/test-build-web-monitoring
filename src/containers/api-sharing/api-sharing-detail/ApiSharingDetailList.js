import { Button, Divider, Spin } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import { withRouter } from 'react-router'
import DynamicTable from 'components/elements/dynamic-table'
import { API_KEY_LIST } from '../constants'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'

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

@withRouter
export class ApiSharingDetailList extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  getData = () => {
    const {
      match: {
        params: { apiKey },
      },
    } = this.props
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(_.get(API_KEY_LIST, apiKey, API_KEY_LIST['station-fixed']))
      }, 2000)
    })
  }

  fetchData = async () => {
    this.setState({ loading: true })
    try {
      const data = await this.getData()
      this.setState({ data })
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
        content: <div>{item.createdAt}</div>,
      },
      {
        content: <div>{item.updatedAt}</div>,
      },
      {
        content: (
          <span>
            <Link to={`${location.pathname}/edit`}>{i18n.button.edit}</Link>

            <Divider type="vertical" />

            <a onClick={() => alert('132')}>{i18n.button.delete}</a>
          </span>
        ),
      },
    ])
  }

  redirectCreateApi = () => {
    const {
      history,
      location,
      match: {
        params: { apiKey },
      },
    } = this.props
    history.push(`${slug.apiSharing.base}/${apiKey}/create`)
  }

  render() {
    const {
      match: {
        params: { apiKey },
      },
    } = this.props

    const { loading } = this.state

    return (
      <PageContainer
        right={
          <Button onClick={this.redirectCreateApi} type="primary">
            {i18n.button.create}
          </Button>
        }
      >
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
