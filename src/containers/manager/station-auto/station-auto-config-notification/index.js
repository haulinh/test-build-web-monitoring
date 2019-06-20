import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Checkbox, Button } from 'antd'
import StationAutoApi from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import StationAutoSearchForm from '../station-auto-search.1'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import styled from 'styled-components'
import _ from 'lodash'

import DynamicTable from 'components/elements/dynamic-table'

const i18n = {
  cancel: 'Hủy', /* MARK  @translate */
  save: 'Lưu' /* MARK  @translate */
}

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
export default class StationAutoConfigNotification extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onRemoveItem: PropTypes.func,
    fetchData: PropTypes.func,
    onChangeSearch: PropTypes.func,
    data: PropTypes.object,
    lang: langPropTypes
  }

  getHead() {
    const { t } = this.props.lang
    return [
      { content: '#', width: 2 },
      { content: t('stationAutoManager.form.name.label'), width: 15 },
      { content: t('stationAutoManager.form.address.label'), width: 20 },
      { content: <div style={{textAlign: 'center'}}>Gởi cảnh báo</div>, width: 15 },
      { content: <div style={{textAlign: 'center'}}>SMS</div>, width: 15 },
      { content: <div style={{textAlign: 'center'}}>Email</div>, width: 15 },
    ]
  }

  getRows() {
    let stationTypeArr = []

    let sourceSorted = _.orderBy(
      this.props.dataSource || [],
      ['stationType.key'],
      ['asc']
    )

    let stationCount = _.countBy(sourceSorted, 'stationType.key')
    //logic return groupRow or groupRow and Row
    let result = [].concat.apply(
      [],
      sourceSorted.map((row, index) => {
        //content Row
        let resultRow = [
          {
            content: (
              <strong>
                {(this.props.pagination.page - 1) *
                  this.props.pagination.itemPerPage +
                  index +
                  1}
              </strong>
            )
          },
          {
            content: (
              <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                {row.name}
              </Span>
            )
          },
          {
            content: (
              <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                {row.address}
              </Span>
            )
          },
          /* checkbox gởi cảnh báo */
          {
            content: (
              <div style={{textAlign: 'center'}}>
                <Checkbox 
                  checked= {_.get(row, `options.warning.allowed`, false)} 
                  onChange={(e) => this.props.updateStationConfig({row, key: 'warning', value: e.target.checked})}
                />
              </div>
            )
          },
          /* checkbox SMS */
          {
            content: (
              <div style={{textAlign: 'center'}}>
                <Checkbox 
                  checked= {_.get(row, `options.sms.allowed`, false)} 
                  onChange={(e) => this.props.updateStationConfig({row, key: 'sms', value: e.target.checked})}
                />
              </div>
            )
          },
          /* checkbox Email */
          {
            content: (
              <div style={{textAlign: 'center'}}>
                <Checkbox 
                  checked= {_.get(row, `options.email.allowed`, false)} 
                  onChange={(e) => this.props.updateStationConfig({row, key: 'email', value: e.target.checked})}
                />
              </div>
            )
          },
          
        ]
        //check if Group exist or not
        if (row.stationType && stationTypeArr.indexOf(row.stationType.key) > -1)
          return [resultRow]
        else {
          stationTypeArr.push(row.stationType.key)
          return [
            [
              { content: '' },
              {
                content: (
                  <div>
                    <strong>
                      {row.stationType.name}{' '}
                      {stationCount[row.stationType.key]
                        ? '(' + stationCount[row.stationType.key] + ')'
                        : ''}
                    </strong>
                  </div>
                )
              }
            ],
            resultRow
          ]
        }
      })
    )
    return result
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['config']} />

        {/* FORM CONTROL */}
        <Row style={{marginBottom: 20}}>
          <StationAutoSearchForm
            onChangeSearch={this.props.onChangeSearch}
            initialValues={this.props.data}
          />
        </Row>

        {/* TABLE */}
        <Row>
          <DynamicTable
            isFixedSize
            isLoading={this.props.isLoading}
            paginationOptions={{
              isSticky: true
            }}
            head={this.getHead()}
            rows={this.getRows()}
            // pagination={this.props.pagination}
            // onSetPage={this.props.onChangePage}
          />
        </Row>

        <Row type="flex" justify="end" gutter={16} style={{marginBottom: 20}}>
          <Button onClick={this.props.clearCache}>{i18n.cancel}</Button>
          <Button 
            type="primary" 
            loading={this.props.isSave} 
            onClick={this.props.submitCache}
            style={{marginLeft: 16}}
            >
            {i18n.save}
          </Button>
        </Row>
      </PageContainer>
    )
  }
}
