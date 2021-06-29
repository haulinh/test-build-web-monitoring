import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import { withRouter } from 'react-router'
import DynamicTable from 'components/elements/dynamic-table'

const i18n = {
  head: {
    apiName: 'Tên Api',
    dateCreated: 'Ngày tạo',
    dateEdited: 'Ngày chỉnh sửa',
  },
  button: {
    create: 'Tạo Api',
  },
}

@withRouter
export default class ApiSharingDetailList extends React.Component {
  head = [
    { content: '#', width: 2 },
    { content: i18n.head.apiName },
    { content: i18n.head.dateEdited },
    { content: i18n.head.dateEdited },
    { content: i18n.head.dateCreated, width: 20 },
  ]

  rows = [
    [
      {
        content: <strong>{1}</strong>,
      },
    ],
  ]

  redirectCreateApi = () => {
    const { history, location } = this.props
    history.push(`${location.pathname}/create`)
  }

  render() {
    const {
      match: {
        params: { apiKey },
      },
      location,
      history,
    } = this.props

    console.log({ location })
    console.log({ history })

    return (
      <PageContainer
        right={
          <Button onClick={this.redirectCreateApi} type="primary">
            {i18n.button.create}
          </Button>
        }
      >
        <DynamicTable
          // loading={this.props.isLoading}
          rows={this.rows}
          head={this.head}
          paginationOptions={{
            isSticky: true,
          }}
          // onSetPage={this.props.onChangePage}
          // pagination={this.props.pagination}
        />
      </PageContainer>
    )
  }
}
