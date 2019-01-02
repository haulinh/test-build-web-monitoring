import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import * as _ from 'lodash'
import moment from 'moment/moment'

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataAqiHours: PropTypes.array,
    dataAqiDays: PropTypes.array,
    loading: PropTypes.bool
  }

  getColumns() {
    const columns = [
      {
        title: translate('statistic.aqi.time'),
        children:[
          {
            title: translate('statistic.aqi.day'),
            align:'center',
            dataIndex: 'timeDay',
            key: 'timeDay',
            width: 100
          }
        ]
      },
      {
        title: translate('statistic.aqi.title'),
        children:[
          {
            title: '00',
            align:'center',
            dataIndex: '00',
            key: '00',
            width: 50
          },
          {
            title: '01',
            align:'center',
            dataIndex: '01',
            key: '01',
            width: 50
          },
          {
            title: '02',
            align:'center',
            dataIndex: '02',
            key: '02',
            width: 50
          },
          {
            title: '03',
            align:'center',
            dataIndex: '03',
            key: '03',
            width: 50
          },
          {
            title: '04',
            align:'center',
            dataIndex: '04',
            key: '04',
            width: 50
          },
          {
            title: '05',
            align:'center',
            dataIndex: '05',
            key: '05',
            width: 50
          },
          {
            title: '06',
            align:'center',
            dataIndex: '06',
            key: '06',
            width: 50
          },
          {
            title: '07',
            align:'center',
            dataIndex: '07',
            key: '07',
            width: 50
          },
          {
            title: '08',
            align:'center',
            dataIndex: '08',
            key: '08',
            width: 50
          },
          {
            title: '09',
            align:'center',
            dataIndex: '09',
            key: '09',
            width: 50
          },
          {
            title: '10',
            align:'center',
            dataIndex: '10',
            key: '10',
            width: 50
          },
          {
            title: '11',
            align:'center',
            dataIndex: '11',
            key: '11',
            width: 50
          },
          {
            title: '12',
            align:'center',
            dataIndex: '12',
            key: '12',
            width: 50
          },
          {
            title: '13',
            align:'center',
            dataIndex: '13',
            key: '13',
            width: 50
          },
          {
            title: '14',
            align:'center',
            dataIndex: '14',
            key: '14',
            width: 50
          },
          {
            title: '15',
            align:'center',
            dataIndex: '15',
            key: '15',
            width: 50
          },
          {
            title: '16',
            align:'center',
            dataIndex: '16',
            key: '16',
            width: 50
          },
          {
            title: '17',
            align:'center',
            dataIndex: '17',
            key: '17',
            width: 50
          },
          {
            title: '18',
            align:'center',
            dataIndex: '18',
            key: '18',
            width: 50
          },
          {
            title: '19',
            align:'center',
            dataIndex: '19',
            key: '19',
            width: 50
          },
          {
            title: '20',
            align:'center',
            dataIndex: '20',
            key: '20',
            width: 50
          },
          {
            title: '21',
            align:'center',
            dataIndex: '21',
            key: '21',
            width: 50
          },
          {
            title: '22',
            align:'center',
            dataIndex: '22',
            key: '22',
            width: 50
          },
          {
            title: '23',
            align:'center',
            dataIndex: '23',
            key: '23',
            width: 50
          }
        ]
      },
      {
        title: 'AQI',
        children:[
          {
            title: translate('statistic.aqi.day'),
            align:'center',
            dataIndex: 'AQI',
            key: 'AQI',
            width: 100
          }
        ]
      },
    ]
    return columns
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataAqiHours, this.props.dataAqiHours)) {
      this.setState({ dataAqiHours: nextProps.dataAqiHours })
    }
    if (!_.isEqual(nextProps.dataAqiDays, this.props.dataAqiDays)) {
      this.setState({ dataAqiDays: nextProps.dataAqiDays })
    }
  }

  getDataAQI () {
    const dataAQI = []
    _.forEachRight(this.props.dataAqiDays, (item) => {
      const dataAqiHours = _.groupBy(this.props.dataAqiHours, record => moment(record.receivedAt).format('DD/MM/YYYY'))
      const listAqiHours = _.get(dataAqiHours, moment(item.receivedAt).format('DD/MM/YYYY'), [])
      const dataAqiday = {
        AQI: item.value,
        timeDay: moment(item.receivedAt).format('DD')
      }
      dataAQI.push({
         ...dataAqiday,
         ...this.getDataAqiHours(listAqiHours)
        })
      })
    return dataAQI
  }

  getDataAqiHours = (data) => {
    let dataAqiHours = {}
    _.forEachRight(data, (item) =>{
     return dataAqiHours = {...dataAqiHours, [moment(item.receivedAt).format('HH')]: item.value}
    })
    return dataAqiHours
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    this.getDataAQI()
    return (
      <div>
        <Table
          size="small"
          rowKey="timeDay"
          bordered
          columns={this.getColumns()}
          dataSource = {this.getDataAQI()}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
