import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Row, Table, Checkbox, Button, Icon, message } from 'antd'
import _ from 'lodash'
import swal from 'sweetalert2'

import { translate } from 'hoc/create-lang'
import { USER_RULE_TABLE_OPTIONS } from 'constants/labels'

const i18n = {
  submit: translate('addon.save'),
  success: translate('addon.onSave.update.success'),
  error: translate('addon.onSave.update.error'),
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label'),
  noData: 'Vui lòng chọn ở trên trước' /* MARK  @translate */,
}

const showSuccess = msg => {
  message.success(`${msg}`)
}

@autobind
export default class UserRuleTable extends React.Component {
  static propTypes = {
    stations: PropTypes.array.isRequired,
    updateDataForSubmit: PropTypes.func.isRequired,
    userInfo: PropTypes.object,
    selectedUserID: PropTypes.string.isRequired,
    selectedRoleID: PropTypes.string.isRequired,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */

      cachedData: {} /* commit */,
      dataSourceWorking: [] /* working dir */,
      dataSourceCommited: [] /* index */,
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
    /* remove options trong stationsAuto vì không cần */
    /* mục đích sẽ lấy options của user gắn vào */
    const isDiffDataSource =
      nextProps.stations.length !== this.state.dataSourceCommited.length
    const isDiffUser =
      _.get(nextProps.userInfo, ['_id'], undefined) !=
      _.get(this.state.userInfo, ['_id'], undefined)
    const isHasUser = nextProps.userInfo

    if (isDiffDataSource || isDiffUser) {
      let _stations = nextProps.stations
      if (isHasUser && isDiffUser) {
        _stations = _.map(_stations, station => {
          let options = _.get(nextProps.userInfo, ['options', station._id], {
            manager: false,
            sms: false,
            email: false,
            warning: false,
          })
          station.options = options
          return station
        })
      }

      this.setState({
        dataSourceCommited: _.cloneDeep(_stations),
        dataSourceWorking: _.cloneDeep(_stations),
      })

      _.forEach(_.values(USER_RULE_TABLE_OPTIONS), column => {
        this.checkIndeterminate(column, _stations)
      })
    }
  }

  /* NOTE  RENDER */
  render() {
    let stationAutos = this.state.dataSourceWorking
    let _isSubmitValidated = !this.isSubmitValidated()
    let _isShowTableContent =
      this.props.selectedUserID && this.props.selectedRoleID
    let dataSource = this.getTableRows(stationAutos)
    let columns = this.getTableHeader()

    return (
      <Row>
        <Table
          size="middle"
          pagination={false}
          dataSource={_isShowTableContent ? dataSource : []}
          columns={columns}
          locale={{
            emptyText: (
              <div style={{ margin: '30px 0' }}>
                <Icon
                  type="info-circle"
                  style={{ fontSize: 48, marginBottom: 20 }}
                />
                <div>{i18n.noData}</div>
              </div>
            ),
          }}
          // loading={{spinning: this.props.isGettingStationsAuto, indicator: <Icon type="loading" style={{ fontSize: 24 }} spin />}}
        />
        <Button
          block
          type="primary"
          disabled={_isSubmitValidated}
          style={{ margin: '20px 0' }}
          loading={this.state.isSave}
          onClick={this.submit}
        >
          {i18n.submit}
        </Button>
      </Row>
    )
  }

  getTableRows(data) {
    return data.map(row => {
      return {
        _id: row._id,
        name: row.name,
        address: row.address,
        primary: _.get(
          row,
          ['options', USER_RULE_TABLE_OPTIONS.primary],
          false
        ),
        warning: _.get(
          row,
          ['options', USER_RULE_TABLE_OPTIONS.warning],
          false
        ),
        sms: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.sms], false),
        email: _.get(row, ['options', USER_RULE_TABLE_OPTIONS.email], false),
      }
    })
  }

  getTableHeader() {
    return [
      {
        title: '#',
        key: 'stt',
        align: 'center',
        width: 100,
        render(text, record, index) {
          return <div style={{ textAlign: 'center' }}>{index + 1}</div>
        },
      },
      {
        dataIndex: 'name',
        title: `${i18n.stationName}`,
        key: 'name',
        render(text, record, index) {
          return <div>{text}</div>
        },
      },
      {
        dataIndex: 'address',
        title: `${i18n.stationAddr}`,
        key: 'address',
        render(text, record, index) {
          return <div>{text}</div>
        },
      },
      /* NOTE : manager */
      {
        dataIndex: 'primary',
        title: (
          <Checkbox
            indeterminate={this.state.isManagerIndeterminate}
            checked={this.state.isManagerCheckAll}
            onChange={e =>
              this.onChagedOptionOfHeader(
                USER_RULE_TABLE_OPTIONS.primary,
                e.target.checked
              )
            }
          >
            Trạm quản lý
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox
              checked={checked}
              onChange={e =>
                this.onChagedOptionOfRow({
                  index,
                  row,
                  key: USER_RULE_TABLE_OPTIONS.primary,
                  value: e.target.checked,
                })
              }
            />
          )
        },
      },
      /* NOTE : warning */
      {
        dataIndex: 'warning',
        title: (
          <Checkbox
            indeterminate={this.state.isWarningIndeterminate}
            checked={this.state.isWarningCheckAll}
            disabled={
              !this.state.isManagerCheckAll &&
              !this.state.isManagerIndeterminate
            }
            onChange={e =>
              this.onChagedOptionOfHeader(
                USER_RULE_TABLE_OPTIONS.warning,
                e.target.checked
              )
            }
          >
            warning
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox
              checked={checked}
              disabled={row.primary === false}
              onChange={e =>
                this.onChagedOptionOfRow({
                  index,
                  row,
                  key: USER_RULE_TABLE_OPTIONS.warning,
                  value: e.target.checked,
                })
              }
            />
          )
        },
      },
      /* NOTE : sms */
      {
        dataIndex: 'sms',
        title: (
          <Checkbox
            indeterminate={this.state.isSmsIndeterminate}
            checked={this.state.isSmsCheckAll}
            disabled={
              !this.state.isManagerCheckAll &&
              !this.state.isManagerIndeterminate
            }
            onChange={e =>
              this.onChagedOptionOfHeader(
                USER_RULE_TABLE_OPTIONS.sms,
                e.target.checked
              )
            }
          >
            SMS
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox
              checked={checked}
              disabled={row.primary === false}
              onChange={e =>
                this.onChagedOptionOfRow({
                  index,
                  row,
                  key: USER_RULE_TABLE_OPTIONS.sms,
                  value: e.target.checked,
                })
              }
            />
          )
        },
      },
      /* NOTE : eamil */
      {
        dataIndex: 'email',
        title: (
          <Checkbox
            indeterminate={this.state.isEmailIndeterminate}
            checked={this.state.isEmailCheckAll}
            disabled={
              !this.state.isManagerCheckAll &&
              !this.state.isManagerIndeterminate
            }
            onChange={e =>
              this.onChagedOptionOfHeader(
                USER_RULE_TABLE_OPTIONS.email,
                e.target.checked
              )
            }
          >
            Email
          </Checkbox>
        ),
        render: (checked, row, index) => {
          return (
            <Checkbox
              checked={checked}
              disabled={row.primary === false}
              onChange={e =>
                this.onChagedOptionOfRow({
                  index,
                  row,
                  key: USER_RULE_TABLE_OPTIONS.email,
                  value: e.target.checked,
                })
              }
            />
          )
        },
      },
    ]
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
        this.onChagedOptionOfRow({
          index,
          row,
          key: USER_RULE_TABLE_OPTIONS.primary,
          value: checked,
        })
      })
    } else {
      /* 
      - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
      - update cached
      */
      _.forEach(_dataSourceWorking, (row, index) => {
        let isDiffValue = _.get(row, ['options', column]) !== checked
        let isPrimaryCheckBoxEnabled =
          _.get(row, ['options', USER_RULE_TABLE_OPTIONS.primary]) === true
        if (isDiffValue && isPrimaryCheckBoxEnabled) {
          this.onChagedOptionOfRow({ index, row, key: column, value: checked })
        }
      })
    }

    switch (column) {
      case USER_RULE_TABLE_OPTIONS.warning: {
        this.setState({
          isWarningCheckAll: checked,
          isWarningIndeterminate: false,
        })
        break
      }
      case USER_RULE_TABLE_OPTIONS.sms: {
        this.setState({
          isSmsCheckAll: checked,
          isSmsIndeterminate: false,
        })
        break
      }
      case USER_RULE_TABLE_OPTIONS.email: {
        this.setState({
          isEmailCheckAll: checked,
          isEmailIndeterminate: false,
        })
        break
      }
      default:
        break
    }
  }

  onChagedOptionOfRow({ index, row, key, value }) {
    if (key === USER_RULE_TABLE_OPTIONS.primary) {
      let columns = _.values(USER_RULE_TABLE_OPTIONS)
      _.forEach(columns, column => {
        this.updateDataSourceWorking(index, column, value)
        this.updateCache(index, row, column, value)
        this.checkIndeterminate(column, this.state.dataSourceWorking)
      })
    } else {
      this.updateDataSourceWorking(index, key, value)
      this.updateCache(index, row, key, value)
      this.checkIndeterminate(key, this.state.dataSourceWorking)
    }

    this.forceUpdate()
  }

  updateDataSourceWorking(index, key, value) {
    _.set(this.state.dataSourceWorking, `[${index}].options[${key}]`, value)
  }

  updateCache(index, row, key, value) {
    /* NOTE  cached content
      {
        "_id": {
          manager: false,
          warning: false,
          sms    : false,
          email  : false,
        }
      }
    */
    let _cachedData = this.state.cachedData
    let _dataSourceOriginal = this.state.dataSourceCommited

    let originalOption = _.get(
      _dataSourceOriginal[index],
      ['options', key],
      false
    )
    let isHasValueInCached = _.get(_cachedData, [row._id, key])

    if (isHasValueInCached) {
      delete _cachedData[row._id][key]
      if (_.keys(_cachedData[row._id]).length === 0) {
        delete _cachedData[row._id]
      }
    } else if (originalOption !== value) {
      _.set(_cachedData, [row._id, key], value)
    }
    this.setState({ cachedData: _cachedData })
  }

  clearCache() {
    this.setState({
      dataSourceWorking: [...this.state.dataSourceCommited],
      cachedData: {},
    })
  }

  checkIndeterminate(column, data) {
    let _dataSourceWorking = _.cloneDeep(data)
    let result = _.map(_dataSourceWorking, station => {
      return _.get(station, ['options', column])
    })

    let countBy = _.countBy(result, Boolean)
    let isSame = countBy.false === undefined || countBy.true === undefined
    let isCheckAll = _.every(result)

    switch (column) {
      case USER_RULE_TABLE_OPTIONS.primary:
        this.setState({
          isManagerIndeterminate: !isSame,
          isManagerCheckAll: isCheckAll,
        })
        break
      case USER_RULE_TABLE_OPTIONS.warning:
        this.setState({
          isWarningIndeterminate: !isSame,
          isWarningCheckAll: isCheckAll,
        })
        break
      case USER_RULE_TABLE_OPTIONS.sms:
        this.setState({
          isSmsIndeterminate: !isSame,
          isSmsCheckAll: isCheckAll,
        })
        break
      case USER_RULE_TABLE_OPTIONS.email:
        this.setState({
          isEmailIndeterminate: !isSame,
          isEmailCheckAll: isCheckAll,
        })
        break
    }
  }

  async submit() {
    let { selectedUserID, selectedRoleID } = this.props
    let { cachedData } = this.state
    console.log(selectedUserID, selectedRoleID, cachedData)
    showSuccess(i18n.success)
    /* 
      {
        userID: "",
        roleID: "",
        stationAutos: {
          <station_id>: { manager: true, warning: true, sms: true, email: true}
        }
      }
    */
  }

  isSubmitValidated() {
    let { selectedUserID, selectedRoleID } = this.props
    let isHasCache = _.keys(this.state.cachedData).length !== 0
    let isHaveUserID = selectedUserID !== ''
    let isHaveRoleID = selectedRoleID !== ''
    return isHaveUserID && isHaveRoleID && isHasCache
  }
}
