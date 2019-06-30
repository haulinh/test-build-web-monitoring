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
import { STATION_AUTO_OPTIONS } from 'constants/labels'
import swal from 'sweetalert2'

import DynamicTable from 'components/elements/dynamic-table'

const i18n = {
  breadCrumb: translate('configStation.breadCrumb'),
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label'),
  allowSendWarning: translate('stationAutoManager.options.allowSendWarning.label'),
  cancel: 'Bõ chọn', /* MARK  @translate */
  submit: translate('addon.save'),
  updateSuccess: translate("addon.onSave.update.success"),
  updateError: translate("addon.onSave.update.error"), 
}


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
export default class StationAutoConfigNotification extends React.Component {
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


  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length ) {
      this.setState({
        dataSourceOriginal: _.cloneDeep(nextProps.dataSource),
        dataSource: _.cloneDeep(nextProps.dataSource)
      })
      _.forEach(_.values(STATION_AUTO_OPTIONS), column => {
        this.checkIndeterminate(column, nextProps.dataSource)
      })
    }
  }


  render() {
    return (
      <PageContainer>
        <Breadcrumb 
          items={['configNotification']}
        />

        {/* FORM CONTROL */}
        <Row style={{marginBottom: 20}}>
          <StationAutoSearchForm
            onChangeSearch={this.props.onChangeSearch}
            initialValues={this.props.data}
          />
        </Row>

        {/* TABLE */}
        <Row style={{marginBottom: 50}}>
          <DynamicTable
            isFixedSize
            isLoading={this.props.isLoading}
            paginationOptions={{
              isSticky: true
            }}
            head={this.getHead()}
            rows={this.getRows()}
          />
        </Row>

        <Row style={{marginBottom: 16}}>
          {/* NOTE  KHONG XOA, uncomment khi a @hung thay đổi yêu cầu */}
          {/* <Button onClick={this.props.clearCache}>{i18n.cancel}</Button> */}
          <Button 
            block
            type="primary" 
            loading={this.state.isSave} 
            onClick={this.submitCache}
            disabled={_.keys(this.state.cachedData).length === 0}
            >
            {i18n.submit}
          </Button>
        </Row>
      </PageContainer>
    )
  }


  getHead() {
    const isDisabledCheckAll = !this.state.isWarningCheckAll && !this.state.isWarningIndeterminate
    return [
      { content: '#', width: 2 },
      { content: i18n.stationName, width: 15 },
      { content: i18n.stationAddr, width: 20 },
      { 
        content: (
          <div>
            <Checkbox
              indeterminate={this.state.isWarningIndeterminate}
              checked={this.state.isWarningCheckAll}
              onChange={(e) => this.onChagedOptionOfHeader(STATION_AUTO_OPTIONS.PRIMARY, e.target.checked)}>
              {i18n.allowSendWarning}
            </Checkbox>
          </div>), 
        width: 15 },
      { 
        content: (
          <div>
            <Checkbox
              indeterminate={this.state.isSmsIndeterminate}
              checked={this.state.isSmsCheckAll}
              disabled={isDisabledCheckAll}
              onChange={(e) => this.onChagedOptionOfHeader(STATION_AUTO_OPTIONS.SMS, e.target.checked)}>
              SMS
            </Checkbox>
          </div>), 
        width: 10 },
      { 
        content: (
          <div>
            <Checkbox
              indeterminate={this.state.isEmailIndeterminate}
              checked={this.state.isEmailCheckAll}
              disabled={isDisabledCheckAll}
              onChange={(e) => this.onChagedOptionOfHeader(STATION_AUTO_OPTIONS.EMAIL, e.target.checked)}>
              Email
            </Checkbox>
          </div>), 
        width: 10 },
    ]
  }


  getRows() {
    const isDisabledCheckAll = !this.state.isWarningCheckAll && !this.state.isWarningIndeterminate

    let stationTypeArr = []

    let sourceSorted = _.orderBy(
      this.state.dataSource || [],
      ['stationType.key'],
      ['asc']
    )

    let stationCount = _.countBy(sourceSorted, 'stationType.key')
    //logic return groupRow or groupRow and Row
    let result = [].concat.apply(
      [],
      sourceSorted.map((row, index) => {
        const isWarningCheckboxDisabled =  _.get(row, ['options', STATION_AUTO_OPTIONS.PRIMARY, 'allowed'], false) === false
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
              <div>
                <Checkbox 
                  checked= {_.get(row, ['options', STATION_AUTO_OPTIONS.PRIMARY, 'allowed'], false)} 
                  onChange={(e) => this.onChagedOptionOfRow({row, key: STATION_AUTO_OPTIONS.PRIMARY, value: e.target.checked})}
                />
              </div>
            )
          },
          /* checkbox SMS */
          {
            content: (
              <div>
                <Checkbox
                  disabled={isDisabledCheckAll || isWarningCheckboxDisabled}
                  checked= {_.get(row, ['options', STATION_AUTO_OPTIONS.SMS, 'allowed'], false)}
                  onChange={(e) => this.onChagedOptionOfRow({row, key: STATION_AUTO_OPTIONS.SMS, value: e.target.checked})}
                />
              </div>
            )
          },
          /* checkbox Email */
          {
            content: (
              <div>
                <Checkbox
                  disabled={isDisabledCheckAll || isWarningCheckboxDisabled}
                  checked= {_.get(row, ['options', STATION_AUTO_OPTIONS.EMAIL, 'allowed'], false)} 
                  onChange={(e) => this.onChagedOptionOfRow({row, key: STATION_AUTO_OPTIONS.EMAIL, value: e.target.checked})}
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

  
  onChagedOptionOfHeader(column, checked) {
    let _dataSource = this.state.dataSource

    if (column === STATION_AUTO_OPTIONS.PRIMARY) {
      this.setState({
        isWarningIndeterminate: false,
        isSmsIndeterminate: false,
        isEmailIndeterminate: false,
        isWarningCheckAll: checked,
        isSmsCheckAll: checked,
        isEmailCheckAll: checked,
      })

      let columns = _.values(STATION_AUTO_OPTIONS)
      _.forEach(_dataSource, (station, index) => {
        _.forEach(columns, _column => {
          _.set(station, `options[${_column}].allowed`, checked)
          this.updateCache(station, _column, checked)
        })
      })

      this.setState({
        dataSource: _dataSource
      })
    }
    else {
      /* 
      - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
      - update cached
      */
      _.forEach(_dataSource, (station) => {
        let isDiffValue = _.get(station, ['options', column, 'allowed']) !== checked
        let isWarningCheckBoxEnabled = _.get(station, ['options', STATION_AUTO_OPTIONS.PRIMARY, 'allowed']) === true
        if (isDiffValue && isWarningCheckBoxEnabled) {
          this.onChagedOptionOfRow({row: station, key: column, value: checked})
        }
      })
    }

    switch(column) {
      case STATION_AUTO_OPTIONS.PRIMARY: {
        this.setState({
          isWarningCheckAll: checked, 
          isWarningIndeterminate: false
        })
        break;
      }
      case STATION_AUTO_OPTIONS.SMS: {
        this.setState({
          isSmsCheckAll: checked, 
          isSmsIndeterminate: false
        })
        break;
      }
      case STATION_AUTO_OPTIONS.EMAIL: {
        this.setState({
          isEmailCheckAll: checked, 
          isEmailIndeterminate: false
        })
        break;
      }
    }
  }


  onChagedOptionOfRow({row, key, value}) {
    if (key === STATION_AUTO_OPTIONS.PRIMARY) {
      let columns = _.values(STATION_AUTO_OPTIONS)
      console.log(columns, "columns_removedWarning")
      _.forEach(columns, column => {
        this.updateDataSource(row, column, value)
        this.updateCache(row, column, value)
        this.checkIndeterminate(column, this.state.dataSource)
      })
    }
    else {
      this.updateDataSource(row, key, value)
      this.updateCache(row, key, value)
      this.checkIndeterminate(key, this.state.dataSource)
    }
  }


  updateDataSource(row, key, value) {
    let _dataSource = this.state.dataSource
    let indexOfRow = _.findIndex(this.state.dataSource, stationAuto => stationAuto._id === row._id)
    _.set(_dataSource, `[${indexOfRow}].options[${key}].allowed`, value)

    this.setState({ dataSource: _dataSource })
  }


  updateCache(row, key, value) {
    /* NOTE  cached content
      {
        "_id": {
          warning: true,
          sms: false,
          email: true
        }
      }
    */
    let _cachedData = this.state.cachedData
    let _dataSourceOriginal = this.state.dataSourceOriginal

    let indexOfRow = _.findIndex(_dataSourceOriginal, stationAuto => stationAuto._id === row._id)
    let originalOption = _.get(_dataSourceOriginal[indexOfRow], ['options', key, 'allowed'], false)
    let currentValueInCache = _.get(_cachedData, [row._id, key])
    
    if (currentValueInCache){
      delete _cachedData[row._id][key]
      if (_.keys(_cachedData[row._id]).length === 0) {
        delete _cachedData[row._id]
      }
    }
    else if (originalOption !== value) {
      _.set(_cachedData, [row._id, key, 'allowed'], value)
    }

    this.setState({cachedData: _cachedData})
  }


  clearCache() {
    let originalData = this.state.dataSourceOriginal
    this.setState({
      dataSource: [...originalData],
      cachedData: {}
    })
  }


  checkIndeterminate(column, data) {
    let _dataSource = _.cloneDeep(data)
    let result = _.map(_dataSource, station => {
      return _.get(station, ['options', column, 'allowed'])
    })
    
    let countBy = _.countBy(result, Boolean)
    let isSame = countBy.false === undefined || countBy.true === undefined
    let isCheckAll = _.every(result)
    
    switch(column) {
      case STATION_AUTO_OPTIONS.PRIMARY : this.setState({isWarningIndeterminate : !isSame, isWarningCheckAll : isCheckAll }); break;
      case STATION_AUTO_OPTIONS.SMS     : this.setState({isSmsIndeterminate     : !isSame, isSmsCheckAll     : isCheckAll }); break;
      case STATION_AUTO_OPTIONS.EMAIL   : this.setState({isEmailIndeterminate   : !isSame, isEmailCheckAll   : isCheckAll }); break;
    }
  }


  async submitCache() {
    this.setState({isSave: true})
    const res = await updateStationAutoOptions(this.state.cachedData)
    if (res.success) {
      this.setState({
        dataSourceOriginal: _.cloneDeep(this.state.dataSource),
        cachedData: {}
      })
      showSuccess(i18n.updateSuccess)
    }
    else if (res.error) {
      console.log(res.message)
      swal({
        title: i18n.updateError,
        type: 'error'
      })
    }
  
    this.setState({isSave: false})
  }
}