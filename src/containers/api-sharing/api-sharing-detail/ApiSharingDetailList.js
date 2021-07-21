import { Button, Divider, message, Modal, Empty, Icon } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import DynamicTable from 'components/elements/dynamic-table'
import { DD_MM_YYYY } from 'constants/format-date'
import slug from 'constants/slug'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment-timezone'
import React from 'react'
import { Link } from 'react-router-dom'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { i18n } from '../constants'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const Breadcrumb = createBreadcrumb()

const i18nTrans = {
  cancelText: translate('addon.cancel'),
  okText: translate('addon.ok'),
  deleteConfirmMsg: translate('confirm.msg.delete'),
}

@protectRole(ROLE.SHARE_API.VIEW)
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
    Modal.confirm({
      title: i18nTrans.deleteConfirmMsg,
      okText: i18nTrans.okText,
      cancelText: i18nTrans.cancelText,
      onOk: async () => {
        this.setState({ loading: true })
        try {
          const res = await shareApiApi.deleteApiDetailById(id)
          if (res.success) {
            const dataUpdated = this.state.data.filter(item => item._id !== id)
            message.success(i18n.message.delete)
            this.setState({ data: dataUpdated })
          }
        } catch (error) {}
        this.setState({ loading: false })
      },
    })
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
        content: (
          <Link to={`${location.pathname}/${item._id}`}>{item.name}</Link>
        ),
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
            {protectRole(ROLE.SHARE_API.EDIT)(
              <Link to={`${location.pathname}/edit/${item._id}`}>
                {i18n.button.edit}
              </Link>
            )}
            <Divider type="vertical" />
            {protectRole(ROLE.SHARE_API.DELETE)(
              <a onClick={() => this.handleDeleteItem(item._id)}>
                {i18n.button.delete}
              </a>
            )}
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

  getPathname = () => {
    const { location } = this.props
    return location.pathname.split('/')[2]
  }

  render() {
    const { loading, data } = this.state
    const pathname = this.getPathname()

    return (
      <PageContainer
        right={
          <Button onClick={this.redirectCreateApi} type="primary">
            <Icon type="plus" />
            {i18n.button.create}
          </Button>
        }
      >
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n.titleMenu[pathname],
            },
          ]}
        />
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
            description={i18n.button.nodata}
          />
        )}
      </PageContainer>
    )
  }
}
