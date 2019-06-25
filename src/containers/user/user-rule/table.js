import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Row, Table, Checkbox, Button, Icon, message } from 'antd'
import _ from 'lodash'
import swal from 'sweetalert2'

import { translate } from 'hoc/create-lang'
import {USER_RULE_TABLE_OPTIONS}  from 'constants/labels'

const i18n = {
  submit: translate('addon.save'),
  success: translate("addon.onSave.update.success"),
  error: translate("addon.onSave.update.error"),
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label')
}

const showSuccess = (msg) => {
  message.success(`${msg}`);
};

@autobind
export default class UserRuleTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {}
  
  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSourceWorking: [],             /* working dir */
      dataSourceCommited: [],     /* index */

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
    if (nextProps.dataSource.length !== this.state.dataSourceCommited.length ) {
      this.setState({
        dataSourceCommited: _.cloneDeep(nextProps.dataSource),
        dataSourceWorking: _.cloneDeep(nextProps.dataSource)
      })
      _.forEach(_.values(USER_RULE_TABLE_OPTIONS), column => {
        this.checkIndeterminate(column, nextProps.dataSource)
      })
    }
  }

  /* NOTE  RENDER */
  render() {
    return (
      <Row>
        <Table
          size="middle"
          pagination={false}
          loading={{spinning: this.props.isGettingStationsAuto, indicator: <Icon type="loading" style={{ fontSize: 24 }} spin />}}
          dataSource={this.getTableRows(this.state.dataSourceWorking)} 
          columns={this.getTableHeader()} 
        />
        <Button
          style={{margin: '20px 0'}}
          type="primary" 
          block 
          loading={this.state.isSave} 
          onClick={this.submitCache}>
          {i18n.submit}
        </Button>
      </Row>
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
        _id: row._id,
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
    let _dataSourceWorking = this.state.dataSourceWorking
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

      _.forEach(_dataSourceWorking, (row, index) => {
        this.onChagedOptionOfRow({index, row, key: USER_RULE_TABLE_OPTIONS.primary, value: checked})
      })
    }
    else {
      /* 
      - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
      - update cached
      */
      _.forEach(_dataSourceWorking, (row, index) => {
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
        this.updateCache(index, row, column, value)
        this.checkIndeterminate(column, this.state.dataSourceWorking)
      })
    }
    else {
      this.updateDataSource(index, key, value)
      this.updateCache(index, row, key, value)
      this.checkIndeterminate(key, this.state.dataSourceWorking)
    }
  }

  updateDataSource(index, key, value) {
    let _dataSourceWorking = this.state.dataSourceWorking
    _.set(_dataSourceWorking, `[${index}].options[${key}].allowed`, value)
    this.setState({ dataSourceWorking: _dataSourceWorking })
  }

  updateCache(index, row, key, value) {
    /* NOTE  cached content
      {
        "_id": {
          manager: {allowed: true },
          warning: {allowed: true },
          sms    : {allowed: false},
          email  : {allowed: true }
        }
      }
    */
    let _cachedData = this.state.cachedData
    let _dataSourceOriginal = this.state.dataSourceCommited

    let originalOption = _.get(_dataSourceOriginal[index], ['options', key, 'allowed'], false)
    let isHasValueInCached = _.get(_cachedData, [row._id, key])
    
    if (isHasValueInCached){
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
    let originalData = this.state.dataSourceCommited
    this.setState({
      dataSourceWorking: [...originalData],
      cachedData: {}
    })
  }

  checkIndeterminate(column, data) {
    let _dataSourceWorking = _.cloneDeep(data)
    let result = _.map(_dataSourceWorking, station => {
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
    console.log("-- submited data -- ", this.state.cachedData)
    this.setState({isSave: true})
    setTimeout(() => {
      showSuccess(i18n.success)
      this.setState({isSave: false})
    }, 1000)
    /* ------------------------------------------------------------------------------------ */
    // this.setState({isSave: true})
    // const res = await updateStationAutoOptions(this.state.cachedData)
    // if (res.success) {
    //   this.setState({
    //     dataSourceCommited: _.cloneDeep(this.state.dataSourceWorking),
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