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

const i18n = {
  cancel: 'Bõ chọn' /* MARK  @translate */,
  submit: translate('addon.save'),
  updateSuccess: translate('addon.onSave.update.success'),
  updateError: translate('addon.onSave.update.error'),
  stationName: translate('stationAutoManager.form.name.label'),
  stationAddr: translate('stationAutoManager.form.address.label'),
  allowSampling: translate('stationAutoManager.options.allowSampling.label')
}

const showSuccess = msg => {
  message.success(`${msg}`)
}

const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

@protectRole(ROLE.CAU_HINH_LAY_MAU.VIEW)
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
export default class StationAutoConfigSampling extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pagination: PropTypes.object,
    data: PropTypes.object,
    onChangeSearch: PropTypes.func,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    dataSource: []
  }

  constructor(props) {
    super(props)
    this.state = {
      /* giông cách hoạt động của git */

      cachedData: {} /* commit */,
      dataSource: [] /* working dir */,
      dataSourceOriginal: [] /* index */,

      isSave: false,

      isSamplingIndeterminate: true,
      isSamplingCheckAll: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource.length !== this.state.dataSourceOriginal.length) {
      this.setState({
        dataSourceOriginal: _.cloneDeep(nextProps.dataSource),
        dataSource: _.cloneDeep(nextProps.dataSource)
      })
      this.checkIndeterminate(
        SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING,
        nextProps.dataSource
      )
    }
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['configSampling']} />

        {/* FORM CONTROL */}
        <Row style={{ marginBottom: 20 }}>
          <StationAutoSearchForm
            onChangeSearch={this.props.onChangeSearch}
            initialValues={this.props.data}
          />
        </Row>

        {/* TABLE */}
        <Row style={{ marginBottom: 50 }}>
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

        <Row style={{ marginBottom: 16 }}>
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
    return [
      { content: '#', width: 2 },
      { content: i18n.stationName, width: 15 },
      { content: i18n.stationAddr, width: 20 },
      {
        content: (
          <div>
            <Checkbox
              indeterminate={this.state.isSamplingIndeterminate}
              checked={this.state.isSamplingCheckAll}
              onChange={e =>
                this.onChagedOptionOfHeader(
                  SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING,
                  e.target.checked
                )
              }
            >
              {i18n.allowSampling}
            </Checkbox>
          </div>
        ),
        width: 15
      }
    ]
  }

  getRows() {
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
                  checked={_.get(
                    row,
                    [
                      'options',
                      SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING,
                      'allowed'
                    ],
                    false
                  )}
                  onChange={e =>
                    this.onChagedOptionOfRow({
                      row,
                      key: SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING,
                      value: e.target.checked
                    })
                  }
                />
              </div>
            )
          }
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
    /* 
    - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
    - update cached
    */
    _.forEach(_dataSource, station => {
      let isDiffValue =
        _.get(station, ['options', column, 'allowed']) !== checked
      if (isDiffValue) {
        this.onChagedOptionOfRow({ row: station, key: column, value: checked })
      }
    })

    this.setState({
      isSamplingCheckAll: checked,
      isSamplingIndeterminate: false
    })
  }

  onChagedOptionOfRow({ row, key, value }) {
    this.updateDataSource(row, key, value)
    this.updateCache(row, key, value)
    this.checkIndeterminate(key, this.state.dataSource)
  }

  updateDataSource(row, key, value) {
    let _dataSource = this.state.dataSource
    let indexOfRow = _.findIndex(
      _dataSource,
      stationAuto => stationAuto._id === row._id
    )
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

    let indexOfRow = _.findIndex(
      _dataSourceOriginal,
      stationAuto => stationAuto._id === row._id
    )
    let originalOption = _.get(
      _dataSourceOriginal[indexOfRow],
      ['options', key, 'allowed'],
      false
    )
    let currentValueInCache = _.get(_cachedData, [row._id, key])

    if (currentValueInCache) {
      delete _cachedData[row._id][key]
      if (_.keys(_cachedData[row._id]).length === 0) {
        delete _cachedData[row._id]
      }
    } else if (originalOption !== value) {
      _.set(_cachedData, [row._id, key, 'allowed'], value)
    }

    this.setState({ cachedData: _cachedData })
  }

  clearCache() {
    this.setState({
      dataSource: _.clone(this.state.dataSourceOriginal),
      cachedData: {}
    })
  }

  checkIndeterminate(column, _dataSource) {
    let result = _.map(_dataSource, station => {
      return _.get(station, ['options', column, 'allowed'])
    })

    let countBy = _.countBy(result, Boolean)
    let isSame = countBy.false === undefined || countBy.true === undefined
    let isCheckAll = _.every(result)

    switch (column) {
      case SAMPLING_CONFIG_TABLE_COLUMN.SAMPLING:
        this.setState({
          isSamplingIndeterminate: !isSame,
          isSamplingCheckAll: isCheckAll
        })
        break
      default:
        break
    }
  }

  async submitCache() {
    this.setState({ isSave: true })
    const res = await updateStationAutoOptions(this.state.cachedData)
    if (res.success) {
      this.setState({
        dataSourceOriginal: _.cloneDeep(this.state.dataSource),
        cachedData: {}
      })
      showSuccess(i18n.updateSuccess)
    } else if (res.error) {
      swal({
        title: i18n.updateError,
        type: 'error'
      })
    }

    this.setState({ isSave: false })
  }
}
