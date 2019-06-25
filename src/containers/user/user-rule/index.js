import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Row } from 'antd'
import _ from 'lodash'
import swal from 'sweetalert2'

import UserApi from 'api/UserApi'
import RoleApi from 'api/RoleApi'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import SearchForm from './search-form'
import Breadcrumb from '../breadcrumb'
import UserRuleTable from './table'

const i18n = {
  error: translate("addon.onSave.update.error"),
}

@autobind
export default class UserRole extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  state = {
    isGettingUsers: true,
    isGettingRoles: true,
    isGettingStationsAuto: false,
    dataSourceUsers: [],
    dataSourceRoles: [],
    dataSourceStationsAuto: [],
  }

  async componentDidMount() {
    await Promise.all([
      this.getUsers(),
      this.getRoles(),
      this.getStationAutos()  
    ])
  }
  
  /* NOTE */
  render(){
    const propsSearchForm = {
      isGettingUsers: this.state.isGettingUsers,
      isGettingRoles: this.state.isGettingRoles,
      dataSourceUsers: this.state.dataSourceUsers,
      dataSourceRoles: this.state.dataSourceRoles
    }

    const propsUserRuleTable = {
      isGettingStationsAuto: this.state.isGettingStationsAuto,
      dataSource: this.state.dataSourceStationsAuto
    }

    return (
      <PageContainer>
        <Breadcrumb items={['list', 'rule']}/>
        <Row style={{marginBottom: 30}}>
          <SearchForm {...propsSearchForm}/>
        </Row>
        <UserRuleTable {...propsUserRuleTable}/>
      </PageContainer>
    )
  }

  componentDidCatch() {
    swal({
      title: i18n.error,
      type: 'error'
    })
  }


  /* NOTE */
  /* TODO  api chua co, phai viet them */
  async getUsers() {
    this.setState({
      isGettingUsers: true,
    })

    let resUsers = await UserApi.searchUser()

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

  /* NOTE */
  async getStationAutos() {
    this.setState({
      isGettingStationsAuto: true
    })

    let resStationsAuto = await StationAutoApi.getStationAutos()

    this.setState({
      isGettingStationsAuto: false,
      dataSourceStationsAuto: _.get(resStationsAuto, 'data', []),
    })
  }
}