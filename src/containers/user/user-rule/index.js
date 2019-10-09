import React from 'react'
import PropTypes from 'prop-types'
import { Row, Form, Checkbox, Button, message } from 'antd'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import _ from 'lodash'
import StationAutoApi from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import createLanguageHoc from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import { mapPropsToFields } from 'utils/form'
import StationAutoSearchForm from './search-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import { USER_RULE_TABLE_COLUMN } from 'constants/labels'
import { updateRole_v1 } from 'api/UserApi'

import swal from 'sweetalert2'

import DynamicTable from 'components/elements/dynamic-table'

const i18n = {
  // cancel: 'Bõ chọn', /* MARK  @translate */
  submit: translate('addon.save'),
  warning:translate('addon.warning'),
  refresh: translate('addon.refresh'),
  cancel: translate('addon.cancel'),
  updateSuccess: translate("addon.onSave.update.success"),
  updateError: translate("addon.onSave.update.error"),
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label'),
  manager: translate('stationAutoManager.options.userRole.stationManager'),
  sendNotification: translate('stationAutoManager.options.userRole.allowSendWarning'),
  sms: translate('stationAutoManager.options.userRole.sms'),
  email: translate('stationAutoManager.options.userRole.email'),
  VersionError: translate('serverResponse.error.VersionError') 
}


const showSuccess = (msg) => {
  message.success(`${msg}`);
};

const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

@protectRole(ROLE.USER.VIEW)
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

  static defaultProps = {
    dataSource: []
  }

  constructor(props) {
    super(props)

    // this.refSearchForm = React.createRef()

    this.state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSource: [],             /* working dir */
      dataSourceOriginal: [],     /* index */
      dataSourceDefault: [],

      isSave: false,
      isManagerIndeterminate: true,
      isWarningIndeterminate: true,
      isSmsIndeterminate: true,
      isEmailIndeterminate: true,
      isManagerCheckAll: false,
      isWarningCheckAll: false,
      isSmsCheckAll: false,
      isEmailCheckAll: false,

      selectedUser: {},
      selectedRole: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length ) {
      let _dataSource = this.transformDataSource(nextProps.dataSource)

      let sortedDataSource = _.orderBy(
        _dataSource || [],
        ['stationType.key'],
        ['asc']
      )

      this.setState({
        dataSource: _.cloneDeep(sortedDataSource),
        dataSourceOriginal: _.cloneDeep(sortedDataSource),
        dataSourceDefault: _.cloneDeep(sortedDataSource),
      })
      _.forEach(_.values(USER_RULE_TABLE_COLUMN), column => {
        this.checkIndeterminate(sortedDataSource)
      })
    }
  }

  render() {
    let isAllowSubmit = this.isAllowSubmit()
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'rule']} />

        {/* FORM CONTROL */}
        <Row style={{marginBottom: 20}}>
          <StationAutoSearchForm
            getRef={(el) => this.refSearchForm = el }
            updateDataForSubmit={this.updateDataForSubmit}
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
            disabled={isAllowSubmit}
            >
            {i18n.submit}
          </Button>
        </Row>
      </PageContainer>
    )
  }

  updateDataForSubmit({name, value}) {
    if (name === 'selectedUser') {
      this.clearCache()
      this.resetDataSource(name, value)
    } else {
      this.setState({
        [name]: value
      })
    }
  }

  
  getHead() {
    // const isDisabledCheckAll = !this.state.isManagerCheckAll && !this.state.isManagerIndeterminate
    return [
      { content: '#', width: 2 },
      { content: i18n.stationName, width: 15 },
      { content: i18n.stationAddr, width: 20 },
      { 
        content: (
          <div>
            <Checkbox
              indeterminate={this.state.isManagerIndeterminate}
              checked={this.state.isManagerCheckAll}
              onChange={(e) => this.onChagedOptionOfHeader(e.target.checked)}>
            </Checkbox>
            &nbsp;&nbsp;{i18n.manager}
          </div>), 
        width: 15 
      },
      { 
        content: ( <div>{i18n.sendNotification}</div> ),
        width: 15 
      },
      { 
        content: ( <div>{i18n.sms}</div> ),
        width: 10
      },
      { 
        content: ( <div>{i18n.email}</div> ),
        width: 10
      },
    ]
  }


  getRows() {
    // const isDisabledCheckAll = !this.state.isManagerCheckAll && !this.state.isManagerIndeterminate

    let stationTypeArr = []

    let stationCount = _.countBy(this.state.dataSource, 'stationType.key')
    //logic return groupRow or groupRow and Row
    let result = [].concat.apply(
      [],
      this.state.dataSource.map((row, index) => {
        // const isManagerCheckboxDisabled =  _.get(row, ['options', USER_RULE_TABLE_COLUMN.PRIMARY, 'allowed'], false) === false
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
          /* checkbox quản lý trạm */
          {
            content: (
              <div>
                <Checkbox
                  checked= {_.get(row, ['options', USER_RULE_TABLE_COLUMN.PRIMARY, 'allowed'], false)} 
                  onChange={(e) => this.onChagedOptionOfRow({index, row, column: USER_RULE_TABLE_COLUMN.PRIMARY, value: e.target.checked})}
                />
              </div>
            )
          },
          /* checkbox gởi cảnh báo */
          {
            content: (
              <div>
                <Checkbox
                  disabled={true}
                  checked= {_.get(row, ['options', USER_RULE_TABLE_COLUMN.WARNING, 'allowed'], false)}
                />
              </div>
            )
          },
          /* checkbox SMS */
          {
            content: (
              <div>
                <Checkbox
                  disabled={true}
                  checked= {_.get(row, ['options', USER_RULE_TABLE_COLUMN.SMS, 'allowed'], false)}
                />
              </div>
            )
          },
          /* checkbox Email */
          {
            content: (
              <div>
                <Checkbox
                  disabled={true}
                  checked= {_.get(row, ['options', USER_RULE_TABLE_COLUMN.EMAIL, 'allowed'], false)} 
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


  transformDataSource(stationAutos) {
    let { WARNING, SMS, EMAIL } = USER_RULE_TABLE_COLUMN
    return _.map(stationAutos, station => {
      let defaultOptions = {
        [WARNING]: {allowed: true},
        [SMS]: {allowed: true},
        [EMAIL]: {allowed: true}
      }
      _.set(station, ['options'], _.cloneDeep(defaultOptions))
      return station
    })
  }

  _transformUserOptionsFromArrayToObject(userOptions = []) {
    /* FROM
      [
        {_id: '', options: {manager: {allowed: true}} },
        ....
      ]

      TO:
      {
        <id>: {manager: {allowed: true, ...}},
        ...
      }
    */
    let result = {}
    userOptions.forEach(option => {
      _.set(result, [option._id], option.options)
    })
    return result
  }
  
  onChagedOptionOfHeader(checked) {
    let _dataSource = this.state.dataSource
    let { PRIMARY } = USER_RULE_TABLE_COLUMN

    this.setState({
      isManagerIndeterminate: false,
      isManagerCheckAll: checked,
    })

    _.forEach(_dataSource, (station, index) => {
      _.set(station, ['options', PRIMARY, 'allowed'], checked)
      this.updateCache(index, station, PRIMARY, checked)
    })

    this.setState({
      isManagerCheckAll: checked,
    })
  }

  onChagedOptionOfRow({index, row, column, value}) {
    this.updateDataSource(index, row, column, value)
    this.updateCache(index, row, column, value)
    this.checkIndeterminate(this.state.dataSource)
  }

  updateDataSource(index, row, column, value) {
    let _dataSource = this.state.dataSource
    _.set(_dataSource, [index, 'options', column, 'allowed'], value)
    this.setState({ dataSource: _dataSource })
  }

  updateCache(indexOfRow, row, column, value) {
    /* NOTE  cached content
      {
        "_id": {
          warning: true,
          sms: false,
          email: true
        }
      }
    */

    let { PRIMARY, WARNING, SMS, EMAIL } = USER_RULE_TABLE_COLUMN
    let _cachedData = this.state.cachedData
    let _dataSourceOriginal = this.state.dataSourceOriginal
    
    /* NOTE  giải thích 
      - kiểm tra xem trạm này đã từng được cấu hình chưa
        - nếu chưa thì save all hoặc delete all trong cache
        - nêu có rồi thì thì save hoặc delete manager checkbox
    */
    let isConfiged = _.get(_dataSourceOriginal[indexOfRow], ['options', PRIMARY], false)
    let isDiffWithOriginalData = _.get(_dataSourceOriginal[indexOfRow], ['options', PRIMARY, 'allowed'], false) !== value
    if (isConfiged && isDiffWithOriginalData) {
      _.set(_cachedData, [row._id, PRIMARY, 'allowed'], value)
    }
    else if (!isConfiged && value) {
      _cachedData[row._id] = {
        [PRIMARY]: { allowed: true },
        [WARNING]: { allowed: true },
        [SMS]: { allowed: true },
        [EMAIL]: { allowed: true },
      }
    }
    else {
      delete _cachedData[row._id]
    }

    this.setState({cachedData: _cachedData})
  }

  clearCache() {
    this.setState({
      cachedData: {}
    })
  }

  resetDataSource(name , value) {
    let rows = _.cloneDeep(this.state.dataSourceDefault)
    let userID = value._id
    if (userID) {
      let stationsOptions = this._transformUserOptionsFromArrayToObject(value.stationAutos)
      console.log(stationsOptions,"stationsOptions")
      _.forEach(rows, row => {
        if (_.get(stationsOptions, [row._id])) {
          row.options = _.clone(stationsOptions[row._id])
        }
      })
      this.setState({
        [name]: value,
        dataSource: _.cloneDeep(rows),
        dataSourceOriginal: _.cloneDeep(rows)
      })
      _.forEach(_.values(USER_RULE_TABLE_COLUMN), column => {
        this.checkIndeterminate(rows)
      })
    }
  }

  checkIndeterminate(_dataSource) {
    let result = _.map(_dataSource, station => {
      return _.get(station, ['options', USER_RULE_TABLE_COLUMN.PRIMARY, 'allowed'])
    })
    
    let countBy = _.countBy(result, Boolean)
    let isSame = countBy.false === undefined || countBy.true === undefined
    let isCheckAll = _.every(result)
    
    this.setState({isManagerIndeterminate : !isSame, isManagerCheckAll : isCheckAll })
  }

  isAllowSubmit() {
    let isHasCache = _.keys(this.state.cachedData).length !== 0
    let isSelectedUser = _.get(this.state.selectedUser, '_id')
    let isSelectedRole = _.get(this.state.selectedRole, '_id', null) 

    const condition1 = isSelectedUser && isSelectedRole
    const condition2 = isSelectedUser && isSelectedRole && isHasCache
    return !(condition1 || condition2)
  }

  async submitCache() {
    let { cachedData, selectedUser, selectedRole } = this.state
    let submittedData = {
      role: selectedRole, 
      stationAutos: cachedData,
      isAdmin: selectedUser.isAdmin,
      "__v": selectedUser.__v
    }

    this.setState({isSave: true})
    const res = await updateRole_v1(selectedUser._id, submittedData)
    if (res.success) {
      this.setState({
        dataSourceOriginal: _.cloneDeep(this.state.dataSource),
        cachedData: {}
      })
      this.refSearchForm.updateUserVersion(selectedUser._id)
      showSuccess(i18n.updateSuccess)
    }
    else if (res.error) {
      if (res.code === "VersionError") {
        swal({
          type: 'warning',
          title: i18n.warning,
          text: i18n.VersionError,
          showCancelButton: true,
          cancelButtonText: i18n.cancel,
          focusConfirm: true,
          confirmButtonText: i18n.refresh,
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !swal.isLoading(),
          preConfirm: async () => {
            return this.refSearchForm.refreshUsers(selectedUser._id)
          }
        }).then(() => {
          showSuccess(i18n.updateSuccess)
        }).catch(() => {
          swal({
            title: i18n.updateError,
            type: 'error'
          })
        })
      }
      else {
        swal({
          title: i18n.updateError,
          type: 'error'
        })
      }
    }
    
    this.setState({isSave: false})
  }
}