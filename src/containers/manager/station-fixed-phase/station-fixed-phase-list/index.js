import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Divider, Button, Icon } from 'antd'
import StationFixedPhaseApi from 'api/station-fixed/StationFixedPhaseApi.js'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import Breadcrumb from '../breadcrumb'
import createLanguageHoc, { langPropTypes } from '../../../../hoc/create-lang'
// import styled from 'styled-components'
import DynamicTable from 'components/elements/dynamic-table'
// import protectRole from 'hoc/protect-role'
// import ROLE from 'constants/role'
import * as _ from 'lodash'
// import { getTotalCount_by_type } from 'api/StationAuto'
// import { Modal } from 'antd'
// import { translate } from 'hoc/create-lang'

// const i18n = {
//   errorStationExist: translate('stationTypeManager.form.errorStationExist'),
// }

// @protectRole(ROLE.STATION_TYPE.VIEW)
@createManagerList({
  apiList: StationFixedPhaseApi.getStationFixedPhases,
})
@createManagerDelete({
  apiDelete: StationFixedPhaseApi.deleteStationFixedPhase,
})
@createLanguageHoc
@autobind
export default class StationFixedPhaseList extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    pathImg: PropTypes.string,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes,
  }

  buttonAdd() {
    const {
      lang: { t },
    } = this.props
    return (
      <div>
        {/* {protectRole(ROLE.STATION_TYPE.CREATE)( */}
        <Link to={slug.stationFixedPhase.create}>
          <Button type="primary">
            <Icon type="plus" />
            {t('addon.create')}
          </Button>
        </Link>
        {/* )} */}
      </div>
    )
  }

  // renderSearchForm() {
  //   return (
  //     <StationTypeSearchForm
  //       onChangeSearch={this.props.onChangeSearch}
  //       initialValues={this.props.data}
  //     />
  //   )
  // }

  getHead() {
    const {
      lang: { t },
    } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('stationFixedPhase.form.key.label'), width: 10 },
      { content: t('stationFixedPhase.form.name.label'), width: 30 },
      { content: '', width: 10 },
    ]
  }

  getRows() {
    const {
      lang: { t },
    } = this.props
    return _.get(this.props, 'dataSource', []).map((row, index) => [
      {
        content: <strong>{index + 1}</strong>,
      },
      {
        content: row.key,
      },
      {
        content: row.name,
      },
      {
        content: (
          <span>
            {/* {protectRole(ROLE.STATION_TYPE.EDIT)( */}
            <Link to={slug.stationFixedPhase.editWithKey + '/' + row._id}>
              {t('stationFixedPhase.edit.label')}{' '}
            </Link>
            {/* )} */}

            <Divider type="vertical" />
            {/* {protectRole(ROLE.STATION_TYPE.DELETE)( */}
            <a onClick={() => this.handleOnDelete(row._id)}>
              {t('stationFixedPhase.delete.label')}
            </a>
            {/* )} */}
          </span>
        ),
      },
    ])
  }

  async handleOnDelete(_id) {
    this.props.onDeleteItem(_id, this.props.fetchData)
    // const countStation = await getTotalCount_by_type(_id)
    // if (countStation.success) {
    //   if (countStation.count > 0) {
    //     Modal.error({
    //       title: 'Error',
    //       content: i18n.errorStationExist,
    //     })
    //   } else {
    //     this.props.onDeleteItem(_id, this.props.fetchData)
    //   }
    // }
  }

  render() {
    return (
      <PageContainer right={this.buttonAdd()}>
        <Breadcrumb items={['list']} />
        <DynamicTable
          loading={this.props.isLoading}
          rows={this.getRows()}
          head={this.getHead()}
          paginationOptions={{
            isSticky: true,
          }}
          onSetPage={this.props.onChangePage}
          pagination={this.props.pagination}
        />
      </PageContainer>
    )
  }
}
