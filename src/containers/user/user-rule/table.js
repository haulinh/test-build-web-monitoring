import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Table, Checkbox } from 'antd'
import _ from 'lodash'
import swal from 'sweetalert2'

import { translate } from 'hoc/create-lang'
import createManagerList from 'hoc/manager-list'
import StationAutoApi from 'api/StationAuto'
import {USER_RULE_TABLE_OPTIONS}  from 'constants/labels'

const i18n = {
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label')
}

@createManagerList({
  apiList: StationAutoApi.getStationAutos
})
@autobind
export default class UserRuleTable extends React.Component {
  static propTypes = {}
  static defaultProps = {}
  
  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSource: [],             /* working dir */
      dataSourceOriginal: [],     /* index */

      isSave: false,

      isManagerIndeterminate: false,
      isWarningIndeterminate: false,
      isSmsIndeterminate: false,
      isEmailIndeterminate: false,
      isManagerCheckAll: false,
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
      _.forEach(_.values(USER_RULE_TABLE_OPTIONS), column => {
        this.checkIndeterminate(column, nextProps.dataSource)
      })
    }
  }

  /* NOTE  RENDER */
  render() {
    let mockColumns = this.getTableHeader()
    let mockDataSource = this.getTableRows(this.state.dataSource)
    return (
      <Table 
        dataSource={mockDataSource} 
        columns={mockColumns} 
      />
    )
  }

  getTableHeader() {
    return [
      {
        title: '#',
        key: 'stt',
        align: 'center',
        width: 100,
        render(text, record, index){
          return <div style={{textAlign: 'center'}}>{index + 1}</div>
        }
      },
      {
        dataIndex: 'name',
        title: `${i18n.stationName}`,
        key: 'name',
        render(text, record, index){
          return <div>{text}</div>
        }
      },
      {
        dataIndex: 'address',
        title: `${i18n.stationAddr}`,
        key: 'address',
        render(text, record, index){
          return <div>{text}</div>
        }
      },
      /* NOTE : manager */
      {
        dataIndex: 'primary',
        title: (
          <Checkbox
            indeterminate={this.state.isManagerIndeterminate}
            checked={this.state.isManagerCheckAll}
            onChange={(e) => this.onChagedOptionOfHeader(USER_RULE_TABLE_OPTIONS.primary, e.target.checked)}>
            Trạm quản lý
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox 
              checked= {checked}
              onChange={(e) => this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.primary, value: e.target.checked})}
            />
          )
        }
      },
      /* NOTE : warning */
      {
        dataIndex: 'warning',
        title: (
          <Checkbox
            indeterminate={this.state.isWarningIndeterminate}
            checked={this.state.isWarningCheckAll}
            disabled={!this.state.isManagerCheckAll && !this.state.isManagerIndeterminate}
            onChange={(e) => this.onChagedOptionOfHeader(USER_RULE_TABLE_OPTIONS.warning, e.target.checked)}>
            warning
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox 
              checked= {checked}
              disabled={row.primary === false}
              onChange={(e) => this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.warning, value: e.target.checked})}
            />
          )
        }
      },
      /* NOTE : sms */
      {
        dataIndex: 'sms',
        title: (
          <Checkbox
            indeterminate={this.state.isSmsIndeterminate}
            checked={this.state.isSmsCheckAll}
            disabled={!this.state.isManagerCheckAll && !this.state.isManagerIndeterminate}
            onChange={(e) => this.onChagedOptionOfHeader(USER_RULE_TABLE_OPTIONS.sms, e.target.checked)}>
            SMS
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox 
              checked= {checked}
              disabled={row.primary === false}
              onChange={(e) => this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.sms, value: e.target.checked})}
            />
          )
        }
      },
      /* NOTE : eamil */
      {
        dataIndex: 'email',
        title: (
          <Checkbox
            indeterminate={this.state.isEmailIndeterminate}
            checked={this.state.isEmailCheckAll}
            disabled={!this.state.isManagerCheckAll && !this.state.isManagerIndeterminate}
            onChange={(e) => this.onChagedOptionOfHeader(USER_RULE_TABLE_OPTIONS.email, e.target.checked)}>
            Email
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox 
              checked= {checked}
              disabled={row.primary === false}
              onChange={(e) => this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.email, value: e.target.checked})}
            />
          )
        }
      },
    ]
  }


  getTableRows(data) {
    return data.map(row => {
      return {
        name: row.name,
        address: row.address,
        primary: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.primary, 'allowed'], false),
        warning: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.warning, 'allowed'], false),
        sms: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.sms, 'allowed'], false),
        email: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.email, 'allowed'], false)
      }
    })
  }


  onChagedOptionOfHeader(column, checked) {
    let _dataSource = this.state.dataSource
    console.log(column, checked)
    if (column === USER_RULE_TABLE_OPTIONS.primary) {
      this.setState({
        isManagerIndeterminate: false,
        isWarningIndeterminate: false,
        isSmsIndeterminate: false,
        isEmailIndeterminate: false,
        isManagerCheckAll: checked,
        isWarningCheckAll: checked,
        isSmsCheckAll: checked,
        isEmailCheckAll: checked,
      })

      _.forEach(_dataSource, (row, index) => {
        this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.primary, value: checked})
      })
    }
    else {
      /* 
      - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
      - update cached
      */
      _.forEach(_dataSource, (row, index) => {
        let isDiffValue = _.get(row, ['options', column, 'allowed']) !== checked
        let isPrimaryCheckBoxEnabled = _.get(row, ['options', USER_RULE_TABLE_OPTIONS.primary, 'allowed']) === true
        if (isDiffValue && isPrimaryCheckBoxEnabled) {
          this.onChagedOptionOfRow({index, row, key: column, value: checked})
        }
      })
    }

    switch(column) {
      case USER_RULE_TABLE_OPTIONS.warning: {
        this.setState({
          isWarningCheckAll: checked, 
          isWarningIndeterminate: false
        })
        break;
      }
      case USER_RULE_TABLE_OPTIONS.sms: {
        this.setState({
          isSmsCheckAll: checked, 
          isSmsIndeterminate: false
        })
        break;
      }
      case USER_RULE_TABLE_OPTIONS.email: {
        this.setState({
          isEmailCheckAll: checked, 
          isEmailIndeterminate: false
        })
        break;
      }
      default: break;
    }
  }

  onChagedOptionOfRow({index, row, key, value}) {
    if (key === USER_RULE_TABLE_OPTIONS.primary) {
      let columns = _.values(USER_RULE_TABLE_OPTIONS)
      _.forEach(columns, column => {
        this.updateDataSource(index, column, value)
        this.updateCache(row, column, value)
        this.checkIndeterminate(column, this.state.dataSource)
      })
    }
    else {
      this.updateDataSource(index, key, value)
      this.updateCache(row, key, value)
      this.checkIndeterminate(key, this.state.dataSource)
    }
  }

  updateDataSource(index, key, value) {
    let _dataSource = this.state.dataSource
    _.set(_dataSource, `[${index}].options[${key}].allowed`, value)
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
      case USER_RULE_TABLE_OPTIONS.primary : this.setState({isManagerIndeterminate : !isSame, isManagerCheckAll : isCheckAll }); break;
      case USER_RULE_TABLE_OPTIONS.warning : this.setState({isWarningIndeterminate : !isSame, isWarningCheckAll : isCheckAll }); break;
      case USER_RULE_TABLE_OPTIONS.sms     : this.setState({isSmsIndeterminate     : !isSame, isSmsCheckAll     : isCheckAll }); break;
      case USER_RULE_TABLE_OPTIONS.email   : this.setState({isEmailIndeterminate   : !isSame, isEmailCheckAll   : isCheckAll }); break;
    }
  }

  async submitCache() {
    // this.setState({isSave: true})
    // const res = await updateStationAutoOptions(this.state.cachedData)
    // if (res.success) {
    //   this.setState({
    //     dataSourceOriginal: _.cloneDeep(this.state.dataSource),
    //     cachedData: {}
    //   })
    //   showSuccess(i18n.success)
    // }
    // else if (res.error) {
    //   console.log(res.message)
    //   swal({
    //     title: i18n.error,
    //     type: 'error'
    //   })
    // }
  
    // this.setState({isSave: false})
  }
}