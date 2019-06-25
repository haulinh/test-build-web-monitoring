import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import { autobind } from 'core-decorators'
import _ from 'lodash'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import protectRole from 'hoc/protect-role'
import { mapPropsToFields } from 'utils/form'
import SearchForm from './search-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'

import UserRuleTable from './table'

@protectRole(ROLE.STATION_AUTO.VIEW)
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@autobind
export default class UserRole extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    console.log(props.dataSource, "dataSource")
    this.state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSource: [],             /* working dir */
      dataSourceOriginal: [],     /* index */

      isSave: false,

      isWarningIndeterminate: true,
      isSmsIndeterminate: true,
      isEmailIndeterminate: true,
      isWarningCheckAll: false,
      isSmsCheckAll: false,
      isEmailCheckAll: false,
    }
  }
  render(){
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'rule']}/>
        <SearchForm />
        <UserRuleTable />
      </PageContainer>
    )
  }
}