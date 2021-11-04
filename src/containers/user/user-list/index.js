import { Dropdown, Icon, Input, Menu, message, Modal } from 'antd'
import authApi from 'api/AuthApi'
import UserApi from 'api/UserApi'
import AvatarCharacter from 'components/elements/avatar-character'
import ClearFix from 'components/elements/clearfix'
import DynamicTable from 'components/elements/dynamic-table'
import HeadderWrapperSearch from 'components/elements/header-search-wrapper'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerList from 'hoc/manager-list'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get as _get } from 'lodash'
import moment from 'moment/moment'
import PropTypes from 'prop-types'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import format from 'string-format'
import styled from 'styled-components'
import createLanguageHoc, { langPropTypes } from '../../../hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import UserSearchForm from '../user-search-form'

function i18n() {
  return {
    cancelText: translate('addon.cancel'),
    okText: translate('addon.ok'),
    restoreConfirmMsg: translate('confirm.msg.restore'),
    deleteConfirmMsg: translate('confirm.msg.delete'),
  }
}

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
`
const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  .email {
    color: #000;
    font-weight: bold;
  }
  .full-name {
    color: #707070;
  }
`
const SpanTimeAgo = styled.div`
  font-size: 13px;
  color: #707070;
`
const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`
const SpanEnable = styled.span`
  color: #fff;
  background-color: ${props => (props.enable ? '#1890ff' : '#9CABB3')};
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 12px;
`
const IconButton = styled(Icon)`
  padding-right: 5px;
  color: ${props => (props.color ? props.color : '#3E90F7')};
`

const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

@protectRole(ROLE.USER.VIEW)
@createManagerList({
  apiList: UserApi.searchUser,
})
@createManagerDelete({
  apiDelete: UserApi.removeOne,
})
@createLanguageHoc
@connect(state => ({
  userInfo: state.auth.userInfo,
}))
@autobind
export default class UserList extends React.Component {
  static propTypes = {
    pagination: PropTypes.object,
    pathImg: PropTypes.string,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes,
  }

  state = {
    user_id: null,
    password: '',
  }

  async componentWillMount() {}

  async onEnableAccount(_id, enable, callback) {
    if (this.props.userInfo._id === _id) {
      message.warning(translate('userManager.list.warning'))
    } else {
      Modal.confirm({
        title: format(
          translate('userManager.list.confirmEnableAccount'),
          enable
            ? translate('userManager.list.enable')
            : translate('userManager.list.disable')
        ),
        onOk() {
          return new Promise(async (resolve, reject) => {
            const data = await UserApi.accountEnable(_id, { enable })
            if (data.success) {
              callback()
            } else {
              message.error(data.message)
            }
            resolve()
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }
  }

  actionGroup(row) {
    const {
      lang: { t },
    } = this.props
    let accountEnable = true
    if (row.accountStatus && row.accountStatus.enable === false) {
      accountEnable = false
    }

    let dropdown

    if (row.removeStatus && row.removeStatus.allowed)
      dropdown = this.getMenuIsDeleting(row, t, accountEnable)
    else dropdown = this.getMenuNotDeleting(row, t, accountEnable)

    return (
      <Dropdown overlay={dropdown} trigger={['click']}>
        <LinkSpan className="ant-dropdown-link">
          <Icon type="setting" style={{ fontSize: 20, color: '#3E90F7' }} />
        </LinkSpan>
      </Dropdown>
    )
  }

  handleModalOpen = (e, user_id) => {
    this.setState({ user_id, password: '' })
  }

  handleModalClose = e => {
    this.setState({ user_id: null, password: '' })
  }

  async handleModalSubmit() {
    try {
      const { user_id, password } = this.state

      if (password) {
        const rs = await authApi.postSetPassword({ _id: user_id, password })
        if (!rs)
          message.error(
            this.props.lang.t('userManager.list.setPasswordFailure')
          )
      }
      message.success(this.props.lang.t('userManager.list.setPasswordSuccess'))
    } catch (error) {
      message.error(this.props.lang.t('userManager.list.setPasswordFailure'))
    }
    this.handleModalClose()
  }

  handlePasswordText = ({ target }) => {
    this.setState({ password: target.value })
  }

  getMenuNotDeleting(row, t, accountEnable) {
    return (
      <Menu>
        {protectRole(ROLE.USER.EDIT)(
          <Menu.Item key="0">
            <Link to={slug.user.editWithKey + '/' + row._id}>
              <IconButton type="edit" />
              {t('addon.edit')}
            </Link>
          </Menu.Item>
        )}
        {protectRole(ROLE.USER.DELETE)(
          <Menu.Item key="1">
            <a onClick={() => this.onDeleteItem(row._id, this.props.fetchData)}>
              <IconButton type="delete" color={'red'} />
              {t('addon.delete')}
            </a>
          </Menu.Item>
        )}
        {protectRole(ROLE.USER.ENABLE_ACCOUNT)(
          <Menu.Item key="3">
            <a
              onClick={() =>
                this.onEnableAccount(
                  row._id,
                  !accountEnable,
                  this.props.fetchData
                )
              }
            >
              {accountEnable ? (
                <div>
                  {' '}
                  <IconButton type="user-delete" color="red" />
                  {t('userManager.list.disableAccount')}
                </div>
              ) : (
                <div>
                  {' '}
                  <IconButton type="user-add" />
                  {t('userManager.list.enableAccount')}
                </div>
              )}
            </a>
          </Menu.Item>
        )}
        {protectRole('')(
          <Menu.Item key="4">
            <div onClick={e => this.handleModalOpen(e, row._id)}>
              <IconButton type="lock" />
              {t('userManager.list.setPassword')}
            </div>
          </Menu.Item>
        )}
      </Menu>
    )
  }

  getMenuIsDeleting(row, t, accountEnable) {
    return protectRole(ROLE.USER.DELETE)(
      <Menu>
        <Menu.Item key="1">
          <a onClick={() => this.onRestoreItem(row._id, this.props.fetchData)}>
            <IconButton type="reload" />
            {t('addon.restore')}
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a
            onClick={() =>
              this.props.onDeleteItem(row._id, this.props.fetchData)
            }
          >
            <IconButton type="close-square-o" color={'red'} />
            {t('addon.remove')}
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  getHead() {
    const {
      lang: { t },
    } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('userManager.list.email'), width: 30 },
      { content: t('userManager.list.country'), width: 17 },
      { content: t('userManager.list.status'), width: 8 },
      { content: t('userManager.list.createdAt'), width: 15 },
      { content: t('userManager.list.roleName'), width: 10 },
      { content: t('userManager.list.action'), width: 8 },
      { content: t('userManager.list.login') },
    ]
  }

  getRows() {
    return this.props.dataSource.map((row, index) => [
      {
        content: (
          <strong>
            {(this.props.pagination.page - 1) *
              this.props.pagination.itemPerPage +
              index +
              1}
          </strong>
        ),
      },
      {
        content: (
          <div>
            {row.email && (
              <AccountWrapper>
                <AvatarCharacter
                  size={32}
                  username={row.email}
                  avatarUrl={row.avatar}
                />
                <ClearFix width={4} />
                <AccountInfo>
                  <Span
                    className={'email'}
                    deleted={row.removeStatus && row.removeStatus.allowed}
                  >
                    {row.email}
                  </Span>
                  <Span
                    className={'full-name '}
                    deleted={row.removeStatus && row.removeStatus.allowed}
                  >{`${row.firstName} ${row.lastName}`}</Span>
                </AccountInfo>
              </AccountWrapper>
            )}
          </div>
        ),
      },
      {
        content: (
          <div>
            {row.phone && row.phone.iso2 && (
              <div style={{ display: 'flex', justifyItems: 'center' }}>
                <div style={{ paddingRight: '4px' }}>
                  <ReactCountryFlag code={row.phone.iso2} />
                </div>
                <div>
                  <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                    {row.phone ? row.phone.name : ''}
                  </Span>
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        content: (
          <SpanEnable
            enable={
              row.accountStatus && row.accountStatus.enable === false
                ? false
                : true
            }
          >
            {row.accountStatus && row.accountStatus.enable === false
              ? 'Disable'
              : 'Enable'}
          </SpanEnable>
        ),
      },
      {
        content: (
          <Span deleted={row.removeStatus && row.removeStatus.allowed}>
            {' '}
            {moment(row.createdAt).format(DD_MM_YYYY_HH_MM)}
          </Span>
        ),
      },
      {
        content: <Span> {_get(row, 'role.name', '')}</Span>,
      },
      {
        content: <span>{this.actionGroup(row)}</span>,
      },
      {
        content: (
          <SpanTimeAgo>
            <TimeAgo date={row.lastLoginAt} />
          </SpanTimeAgo>
        ),
      },
    ])
  }

  async onDeleteItem(_id, callback) {
    const {
      lang: { t },
      userInfo,
    } = this.props
    if (userInfo._id === _id) {
      message.warning(t('addon.onDelete.warning'))
    } else {
      Modal.confirm({
        title: i18n().deleteConfirmMsg,
        okText: i18n().okText,
        cancelText: i18n().cancelText,
        onOk() {
          return new Promise(async (resolve, reject) => {
            const res = await UserApi.deleteOne(_id)
            if (res.success) {
              message.info(t('addon.onDelete.success'))
              callback()
            } else message.error(t('addon.onDelete.error'))
            resolve()
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {},
      })
    }
  }

  async onRestoreItem(_id, callback) {
    const {
      lang: { t },
    } = this.props
    Modal.confirm({
      title: i18n().restoreConfirmMsg,
      okText: i18n().okText,
      cancelText: i18n().cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await UserApi.restoreOne(_id)
          if (res.success) {
            message.info(t('addon.onRestore.success'))
            callback()
          } else message.error(t('addon.onRestore.error'))
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  render() {
    return (
      <PageContainer
        center={
          <HeadderWrapperSearch flex={1}>
            <UserSearchForm
              totalUser={this.props.pagination.totalItem}
              onChangeSearch={query => {
                this.props.onChangeSearch(query)
              }}
              initialValues={this.props.data}
            />
          </HeadderWrapperSearch>
        }
      >
        <Breadcrumb items={['list']} />
        {this.props.dataSource && (
          <DynamicTable
            isLoading={this.props.isLoading}
            rows={this.getRows()}
            head={this.getHead()}
            paginationOptions={{
              isSticky: true,
            }}
            onSetPage={this.props.onChangePage}
            pagination={this.props.pagination}
          />
        )}

        <Modal
          title={this.props.lang.t('userManager.list.setPassword')}
          visible={!!this.state.user_id}
          onOk={() => this.handleModalSubmit()}
          onCancel={this.handleModalClose}
          cancelText={this.props.lang.t('addon.reset')}
          okText={this.props.lang.t('addon.save')}
        >
          <Input
            value={this.state.password}
            type="password"
            placeholder={this.props.lang.t('userManager.form.password.label')}
            onChange={this.handlePasswordText}
          />
        </Modal>
      </PageContainer>
    )
  }
}
