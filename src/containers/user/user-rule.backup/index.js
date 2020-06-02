import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Row, Button } from 'antd'
import _ from 'lodash'
import swal from 'sweetalert2'

import { connectAutoDispatch } from 'redux/connect'
import UserApi from 'api/UserApi'
import RoleApi from 'api/RoleApi'
import ROLE from 'constants/role'
import { USER_RULE_TABLE_OPTIONS } from 'constants/labels'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import SearchForm from './search-form'
import Breadcrumb from '../breadcrumb'
import UserRuleTable from './table'

const i18n = {
  error: translate('addon.onSave.update.error'),
  submit: translate('addon.save'),
  success: translate('addon.onSave.update.success'),
}

@protectRole(ROLE.USER.ROLE)
@connectAutoDispatch(
  state => ({
    stationAutos: state.stationAuto.list,
  }),
  {}
)
@autobind
export default class UserRole extends React.Component {
  static propTypes = {
    stationAutos: PropTypes.array.isRequired,
  }

  state = {
    isSave: false,
    isGettingUsers: true,
    isGettingRoles: true,
    dataSourceUsers: [],
    dataSourceRoles: [],
    selectedUserID: '',
    selectedRoleID: '',
  }

  async componentDidMount() {
    this.getUsers()
    this.getRoles()
  }

  /* NOTE */
  render() {
    const propsSearchForm = {
      isGettingUsers: this.state.isGettingUsers,
      isGettingRoles: this.state.isGettingRoles,
      dataSourceUsers: this.state.dataSourceUsers,
      dataSourceRoles: this.state.dataSourceRoles,
      updateDataForSubmit: this.updateDataForSubmit,
    }

    let _stations = _.map(this.props.stationAutos, station => {
      let data = {
        _id: station._id,
        name: station.name,
        address: station.address,
        options: undefined,
      }

      let columns = _.values(USER_RULE_TABLE_OPTIONS)
      _.forEach(columns, column => {
        _.set(data, ['options', column], false)
      })

      return data
    })

    const propsUserRuleTable = {
      stations: _stations,
      updateDataForSubmit: this.updateDataForSubmit,
      isGettingStationsAuto: this.state.isGettingStationsAuto,
      userInfo: _.find(this.state.dataSourceUsers, {
        _id: this.state.selectedUserID,
      }),
      selectedUserID: this.state.selectedUserID,
      selectedRoleID: this.state.selectedRoleID,
    }

    return (
      <PageContainer>
        <Breadcrumb items={['list', 'rule']} />
        <Row style={{ marginBottom: 30 }}>
          <SearchForm {...propsSearchForm} />
        </Row>
        <UserRuleTable {...propsUserRuleTable} />
      </PageContainer>
    )
  }

  componentDidCatch() {
    swal({
      title: i18n.error,
      type: 'error',
    })
  }

  updateDataForSubmit({ name, value }) {
    this.setState({
      [name]: value,
    })
  }

  /* NOTE */
  async getUsers() {
    this.setState({
      isGettingUsers: true,
    })

    let resUsers = await UserApi.searchUser()
    /* MARK   MOCKUP DATA */
    if (resUsers.data.length !== 0) {
      resUsers.data[0].options = {
        '5c3812e83d26bb00100510ab': {
          manager: true,
          warning: false,
          sms: true,
          email: false,
        },
        '5c628395afbc770010cbe04b': {
          manager: true,
          warning: true,
          sms: true,
          email: true,
        },
      }
    }

    this.setState({
      isGettingUsers: false,
      dataSourceUsers: _.get(resUsers, 'data', []),
    })
  }

  /* NOTE */
  async getRoles() {
    this.setState({
      isGettingRoles: true,
    })

    let resRoles = await RoleApi.getRoles()

    this.setState({
      isGettingRoles: false,
      dataSourceRoles: _.get(resRoles, 'data', []),
    })
  }
}
