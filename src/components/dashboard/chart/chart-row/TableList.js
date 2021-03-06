import { Icon, Tooltip } from 'antd'
import {
  getStatusPriority,
  STATUS_OPTIONS,
  STATUS_STATION,
} from 'constants/stationStatus'
import {
  // warningLevelsNumber,
  warningLevels,
} from 'constants/warningLevels'
import { removeAccentsSort, translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { DATA_COLOR } from 'themes/color'
import { getContent } from 'components/language/language-content'
import { getConfigColor } from 'constants/stationStatus'
import createLanguageHoc from 'hoc/create-lang'

const Status = styled.div`
  width: 16px;
  height: 16px;
  background-color: #1dce6c;
  border-radius: 8px;
`

const Row = styled.div`
  display: flex;
  padding: 8px 0px;
  transition: all 0.2s linear;
  ${props =>
    props.isActive
      ? `
      background-color: #EFF0F0;
      > div {
        color: #0052CC;
      }
      `
      : ''} border-bottom: 1px solid rgba(241, 241, 241, .9);
  &:hover {
    background-color: rgba(241, 241, 241, 0.7);
    cursor: pointer;
  }
`

const Column = styled.div`
  ${props => (props.isTh ? 'font-weight: 600;' : '')};
`

const IndexColumn = styled(Column)`
  width: 30px;
  text-align: center;
  font-weight: 600;
`

const NameColumn = styled(Column)`
  flex: 1;
  padding-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 1;
  height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

const StatusColumn = styled(Column)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 16px;
`

const IconToggle = styled.span`
  transition: all 0.3s linear;
  transform: rotate(-0deg);
  display: inline-block;
  margin-right: 4px;
  margin-left: 4px;
  font-size: 10px;
  position: relative;
  ${props =>
    props.isOpen ? `transform: rotate(90deg);` : `transform: rotate(-90deg);`};
`

const FILTER = {
  name: 'name',
  status: 'status',
}

const FILTER_TYPE = {
  desc: 'desc',
  asc: 'asc',
}

@connect(state => ({
  language: _.get(state, 'language.locale'),
  languageContents: _.get(state, 'language.languageContents'),
  colorData: _.get(state, 'config.color.warningLevel.data.value', []),
}))
@createLanguageHoc
export default class TableListCustom extends React.PureComponent {
  static propTypes = {
    onFilter: PropTypes.func,
    data: PropTypes.any,
    currentItem: PropTypes.shape({
      name: PropTypes.string,
      key: PropTypes.string,
    }),
    onChangeItem: PropTypes.func,
  }

  state = {
    stationStatus: STATUS_STATION.DATA_CONNECTED,
    filter: FILTER.status,
    filterType: FILTER_TYPE.desc,
  }

  renderStationStatus(station) {
    if (station.status === STATUS_STATION.DATA_LOSS)
      return '(' + translate('dashboard.dataLoss') + ')'
    if (station.status === STATUS_STATION.NOT_USE)
      return '(' + translate('dashboard.notUse') + ')'
    return ''
  }

  renderStatusView = station => {
    const { colorData } = this.props
    const { t } = this.props.lang

    let item = _.get(STATUS_OPTIONS, [station.statusAnalytic]) //
    const configColor = getConfigColor(colorData, station.statusAnalytic, {
      defaultPrimary: null,
      defaultSecond: '#ffffff',
    })
    if (item) {
      return (
        <Tooltip
          placement="top"
          title={t(`page.config.color.${station.statusAnalytic}`)}
        >
          <Status
            style={{
              backgroundColor: configColor.primaryColor,
            }}
          />
        </Tooltip>
      )
    }
    return (
      <Status
        style={{
          backgroundColor: 'transparent',
        }}
      />
    )
  }

  timKiemStatusQuaMeasuringLog = (measuringLogs = {}) => {
    let resWarningLevel = null
    _.forEach(measuringLogs, function(item, key) {
      resWarningLevel = getStatusPriority(resWarningLevel, item.warningLevel)
    })
    return resWarningLevel
  }

  getColorItem(item) {
    if (item.status === STATUS_STATION.HIGHTGEST)
      return DATA_COLOR[STATUS_STATION.HIGHTGEST]

    if (item.lastLog) {
      let warLevel = warningLevels.GOOD
      let measuringLogs = item.lastLog.measuringLogs
      for (let key in measuringLogs) {
        warLevel = getStatusPriority(warLevel, measuringLogs[key].warningLevel)
      }
      return DATA_COLOR[warLevel]
    }
    return DATA_COLOR.GOOD
  }

  getStatusItem(item) {
    if (item.status === STATUS_STATION.HIGHTGEST)
      return STATUS_STATION.HIGHTGEST
    if (item.status === STATUS_STATION.NOT_USE) return STATUS_STATION.HIGHTGEST

    if (item.lastLog) {
      let warLevel = warningLevels.GOOD
      let measuringLogs = item.lastLog.measuringLogs
      for (let key in measuringLogs) {
        warLevel = getStatusPriority(warLevel, measuringLogs[key].warningLevel)
      }
      return warLevel
    }
    return STATUS_STATION.DATA_CONNECTED
  }

  sortNameList(data, key, asc = true) {
    // return data.sort(function(a, b) {
    //   const last = objectPath.get(a, key)
    //   const after = objectPath.get(b, key)
    //   if (asc) {
    //     if (last < after) return -1
    //     if (last > after) return 1
    //   } else {
    //     if (last < after) return 1
    //     if (last > after) return -1
    //   }
    //   return 0
    // })

    if (key === 'name') {
      return _.orderBy(
        data,
        [item => removeAccentsSort(item.name.toLowerCase())],
        [asc ? FILTER_TYPE.desc : FILTER_TYPE.asc]
      )
    }
    return _.orderBy(data, [key], [asc ? FILTER_TYPE.desc : FILTER_TYPE.asc])
  }

  handleFilter(filterColumn) {
    if (!this.state.filter || this.state.filter !== filterColumn) {
      this.setState({
        filter: filterColumn,
        filterType: FILTER_TYPE.asc,
      })
    }
    if (this.state.filter === filterColumn) {
      this.setState({
        filter: filterColumn,
        filterType:
          this.state.filterType === FILTER_TYPE.asc
            ? FILTER_TYPE.desc
            : FILTER_TYPE.asc,
      })
    }
  }

  cleanData() {
    return this.props.data.map(item => ({
      ...item,
      statusAnalytic: this.getStatusItem(item),
      // colorStatus: this.getColorItem(item)
    }))
  }

  getData() {
    let data = this.cleanData()
    const filterAsc = this.state.filterType === FILTER_TYPE.asc
    switch (this.state.filter) {
      case FILTER.name:
        data = this.sortNameList(data, 'name', filterAsc)
        break
      case FILTER.status:
        data = this.sortNameList(data, 'statusAnalytic', filterAsc)
        break
      default:
    }
    return data
  }

  render() {
    const { languageContents } = this.props
    return (
      <div style={{ height: 450, minWidth: 300, overflow: 'scroll' }}>
        <Row>
          <IndexColumn isTh>#</IndexColumn>
          <NameColumn onClick={() => this.handleFilter('name')} isTh>
            {translate('dashboard.tableList.name')}
            <IconToggle
              isOpen={
                this.state.filter === 'name' &&
                this.state.filterType === FILTER_TYPE.asc
              }
            >
              {' '}
              <Icon type="caret-right" />
            </IconToggle>
          </NameColumn>
          <StatusColumn onClick={() => this.handleFilter('status')} isTh>
            {translate('dashboard.tableList.dataStatus')}
            <IconToggle
              isOpen={
                this.state.filter === 'status' &&
                this.state.filterType === FILTER_TYPE.asc
              }
            >
              {' '}
              <Icon type="caret-right" />
            </IconToggle>
          </StatusColumn>
        </Row>
        {this.getData().map((item, index) => (
          <Row
            onClick={e => this.props.onChangeItem(e, item)}
            key={item.key}
            isActive={this.props.currentItem.key === item.key}
          >
            <IndexColumn>{index + 1}</IndexColumn>
            <NameColumn className="name">
              {getContent(languageContents, {
                type: 'Station',
                itemId: item._id,
                field: 'name',
                value: item.name,
              })}
            </NameColumn>
            <StatusColumn> {this.renderStatusView(item)}</StatusColumn>
          </Row>
        ))}
      </div>
    )
  }
}
