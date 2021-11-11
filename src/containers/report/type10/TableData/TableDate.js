import { Col, Row, Table, Tabs } from 'antd'
import DataInsight from 'api/DataInsight'
import { Clearfix } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import { translate } from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import { i18n, FIELDS } from '../index'
import _ from 'lodash'

const { TabPane } = Tabs

export default class TabStation extends React.Component {
  state = {
    dataSource: [],
    loading: false,
    activeKey: this.props.stationKeys[0],
  }

  fetchData = async () => {
    const { activeKey } = this.state
    const { dataSearch } = this.props

    const params = {
      stationKeys: activeKey,
      from: dataSearch.from,
      to: dataSearch.to,
      [FIELDS.TIME_TYPE]: dataSearch[FIELDS.TIME_TYPE],
    }

    this.setState({ loading: true })
    try {
      const result = await DataInsight.getDataRatio(
        dataSearch[FIELDS.TIME_TYPE],
        params
      )
      this.setState({
        dataSource: result,
        loading: false,
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onSearch = () => {
    const { stationKeys } = this.props
    this.setState({ activeKey: stationKeys[0] }, () => {
      this.fetchData(stationKeys[0])
    })
  }

  handleOnChange = activeKey => {
    this.setState({ activeKey }, () => {
      this.fetchData()
    })
  }

  render() {
    const { stationKeys, hidden, stationAutos } = this.props
    const { activeKey, dataSource, loading } = this.state
    const stationAutoByKey = _.keyBy(stationAutos, 'key')

    return (
      <div style={{ display: hidden && 'none' }}>
        <Tabs
          activeKey={activeKey}
          defaultActiveKey={activeKey}
          onChange={this.handleOnChange}
        >
          {stationKeys.map(stationKey => {
            return (
              <TabPane tab={stationAutoByKey[stationKey].name} key={stationKey}>
                {_.get(dataSource, '[0].station.activatedAt') && (
                  <Row type="flex" justify="end">
                    <Col>
                      <div style={{ fontWeight: 500 }}>
                        {i18n().header6}:{' '}
                        {moment(dataSource[0].station.activatedAt).format(
                          DD_MM_YYYY
                        )}
                      </div>
                    </Col>
                  </Row>
                )}
                <Clearfix height={8} />
                <TableDate
                  loading={loading}
                  dataSource={!_.isEmpty(dataSource) ? dataSource[0].data : []}
                  dataFrequency={_.get(dataSource, '[0].station.dataFrequency')}
                />
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

class TableDate extends React.Component {
  columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'left',
      render: value => {
        return <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>
      },
    },
    {
      title: i18n().header2,
      align: 'right',
      render: () => {
        return (
          <div>{this.props.dataFrequency ? this.props.dataFrequency : '-'}</div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'totalDesign',
      align: 'right',
      render: value => {
        return <div>{value ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'totalFact',
      align: 'right',
      render: value => {
        return <div>{value ? value : '-'}</div>
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'ratio',
      align: 'right',
      render: value => {
        return <div>{value ? value : '-'}</div>
      },
    },
  ]
  render() {
    const { dataSource, loading } = this.props
    return (
      <Table
        loading={loading}
        size="small"
        rowKey="_id"
        columns={this.columns}
        bordered={true}
        dataSource={dataSource}
        locale={{
          emptyText: translate('dataSearchFrom.table.emptyText'),
        }}
        pagination={false}
      />
    )
  }
}
