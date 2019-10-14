import React from 'react'
import PropTypes from 'prop-types'
import { Row, Form, Checkbox, Button, message } from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import { updateStationAutoOptions } from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import createLanguageHoc from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import { mapPropsToFields } from 'utils/form'
import StationAutoSearchForm from '../station-auto-search.1'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import { SAMPLING_CONFIG_TABLE_COLUMN } from 'constants/labels'
import swal from 'sweetalert2'

import DynamicTable from 'components/elements/dynamic-table'

const i18n = {}


const showSuccess = (msg) => {
  message.success(`${msg}`);
};

const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`


@protectRole(ROLE.STATION_AUTO.VIEW)
@createManagerList({
  apiList: StationAutoApi.getStationAutos
})
@createManagerDelete({
  apiDelete: StationAutoApi.removeStationAuto
})
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoConfigCamera extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    dataSource:  []
  }

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     /* giông cách hoạt động của git */  
  //     cachedData: {},             /* commit */
  //     dataSource: [],             /* working dir */
  //     dataSourceOriginal: [],     /* index */

  //     isSave: false,

  //     isSamplingIndeterminate: true,
  //     isSamplingCheckAll: false,
  //   }
  // }


  componentWillReceiveProps(nextProps) {
    // if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length ) {
    //   this.setState({
    //     dataSourceOriginal: _.cloneDeep(nextProps.dataSource),
    //     dataSource: _.cloneDeep(nextProps.dataSource)
    //   })
    //   this.checkIndeterminate(SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING, nextProps.dataSource)
    // }
  }

  
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['configCamera']} />
        <Row>
          camera configuration page
        </Row>
      </PageContainer>
    )
  }

}