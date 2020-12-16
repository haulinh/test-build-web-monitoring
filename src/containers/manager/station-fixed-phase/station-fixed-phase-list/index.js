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
import createLanguageHoc, { translate } from '../../../../hoc/create-lang'
// import styled from 'styled-components'
import DynamicTable from 'components/elements/dynamic-table'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
import StationFixedPhaseSearchForm from '../station-fixed-phase-search'

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
  }

  buttonAdd() {
    return (
      <div>
        {/* {protectRole(ROLE.STATION_TYPE.CREATE)( */}
        <Link to={slug.stationFixedPhase.create}>
          <Button type="primary">
            <Icon type="plus" />
            {translate('addon.create')}
          </Button>
        </Link>
        {/* )} */}
      </div>
    )
  }

  getHead() {
    return [
      { content: '#', width: 2 },
      { content: translate('stationFixedPhase.form.key.label') },
      { content: translate('stationFixedPhase.form.name.label') },
      { content: '', width: 10 },
    ]
  }

  getRows() {
    let sourceSorted = _.orderBy(
      this.props.dataSource || [],
      ['stationType._id'],
      ['asc']
    )
    let stationCount = _.countBy(sourceSorted, 'stationType._id')

    let stationTypeArr = []
    const styled = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '200px',
    }

    let result = [].concat.apply(
      [],
      sourceSorted.map((row, index) => {
        //content Row
        let resultRow = [
          {
            content: <strong>{index + 1}</strong>,
          },
          {
            content: (
              <div
                style={{
                  ...styled,
                }}
              >
                {row.key}
              </div>
            ),
          },
          {
            content: (
              <div
                style={{
                  ...styled,
                  width: '600px',
                }}
              >
                {row.name}
              </div>
            ),
          },
          {
            content: (
              <span>
                {/* {protectRole(ROLE.STATION_TYPE.EDIT)( */}
                <Link to={slug.stationFixedPhase.editWithKey + '/' + row._id}>
                  {translate('stationFixedPhase.edit.label')}{' '}
                </Link>
                {/* )} */}

                <Divider type="vertical" />
                {/* {protectRole(ROLE.STATION_TYPE.DELETE)( */}
                <a onClick={() => this.handleOnDelete(row._id)}>
                  {translate('stationFixedPhase.delete.label')}
                </a>
                {/* )} */}
              </span>
            ),
          },
        ]
        //check if Group exist or not
        if (
          (row.stationType &&
            row.stationType._id &&
            stationTypeArr.indexOf(row.stationType._id) > -1) ||
          !row.stationType
        )
          return [resultRow]
        else {
          stationTypeArr.push(row.stationType._id)

          return [
            [
              { content: '' },
              {
                content: (
                  <div>
                    <strong>
                      {row.stationType.name}
                      {stationCount[row.stationType._id]
                        ? '(' + stationCount[row.stationType._id] + ')'
                        : ''}
                    </strong>
                  </div>
                ),
              },
            ],
            resultRow,
          ]
        }
      })
    )
    return result
  }

  handleSearch(values) {
    console.log('Search values:', values)
    const where = {
      // name: values.name ? { like: values.name } : undefined,
      name: values.name,
      stationTypeId: values.stationTypeId,
    }

    if (this.props.onChangeSearch) this.props.onChangeSearch(where)
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
      <PageContainer
        center={
          <HeaderSearchWrapper flex={1}>
            <StationFixedPhaseSearchForm
              stationLength={this.props.pagination.totalItem}
              onChangeSearch={this.handleSearch}
              initialValues={this.props.data}
            />
          </HeaderSearchWrapper>
        }
        right={this.buttonAdd()}
      >
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
